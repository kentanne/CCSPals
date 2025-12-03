import Pusher from 'pusher-js';
import api from '@/lib/axios';

interface PusherCallbacks {
  onNewSchedule?: (newSchedule: any) => void;
  onScheduleRescheduled?: (updated: any) => void;
  onScheduleCancelled?: (cancelled: any) => void;
  onNewFeedback?: (fb: any) => void;
}

export const pusherService = {
  initializePusher(userId: string, callbacks: PusherCallbacks): (() => void) | null {
    if (!userId) return null;

    Pusher.logToConsole = true;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authorizer: (channel, options) => ({
        authorize: (socketId, callback) => {
          const body = `socket_id=${encodeURIComponent(socketId)}&channel_name=${encodeURIComponent(channel.name)}`;
          // Use your backend URL directly for Pusher auth
          api.post(`${backendUrl}/pusher/auth`, body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
            .then((res) => callback(null, res.data))
            .catch((err) => callback(err, null));
        },
      }),
    });

    const channelName = `private-user-${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('[Pusher] subscribed:', channelName);
    });

    channel.bind('pusher:subscription_error', (status: any) => {
      console.error('[Pusher] subscription error:', status);
    });

    // Bind event callbacks
    if (callbacks.onNewSchedule) {
      channel.bind('new-schedule', callbacks.onNewSchedule);
    }
    
    if (callbacks.onScheduleRescheduled) {
      channel.bind('schedule-rescheduled', callbacks.onScheduleRescheduled);
    }
    
    if (callbacks.onScheduleCancelled) {
      channel.bind('schedule-cancelled', callbacks.onScheduleCancelled);
    }
    
    if (callbacks.onNewFeedback) {
      channel.bind('new-feedback', callbacks.onNewFeedback);
    }

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }
};