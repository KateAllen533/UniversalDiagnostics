import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, FileCheck } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PrivacyPolicy() {
  const [, navigate] = useLocation();

  return (
    <div className="container py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Universal Vehicle Diagnostics ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our diagnostic application.
          </p>
          <p>
            By using Universal Vehicle Diagnostics, you agree to the collection and use of information in accordance with this policy.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Vehicle Diagnostic Data</h3>
            <p>
              We collect diagnostic information from your vehicle including trouble codes, sensor readings, vehicle identification numbers (VIN), and performance metrics. This data is stored locally in your browser and is not transmitted to external servers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Usage Information</h3>
            <p>
              We may collect information about how you use the application, including pages visited, features used, and diagnostic sessions performed. This helps us improve the application.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Device Information</h3>
            <p>
              When you report an issue, we may collect device information such as browser type, operating system, and screen resolution to help diagnose technical problems.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            How We Use Your Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <ul className="space-y-2 list-disc pl-5">
            <li>To provide and maintain our diagnostic services</li>
            <li>To improve and optimize the application</li>
            <li>To respond to your support requests</li>
            <li>To analyze usage patterns and trends</li>
            <li>To ensure the security and integrity of the application</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Storage and Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Local Storage:</strong> All diagnostic data is stored locally in your browser using localStorage. This means your vehicle data never leaves your device unless you explicitly choose to export it.
          </p>
          <p>
            <strong className="text-foreground">Security Measures:</strong> We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
          <p>
            <strong className="text-foreground">Data Retention:</strong> Your diagnostic data is retained in your browser until you clear your browser's local storage or uninstall the application.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Universal Vehicle Diagnostics may use third-party services for analytics and error reporting. These services may collect anonymous usage data. We do not share your vehicle diagnostic data with third parties.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>You have the right to:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Access your stored diagnostic data</li>
            <li>Delete your diagnostic data by clearing browser storage</li>
            <li>Export your diagnostic data</li>
            <li>Opt out of analytics tracking</li>
            <li>Request information about data we collect</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Our application is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <p>
            <strong className="text-foreground">Email:</strong> support@universaldiagnostics.com
          </p>
          <p>
            <strong className="text-foreground">Website:</strong> <a href="https://www.s-tecm.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NovarisAI</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

