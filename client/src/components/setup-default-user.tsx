import { useEffect } from 'react';
import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

// This component runs once on app startup to make sure the default user exists
export function SetupDefaultUser() {
  const [isSetup, setIsSetup] = useState(false);
  
  useEffect(() => {
    const setupDefaultUser = async () => {
      try {
        // Check if the default user already exists to avoid creating duplicates
        const response = await fetch('/api/users/1');
        
        if (response.status === 404) {
          // Create the default user if it doesn't exist
          await apiRequest(
            'POST', 
            '/api/users', 
            {
              username: 'defaultuser',
              password: 'password123' // This is just a default user, not for actual auth
            }
          );
          console.log('Created default user');
        } else {
          console.log('Default user already exists');
        }
        
        setIsSetup(true);
      } catch (error) {
        console.error('Error setting up default user:', error);
        // Don't block the app if this fails
        setIsSetup(true);
      }
    };
    
    setupDefaultUser();
  }, []);
  
  // This is a setup-only component, it doesn't render anything
  return null;
}

export default SetupDefaultUser;