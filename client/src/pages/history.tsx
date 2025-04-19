import { useState } from 'react';
import { useVehicleData } from '@/hooks/use-vehicle-data';
import { VehicleData } from '@shared/schema';
import { useDiagnosticSessions } from '@/hooks/use-diagnostic-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function History() {
  const { dataHistory } = useVehicleData(); // Keep for backward compatibility
  const { data: sessions = [], isLoading, isError } = useDiagnosticSessions();
  const [activeTab, setActiveTab] = useState('sessions');
  
  const formatTimestamp = (timestamp: Date | number) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all diagnostic history? This cannot be undone.')) {
      // TODO: Implement database clear functionality
      alert('This feature will be implemented soon.');
    }
  };

  const exportSessionData = (sessionId: number) => {
    // TODO: Implement export functionality with database data
    alert(`Export for session ${sessionId} will be implemented soon.`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">Diagnostic History</h1>
          <p className="text-gray-600">View and analyze past diagnostic sessions</p>
        </div>
        <div className="mt-2 md:mt-0 space-x-2">
          <Button 
            variant="outline" 
            onClick={handleClearHistory}
            disabled={!sessions || sessions.length === 0}
          >
            <i className="ri-delete-bin-line mr-1.5"></i>
            Clear History
          </Button>
          <Button 
            onClick={() => {
              // TODO: Implement export all functionality with database data
              alert('Export all feature will be implemented soon.');
            }}
            disabled={!sessions || sessions.length === 0}
          >
            <i className="ri-file-download-line mr-1.5"></i>
            Export All
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sessions" className="flex items-center">
            <i className="ri-history-line mr-1.5"></i>
            Diagnostic Sessions
          </TabsTrigger>
          <TabsTrigger value="dtcs" className="flex items-center">
            <i className="ri-error-warning-line mr-1.5"></i>
            Trouble Code History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="w-1/2">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                      </div>
                      <div className="mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Skeleton className="h-3 w-20 mb-2" />
                          <Skeleton className="h-5 w-40" />
                        </div>
                        <div>
                          <Skeleton className="h-3 w-20 mb-2" />
                          <Skeleton className="h-5 w-40" />
                        </div>
                        <div>
                          <Skeleton className="h-3 w-20 mb-2" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="p-8 text-center">
                  <i className="ri-error-warning-line text-4xl text-red-300 mb-2"></i>
                  <p className="text-red-500">Error loading diagnostic sessions</p>
                </div>
              ) : !sessions || sessions.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="ri-history-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">No diagnostic sessions found in history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Session #{sessions.length - index}</h3>
                          <p className="text-sm text-gray-600">
                            {formatTimestamp(session.startTime)}
                            {session.endTime && ` - ${formatTimestamp(session.endTime)}`}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => exportSessionData(session.id)}
                        >
                          <i className="ri-download-line mr-1"></i>
                          Export
                        </Button>
                      </div>
                      <div className="mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Vehicle Type</p>
                          <p className="text-sm font-medium capitalize">
                            {session.vehicleType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Connection Method</p>
                          <p className="text-sm font-medium uppercase">
                            {session.connectionMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Protocol</p>
                          <p className="text-sm font-medium uppercase">
                            {session.protocol}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dtcs">
          <Card>
            <CardHeader>
              <CardTitle>Trouble Code History</CardTitle>
            </CardHeader>
            <CardContent>
              {dataHistory.length === 0 || !dataHistory.some(session => session.troubleCodes && session.troubleCodes.length > 0) ? (
                <div className="p-8 text-center">
                  <i className="ri-error-warning-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">No trouble codes found in diagnostic history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dataHistory
                    .filter(session => session.troubleCodes && session.troubleCodes.length > 0)
                    .map((session, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {session.vehicleInfo ? 
                                `${session.vehicleInfo.year} ${session.vehicleInfo.make} ${session.vehicleInfo.model}` :
                                'Unknown Vehicle'
                              }
                            </h3>
                            <p className="text-sm text-gray-600">{formatTimestamp(session.timestamp)}</p>
                          </div>
                          <StatusBadge status="warning">
                            {session.troubleCodes?.length} code(s)
                          </StatusBadge>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <ul className="space-y-2">
                            {session.troubleCodes?.map((code, codeIndex) => (
                              <li key={codeIndex} className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{code.code}</span>
                                  <span className="mx-2 text-gray-400">-</span>
                                  <span className="text-sm text-gray-600">{code.description}</span>
                                </div>
                                <StatusBadge 
                                  status={
                                    code.severity === 'high' ? 'error' : 
                                    code.severity === 'medium' ? 'warning' : 
                                    'info'
                                  }
                                >
                                  {code.severity}
                                </StatusBadge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
