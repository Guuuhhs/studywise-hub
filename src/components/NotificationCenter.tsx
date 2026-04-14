import { useState, useEffect } from "react";
import { Bell, X, Check, AlertCircle, Calendar, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Notificações</h3>
            <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors relative group ${!n.is_read ? 'bg-primary/5' : ''}`}
              >
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    n.type === 'alert' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                  }`}>
                    {n.type === 'alert' ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{n.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</div>
                    <div className="text-[9px] text-muted-foreground mt-2 uppercase font-black">{new Date(n.created_at).toLocaleDateString()}</div>
                  </div>
                  {!n.is_read && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md bg-success/10 text-success flex items-center justify-center"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center">
                <Info className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-xs text-muted-foreground">Nenhuma novidade por aqui.</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-muted/20 border-t border-border text-center">
            <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Ver todas</button>
          </div>
        </div>
      )}
    </div>
  );
}
