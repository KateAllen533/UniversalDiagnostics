import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertTriangle, Scale, Gavel } from 'lucide-react';
import { useLocation } from 'wouter';

export default function TermsOfUse() {
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
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Terms of Use</h1>
        </div>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Acceptance of Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            By accessing and using Universal Vehicle Diagnostics ("the Application"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use the Application.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Disclaimer of Warranties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Educational and Diagnostic Purposes Only:</strong> Universal Vehicle Diagnostics is provided for educational and diagnostic purposes only. The Application is not a substitute for professional automotive service or repair.
          </p>
          <p>
            <strong className="text-foreground">No Warranty:</strong> THE APPLICATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            <strong className="text-foreground">Accuracy:</strong> While we strive to provide accurate diagnostic information, we make no representations or warranties regarding the accuracy, reliability, or completeness of the diagnostic data or recommendations provided by the Application.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            IN NO EVENT SHALL UNIVERSAL VEHICLE DIAGNOSTICS, ITS DEVELOPERS, OR AFFILIATES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF OR INABILITY TO USE THE APPLICATION.
          </p>
          <p>
            This includes, but is not limited to, damages for loss of profits, data, or other intangible losses, even if we have been advised of the possibility of such damages.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>You agree to:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Use the Application only for lawful purposes</li>
            <li>Not attempt to reverse engineer, decompile, or disassemble the Application</li>
            <li>Not use the Application in any way that could damage, disable, or impair the service</li>
            <li>Not use the Application to violate any applicable laws or regulations</li>
            <li>Take full responsibility for any actions taken based on diagnostic information</li>
            <li>Consult with qualified automotive professionals for vehicle repairs</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The Application and its original content, features, and functionality are owned by Global Technology Consulting LLC and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p>
            You may not copy, modify, distribute, sell, or lease any part of the Application without prior written permission.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prohibited Uses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>You may not use the Application:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
            <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
            <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Modifications to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date. Your continued use of the Application after such modifications constitutes acceptance of the updated terms.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            Governing Law
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            These Terms of Use shall be governed by and construed in accordance with the laws of the jurisdiction in which Global Technology Consulting LLC operates, without regard to its conflict of law provisions.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Severability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            If any provision of these Terms of Use is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            If you have any questions about these Terms of Use, please contact us:
          </p>
          <p>
            <strong className="text-foreground">Email:</strong> legal@universaldiagnostics.com
          </p>
          <p>
            <strong className="text-foreground">Website:</strong> <a href="https://www.s-tecm.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NovarisAI</a>
          </p>
          <p className="pt-4 border-t border-border">
            <strong className="text-foreground">Copyright Notice:</strong> Universal Vehicle Diagnostics &copy; {new Date().getFullYear()}. All rights reserved. Powered by <a href="https://www.s-tecm.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">NovarisAI</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

