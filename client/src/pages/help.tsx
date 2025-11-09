import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, BookOpen, MessageCircle, Video, FileText } from 'lucide-react';
import { useLocation } from 'wouter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Help() {
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
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Get help with Universal Vehicle Diagnostics. Find answers to common questions and learn how to use all features.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <BookOpen className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn the basics of using the diagnostic tool</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• How to connect your vehicle</li>
              <li>• Understanding diagnostic codes</li>
              <li>• Reading vehicle data</li>
              <li>• Using advanced diagnostics</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <MessageCircle className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Get help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Need additional help? Our support team is here to assist you.
            </p>
            <Button onClick={() => navigate('/report-issue')} className="w-full">
              Report an Issue
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions and answers</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I connect my vehicle?</AccordionTrigger>
              <AccordionContent>
                You can connect your vehicle using USB, USB-C, or Bluetooth. Go to the Dashboard and click "Connect to Vehicle" to start. Make sure your diagnostic adapter is properly connected and your vehicle's ignition is on.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What diagnostic protocols are supported?</AccordionTrigger>
              <AccordionContent>
                Universal Diagnostics supports multiple protocols including OBD-II, CAN, and manufacturer-specific protocols. The system automatically detects the best protocol for your vehicle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do I read trouble codes?</AccordionTrigger>
              <AccordionContent>
                Navigate to the Diagnostics page and click "Read Codes". The system will scan your vehicle's ECU and display any trouble codes along with descriptions and recommended actions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I use this with electric vehicles?</AccordionTrigger>
              <AccordionContent>
                Yes! Universal Diagnostics supports both traditional combustion engine vehicles and electric vehicles. The system adapts to your vehicle type and provides relevant diagnostic information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How do I clear trouble codes?</AccordionTrigger>
              <AccordionContent>
                After reading codes, you can clear them from the Diagnostics page. Note: Only clear codes after addressing the underlying issue. Some codes will return if the problem persists.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What is the G2 Turbo feature?</AccordionTrigger>
              <AccordionContent>
                G2 Turbo provides advanced diagnostic capabilities including key programming, EEPROM operations, system adaptation, and advanced control functions. This feature is designed for professional technicians.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>How do I view diagnostic history?</AccordionTrigger>
              <AccordionContent>
                All diagnostic sessions are saved automatically. Go to the History page to view past sessions, see trends, and track your vehicle's diagnostic data over time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                Yes, we take data security seriously. All diagnostic data is stored locally in your browser. We do not transmit sensitive vehicle information to external servers. See our Privacy Policy for more details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" onClick={() => navigate('/diagnostics')} className="h-auto py-4 flex-col">
              <FileText className="h-5 w-5 mb-2" />
              <span>Diagnostics Guide</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/settings')} className="h-auto py-4 flex-col">
              <Video className="h-5 w-5 mb-2" />
              <span>Settings</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/report-issue')} className="h-auto py-4 flex-col">
              <MessageCircle className="h-5 w-5 mb-2" />
              <span>Report Issue</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

