import { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from '@/lib/websocket';
import { 
  ConnectionSettings, 
  MessageType, 
  ConnectionMethod, 
  VehicleType, 
  ProtocolType,
  WebSocketMessage,
  ConnectRequestPayload,
  ConnectResponsePayload
} from '@/lib/vehicleTypes';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface UseConnectionReturn {
  connectionStatus: ConnectionStatus;
  connect: (settings: ConnectionSettings) => void;
  disconnect: () => void;
  connectionError: string | null;
  connectionInfo: {
    deviceName: string;
    protocol: string;
  } | null;
  isServerRunning: boolean;
}

export function useConnection(): UseConnectionReturn {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<{ deviceName: string; protocol: string } | null>(null);
  const [isServerRunning, setIsServerRunning] = useState<boolean>(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      
      switch (message.type) {
        case MessageType.CONNECT_RESPONSE:
          const response = message.payload as ConnectResponsePayload;
          if (response.success) {
            setConnectionStatus('connected');
            setConnectionInfo(response.connectionInfo || null);
            setConnectionError(null);
          } else {
            setConnectionStatus('error');
            setConnectionError(response.message);
          }
          break;
          
        case MessageType.DISCONNECT_RESPONSE:
          setConnectionStatus('disconnected');
          setConnectionInfo(null);
          break;
          
        case MessageType.ERROR:
          setConnectionStatus('error');
          setConnectionError(message.payload.message);
          break;
          
        case MessageType.SERVER_STATUS:
          setIsServerRunning(message.payload.status.isRunning);
          break;
          
        default:
          // Ignore other message types
          break;
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, []);

  const { 
    status: socketStatus, 
    sendMessage,
    connect: connectSocket,
    disconnect: disconnectSocket 
  } = useWebSocket({
    onMessage: handleMessage,
    autoConnect: true
  });

  // Update connection status based on socket status
  useEffect(() => {
    if (socketStatus === 'error') {
      setConnectionStatus('error');
      setConnectionError('WebSocket connection error');
    } else if (socketStatus === 'closed' && connectionStatus === 'connected') {
      setConnectionStatus('disconnected');
      setConnectionInfo(null);
    }
  }, [socketStatus, connectionStatus]);

  // Connect to vehicle
  const connect = useCallback((settings: ConnectionSettings) => {
    if (socketStatus !== 'open') {
      connectSocket();
      setTimeout(() => {
        setConnectionStatus('connecting');
        const payload: ConnectRequestPayload = { settings };
        sendMessage({
          type: MessageType.CONNECT_REQUEST,
          payload
        });
      }, 500); // Give socket time to connect
    } else {
      setConnectionStatus('connecting');
      const payload: ConnectRequestPayload = { settings };
      sendMessage({
        type: MessageType.CONNECT_REQUEST,
        payload
      });
    }
  }, [socketStatus, sendMessage, connectSocket]);

  // Disconnect from vehicle
  const disconnect = useCallback(() => {
    sendMessage({
      type: MessageType.DISCONNECT_REQUEST,
      payload: {}
    });
  }, [sendMessage]);

  return {
    connectionStatus,
    connect,
    disconnect,
    connectionError,
    connectionInfo,
    isServerRunning
  };
}
