import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/lib/websocket';
import {
  VehicleData,
  MessageType,
  WebSocketMessage,
  DataUpdatePayload,
} from '@/lib/vehicleTypes';

interface UseVehicleDataReturn {
  vehicleData: VehicleData | null;
  dataHistory: VehicleData[];
  clearHistory: () => void;
  isReceivingData: boolean;
}

const MAX_HISTORY_LENGTH = 100;

export function useVehicleData(): UseVehicleDataReturn {
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [dataHistory, setDataHistory] = useState<VehicleData[]>([]);
  const [isReceivingData, setIsReceivingData] = useState<boolean>(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
      
      if (message.type === MessageType.DATA_UPDATE) {
        const data = (message.payload as DataUpdatePayload).vehicleData;
        setVehicleData(data);
        setDataHistory(prevHistory => {
          const newHistory = [...prevHistory, data];
          // Keep history limited to the last MAX_HISTORY_LENGTH items
          return newHistory.slice(-MAX_HISTORY_LENGTH);
        });
        setIsReceivingData(true);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, []);

  const { status } = useWebSocket({
    onMessage: handleMessage,
    autoConnect: true,
  });

  // Reset data receiving status when WebSocket is disconnected
  useEffect(() => {
    if (status !== 'open') {
      setIsReceivingData(false);
    }
  }, [status]);

  const clearHistory = useCallback(() => {
    setDataHistory([]);
  }, []);

  // Store data history in localStorage whenever it changes
  useEffect(() => {
    try {
      if (dataHistory.length > 0) {
        localStorage.setItem('vehicleDataHistory', JSON.stringify(dataHistory));
      }
    } catch (error) {
      console.error('Failed to save data history to localStorage:', error);
    }
  }, [dataHistory]);

  // Load data history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('vehicleDataHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory) as VehicleData[];
        setDataHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Failed to load data history from localStorage:', error);
    }
  }, []);

  return {
    vehicleData,
    dataHistory,
    clearHistory,
    isReceivingData,
  };
}
