import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  // Demo accounts quick login
  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              V
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Vault Pulse Center</CardTitle>
          <CardDescription className="text-center">
            Sign in to access technical operations dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@vaultclub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 border-t pt-6">
            <p className="text-sm text-muted-foreground mb-3">Demo Accounts:</p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => quickLogin('admin@vaultclub.com', 'Admin123!')}
                disabled={isLoading}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Admin</span>
                  <span className="text-xs text-muted-foreground">admin@vaultclub.com</span>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => quickLogin('manager.jakarta@vaultclub.com', 'Manager123!')}
                disabled={isLoading}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Manager (Jakarta)</span>
                  <span className="text-xs text-muted-foreground">manager.jakarta@vaultclub.com</span>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => quickLogin('operator@vaultclub.com', 'Operator123!')}
                disabled={isLoading}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">Operator</span>
                  <span className="text-xs text-muted-foreground">operator@vaultclub.com</span>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
