'use client';

import { useCallback, useEffect, useState } from 'react';

interface ClientInfo {
  name: string;
  email: string;
  savedAt: string;
}

const CLIENT_INFO_COOKIE = 'postiz-client-info';

export const useClientInfo = () => {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Read client info from cookies
  const loadClientInfo = useCallback(() => {
    try {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${CLIENT_INFO_COOKIE}=`))
        ?.split('=')[1];
      
      if (cookieValue) {
        const decodedValue = decodeURIComponent(cookieValue);
        const parsedInfo = JSON.parse(decodedValue);
        setClientInfo(parsedInfo);
      }
    } catch (error) {
      console.error('Error loading client info from cookies:', error);
      setClientInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save client info to cookies
  const saveClientInfo = useCallback((info: { name: string; email: string }) => {
    try {
      const clientInfoToSave: ClientInfo = {
        name: info.name,
        email: info.email,
        savedAt: new Date().toISOString(),
      };

      // Set cookie for 365 days
      const expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + 365);
      
      const cookieValue = encodeURIComponent(JSON.stringify(clientInfoToSave));
      document.cookie = `${CLIENT_INFO_COOKIE}=${cookieValue}; expires=${expiresDate.toUTCString()}; path=/; samesite=strict`;
      
      setClientInfo(clientInfoToSave);
    } catch (error) {
      console.error('Error saving client info to cookies:', error);
    }
  }, []);

  // Clear client info from cookies
  const clearClientInfo = useCallback(() => {
    document.cookie = `${CLIENT_INFO_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setClientInfo(null);
  }, []);

  // Load client info on mount
  useEffect(() => {
    loadClientInfo();
  }, [loadClientInfo]);

  return {
    clientInfo,
    isLoading,
    saveClientInfo,
    clearClientInfo,
    hasClientInfo: !!clientInfo,
  };
};