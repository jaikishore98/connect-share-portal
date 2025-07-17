import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Users, MessageCircle } from 'lucide-react';
import Jai_Kishore  from '@/assets/Jai_Kishore.jpg';

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string; avatar: string }) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    // TODO: Implement Microsoft SSO
    // For now, simulate login with mock data
    setTimeout(() => {
      onLogin({
        name: 'Jaikishore',
        email: 'jai.kishore@prodian.co.in',
        avatar: Jai_Kishore
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-corporate rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Prodian Portal</h1>
          <p className="text-muted-foreground">Connect, share, and collaborate with your team</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-card rounded-lg shadow-card">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Connect</p>
          </div>
          <div className="text-center p-4 bg-card rounded-lg shadow-card">
            <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Share</p>
          </div>
          <div className="text-center p-4 bg-card rounded-lg shadow-card">
            <Building2 className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Collaborate</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your company account to access the prodian portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Microsoft SSO Button */}
            <Button 
              onClick={handleMicrosoftLogin}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-corporate hover:bg-gradient-hero transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                  </svg>
                  Continue with Microsoft
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Demo Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.name@prodian.co.in"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  className="h-10"
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full h-10"
                onClick={handleMicrosoftLogin}
              >
                Demo Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2024 Company Name. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};