import { useEffect } from 'react';

function NotificationHelper() {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return;
      }
      
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        try {
          const permission = await Notification.requestPermission();
          console.log(`Notification permission ${permission}`);
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      }
    };
    
    requestNotificationPermission();
  }, []);
  
  return null; 
}

export default NotificationHelper;
