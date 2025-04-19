import { StatusBadge } from '@/components/ui/status-badge';
import { TroubleCode } from '@/lib/vehicleTypes';

interface DiagnosticSummaryCardProps {
  troubleCodes?: TroubleCode[];
  milStatus?: string;
  readiness?: string;
  isConnected: boolean;
}

export default function DiagnosticSummaryCard({ 
  troubleCodes, 
  milStatus, 
  readiness, 
  isConnected 
}: DiagnosticSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-blue">Diagnostic Summary</h3>
          <p className="text-sm text-gray-500">Status and trouble codes</p>
        </div>
        <StatusBadge status={isConnected ? 'success' : 'default'}>
          <i className={`${isConnected ? 'ri-checkbox-circle-line' : 'ri-information-line'} mr-1`}></i>
          {isConnected ? 'Connected' : 'Not Available'}
        </StatusBadge>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Trouble Codes</span>
            <span className="text-sm text-gray-500">{troubleCodes?.length || 0} found</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-md text-center">
            {troubleCodes && troubleCodes.length > 0 ? (
              <div className="space-y-2">
                {troubleCodes.map((code, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{code.code}</span>
                    <span className="text-sm">{code.description}</span>
                    <StatusBadge 
                      status={
                        code.severity === 'high' ? 'error' : 
                        code.severity === 'medium' ? 'warning' : 'info'
                      }
                    >
                      {code.severity}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No trouble codes detected</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">MIL Status</p>
            <p className="text-sm font-medium text-gray-800">{milStatus || '--'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Readiness</p>
            <p className="text-sm font-medium text-gray-800">{readiness || '--'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
