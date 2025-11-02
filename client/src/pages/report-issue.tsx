import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { IssueCategory, IssueSeverity } from '@shared/schema';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, SendIcon, AlertTriangle } from 'lucide-react';

// Form schema
const issueReportSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters long',
  }).max(100, {
    message: 'Title must not exceed 100 characters',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters long',
  }).max(1000, {
    message: 'Description must not exceed 1000 characters',
  }),
  category: z.string({
    required_error: 'Please select an issue category',
  }),
  severity: z.string({
    required_error: 'Please select issue severity',
  }),
  deviceInfo: z.any().optional(),
});

type IssueReportFormValues = z.infer<typeof issueReportSchema>;

export default function ReportIssuePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Collect device info
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  
  useEffect(() => {
    // Collect basic device and browser info
    const collectDeviceInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        timestamp: new Date().toISOString(),
      };
      setDeviceInfo(info);
    };
    
    collectDeviceInfo();
  }, []);
  
  // Session ID for tracking
  const [sessionId] = useState(() => {
    // Generate a random session ID if one doesn't exist
    const existingId = localStorage.getItem('diagnosticSessionId');
    if (existingId) return existingId;
    
    const newId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('diagnosticSessionId', newId);
    return newId;
  });
  
  // Form definition
  const form = useForm<IssueReportFormValues>({
    resolver: zodResolver(issueReportSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      severity: undefined,
      deviceInfo: {},
    },
  });
  
  // Submit handler - submits to both Netlify Forms and API (if available)
  const onSubmit = async (values: IssueReportFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add device info to the form values
      values.deviceInfo = deviceInfo;
      
      // Prepare form data for Netlify
      const formData = new FormData();
      formData.append('form-name', 'report-issue');
      formData.append('title', values.title);
      formData.append('category', values.category || '');
      formData.append('severity', values.severity || '');
      formData.append('description', values.description);
      formData.append('deviceInfo', JSON.stringify(deviceInfo));
      formData.append('sessionId', sessionId);
      
      // Submit to Netlify Forms
      const netlifyResponse = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });
      
      if (netlifyResponse.ok) {
        // Try to also submit to API if available (for local development)
        try {
          const response = await apiRequest(
            'POST',
            '/api/issues',
            {
              ...values,
              sessionId,
            }
          );
          // API submission is optional - don't fail if it doesn't work
        } catch (apiError) {
          console.log('API submission failed (expected on Netlify):', apiError);
        }
        
        toast({
          title: 'Issue Reported',
          description: 'Thank you for your feedback. Your issue has been reported successfully.',
        });
        form.reset();
        navigate('/');
      } else {
        throw new Error('Failed to submit issue report to Netlify');
      }
    } catch (error) {
      console.error('Error submitting issue report:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit issue report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-8 max-w-3xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-primary">Report an Issue</CardTitle>
          <CardDescription>
            Help us improve by reporting any issues or suggesting improvements.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center mb-6 space-x-2 text-amber-500">
            <AlertTriangle size={20} />
            <p className="text-sm">Your report will help us fix issues and improve the application.</p>
          </div>
          
          <Separator className="mb-6" />
          
          <Form {...form}>
            <form 
              name="report-issue" 
              method="POST" 
              data-netlify="true" 
              netlify-honeypot="bot-field"
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              {/* Hidden Netlify form fields */}
              <input type="hidden" name="form-name" value="report-issue" />
              <input type="hidden" name="bot-field" />
              
              {/* Hidden fields for Netlify form submission */}
              <input type="hidden" name="title" value={form.watch('title') || ''} />
              <input type="hidden" name="category" value={form.watch('category') || ''} />
              <input type="hidden" name="severity" value={form.watch('severity') || ''} />
              <input type="hidden" name="description" value={form.watch('description') || ''} />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the issue" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a short descriptive title for the issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={IssueCategory.CONNECTION}>Connection Issues</SelectItem>
                          <SelectItem value={IssueCategory.DIAGNOSTICS}>Diagnostic Problems</SelectItem>
                          <SelectItem value={IssueCategory.INTERFACE}>User Interface</SelectItem>
                          <SelectItem value={IssueCategory.PERFORMANCE}>Performance</SelectItem>
                          <SelectItem value={IssueCategory.COMPATIBILITY}>Compatibility</SelectItem>
                          <SelectItem value={IssueCategory.OTHER}>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={IssueSeverity.LOW}>Low - Minor inconvenience</SelectItem>
                          <SelectItem value={IssueSeverity.MEDIUM}>Medium - Affects functionality</SelectItem>
                          <SelectItem value={IssueSeverity.HIGH}>High - Major functionality broken</SelectItem>
                          <SelectItem value={IssueSeverity.CRITICAL}>Critical - Application unusable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe the issue in detail. Include steps to reproduce if applicable." 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Be as specific as possible to help us understand and fix the issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <CardFooter className="flex justify-end px-0">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'} 
                  {!isSubmitting && <SendIcon className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}