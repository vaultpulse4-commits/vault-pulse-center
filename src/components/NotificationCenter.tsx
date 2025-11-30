import { Bell, Check, CheckCheck, X, AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useWebSocket();
  const navigate = useNavigate();

  const getIcon = (type: string, category: string) => {
    if (type === 'CRITICAL') return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (type === 'WARNING') return <AlertTriangle className="h-4 w-4 text-warning" />;
    if (type === 'SUCCESS') return <CheckCircle className="h-4 w-4 text-success" />;
    return <Info className="h-4 w-4 text-primary" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CRITICAL': return 'bg-destructive/10 border-destructive/20';
      case 'WARNING': return 'bg-warning/10 border-warning/20';
      case 'SUCCESS': return 'bg-success/10 border-success/20';
      default: return 'bg-primary/10 border-primary/20';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-2 p-3 cursor-pointer border-l-2 ${
                  getTypeColor(notification.type)
                } ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2 w-full">
                  <div className="mt-0.5">
                    {getIcon(notification.type, notification.category)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Badge variant="default" className="h-5 px-1 text-[10px]">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
