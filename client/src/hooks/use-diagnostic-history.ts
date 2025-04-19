import { useQuery } from '@tanstack/react-query';
import { DiagnosticSession, VehicleDataPoint, TroubleCodeRecord } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';

export type SessionWithData = DiagnosticSession & {
  vehicleDataPoints?: VehicleDataPoint[];
  troubleCodes?: TroubleCodeRecord[];
};

export function useDiagnosticSessions() {
  return useQuery<DiagnosticSession[]>({
    queryKey: ['/api/sessions'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
}

export function useDiagnosticSession(sessionId: number) {
  return useQuery({
    queryKey: ['/api/sessions', sessionId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!sessionId,
  });
}

export function useSessionVehicleData(sessionId: number) {
  return useQuery({
    queryKey: ['/api/sessions', sessionId, 'data'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!sessionId,
  });
}

export function useSessionTroubleCodes(sessionId: number) {
  return useQuery({
    queryKey: ['/api/sessions', sessionId, 'codes'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!sessionId,
  });
}

/**
 * Combines session data, vehicle data points, and trouble codes into a single query
 */
export function useSessionWithData(sessionId: number) {
  const sessionQuery = useDiagnosticSession(sessionId);
  const dataQuery = useSessionVehicleData(sessionId);
  const codesQuery = useSessionTroubleCodes(sessionId);
  
  const isLoading = sessionQuery.isLoading || dataQuery.isLoading || codesQuery.isLoading;
  const isError = sessionQuery.isError || dataQuery.isError || codesQuery.isError;
  
  const data: SessionWithData | undefined = sessionQuery.data 
    ? {
        ...sessionQuery.data,
        vehicleDataPoints: dataQuery.data || [],
        troubleCodes: codesQuery.data || []
      } as SessionWithData
    : undefined;
  
  return {
    data,
    isLoading,
    isError
  };
}