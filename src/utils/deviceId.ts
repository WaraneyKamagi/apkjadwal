import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { useState, useEffect } from 'react';

const DEVICE_ID_KEY = '@haya_device_id';

export const getOrCreateDeviceId = async (): Promise<string> => {
  try {
    const existingId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existingId) {
      return existingId;
    }
    
    // Generate new UUID for this device
    const newId = Crypto.randomUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch (error) {
    console.error("Error managing device ID:", error);
    // Fallback ID if storage fails
    return "fallback-device-id";
  }
};

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initDeviceId = async () => {
      const id = await getOrCreateDeviceId();
      if (isMounted) {
        setDeviceId(id);
      }
    };
    
    initDeviceId();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return deviceId;
};
