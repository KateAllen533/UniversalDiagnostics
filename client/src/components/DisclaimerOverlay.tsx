import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface DisclaimerOverlayProps {
  isVisible: boolean;
  onAccept: () => void;
}

export default function DisclaimerOverlay({ isVisible, onAccept }: DisclaimerOverlayProps) {
  const [accepted, setAccepted] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-dark-blue mb-4">Important Disclaimer</h2>
        <div className="border-l-4 border-warning bg-yellow-50 p-4 mb-4">
          <p className="text-sm text-dark font-medium">
            This diagnostic tool is provided as-is. By proceeding, you acknowledge the following terms:
          </p>
        </div>
        <ul className="list-disc pl-5 mb-6 space-y-2 text-dark">
          <li>Use this tool at your own risk. We are not responsible for any damages that may occur to your vehicle.</li>
          <li>You must comply with your vehicle manufacturer's requirements, including warranty and safety standards.</li>
          <li>We are not liable for misdiagnosis, voided warranties, or any other consequences resulting from the use of this tool.</li>
          <li>Some vehicle manufacturers may consider the use of third-party diagnostic tools a violation of warranty terms.</li>
          <li>This application communicates with your vehicle's onboard systems; improper use could potentially harm vehicle components.</li>
        </ul>
        <p className="font-medium text-dark mb-6">
          This application requires a local server running on your computer to communicate with your vehicle's diagnostic port. Please follow the setup instructions before proceeding.
        </p>
        <div className="flex items-center mb-6">
          <Checkbox 
            id="acceptDisclaimer" 
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked === true)}
            className="h-5 w-5"
          />
          <label htmlFor="acceptDisclaimer" className="ml-2 block text-dark">
            I understand and accept these terms and conditions
          </label>
        </div>
        <Button 
          disabled={!accepted} 
          onClick={onAccept} 
          className="w-full py-3"
          variant={accepted ? "default" : "outline"}
        >
          Proceed to Diagnostics
        </Button>
      </div>
    </div>
  );
}
