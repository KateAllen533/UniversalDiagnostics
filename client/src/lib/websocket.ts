import { useState, useEffect, useCallback, useRef } from 'react';

export type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface UseWebSocketOptions {
  onOpen?: (event: Event, socket: WebSocket) => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  autoConnect?: boolean;
}

export interface WebSocketHook {
  status: WebSocketStatus;
  sendMessage: (data: string | object) => void;
  connect: () => void;
  disconnect: () => void;
  lastMessage: MessageEvent | null;
}

export function useWebSocket(options: UseWebSocketOptions = {}): WebSocketHook {
  const {
    onOpen,
    onMessage,
    onClose,
    onError,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    autoConnect = true,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);

  const createWebSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Determine WebSocket URL based on current protocol
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      setStatus('connecting');

      socket.onopen = (event) => {
        setStatus('open');
        reconnectCountRef.current = 0;
        if (onOpen) onOpen(event, socket);
      };

      socket.onmessage = (event) => {
        setLastMessage(event);
        if (onMessage) onMessage(event);
      };

      socket.onclose = (event) => {
        setStatus('closed');
        if (onClose) onClose(event);
        
        // Attempt to reconnect if not closed intentionally
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current += 1;
          reconnectTimeoutRef.current = window.setTimeout(() => {
            createWebSocket();
          }, reconnectInterval);
        }
      };

      socket.onerror = (event) => {
        setStatus('error');
        if (onError) onError(event);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setStatus('error');
    }
  }, [onOpen, onMessage, onClose, onError, reconnectAttempts, reconnectInterval]);

  const connect = useCallback(() => {
    createWebSocket();
  }, [createWebSocket]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      reconnectCountRef.current = reconnectAttempts; // Prevent reconnection
      socketRef.current.close();
      socketRef.current = null;
      setStatus('closed');
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
  }, [reconnectAttempts]);

  const sendMessage = useCallback((data: string | object) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      socketRef.current.send(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, []);

  // Connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    status,
    sendMessage,
    connect,
    disconnect,
    lastMessage,
  };
}
