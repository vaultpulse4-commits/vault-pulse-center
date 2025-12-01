import { useState } from 'react';
import { Menu, X, Home, BarChart3, Users, Shield, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setOpen(false);
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: BarChart3, label: 'Financial Analytics', path: '/analytics/financial' },
    { icon: BarChart3, label: 'Equipment Analytics', path: '/analytics/equipment' },
    { icon: Users, label: 'Team Analytics', path: '/analytics/team' },
    ...(user?.role === 'admin' ? [
      { icon: Users, label: 'User Management', path: '/users' },
      { icon: Shield, label: 'Permissions', path: '/permissions' },
    ] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Toggle navigation menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <SheetContent side="left" className="w-64 sm:w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-primary">
              ⚡
            </div>
            Vault Club
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {/* User Info */}
          <div className="px-2 py-3 bg-muted rounded-lg">
            <p className="text-sm font-semibold text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-foreground hover:text-accent-foreground"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-destructive/10 transition-colors text-destructive hover:text-destructive"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
