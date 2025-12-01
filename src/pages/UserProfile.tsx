import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, MapPin, Calendar, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { getRoleDisplayName, getRoleBadgeVariant } from "@/lib/permissions";
import { Navigate, useNavigate } from "react-router-dom";
import { PushNotificationSettings } from "@/components/PushNotificationSettings";
import { formatDateTime, formatDate } from "@/lib/dateUtils";

export default function UserProfile() {
  const { user, refreshUser } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [nameForm, setNameForm] = useState({ name: user?.name || '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleUpdateName = async () => {
    try {
      setLoading(true);
      await api.auth.updateUser(user.id, { name: nameForm.name });
      await refreshUser();
      toast({
        title: "Success",
        description: "Name updated successfully"
      });
      setIsEditingName(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update name",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      });
      return;
    }

    if (!passwordForm.currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await api.auth.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      toast({
        title: "Success",
        description: "Password changed successfully"
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-1 sm:mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-primary flex-shrink-0">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    {isEditingName ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={nameForm.name}
                          onChange={(e) => setNameForm({ name: e.target.value })}
                          className="w-64"
                        />
                        <Button size="sm" onClick={handleUpdateName} disabled={loading}>
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setIsEditingName(false);
                            setNameForm({ name: user.name });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <p className="font-medium text-lg">{user.name}</p>
                    )}
                  </div>
                </div>
                {!isEditingName && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)}>
                    Edit
                  </Button>
                )}
              </div>

              <Separator />

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <Separator />

              {/* Role */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <div className="mt-1">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* City Access */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City Access</p>
                  <div className="flex gap-2 mt-1">
                    {user.cities.map(city => (
                      <Badge key={city} variant="outline">
                        {city.charAt(0).toUpperCase() + city.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Last Login */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">
                    {user.lastLogin 
                      ? formatDateTime(user.lastLogin)
                      : 'Just now'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isChangingPassword ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-destructive/10">
                      <Lock className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">••••••••</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                    Change Password
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Re-enter new password"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleChangePassword} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Update Password
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <PushNotificationSettings />

          {/* Account Information */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Details about your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Created</p>
                  <p className="font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account ID</p>
                  <p className="font-medium font-mono text-xs">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
