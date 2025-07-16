import { useState, useEffect } from 'react';
import { LoginPage } from '@/components/LoginPage';
import { MainDashboard } from '@/components/MainDashboard';

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('employeePortalUser');
    if (savedUser) {
      try {
        setUserData(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('employeePortalUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: UserData) => {
    setUserData(user);
    localStorage.setItem('employeePortalUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem('employeePortalUser');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {userData ? (
        <MainDashboard userData={userData} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
};

export default Index;
