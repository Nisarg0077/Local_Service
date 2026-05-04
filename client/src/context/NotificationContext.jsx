import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(() =>
    mockNotifications.filter(n => !user || n.userId === user?.id)
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: `n${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notif,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount,
      markAsRead, markAllRead, addNotification, removeNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
