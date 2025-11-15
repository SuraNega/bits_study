import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/context/AuthContext';
import { useAuthModal } from '@/components/context/AuthModalContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { openModal } = useAuthModal();

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Welcome to StudyCrew</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Card - Need Help */}
          <Card className="hover:shadow-lg transition-shadow border-blue-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <CardTitle className="text-xl">I need an assistant</CardTitle>
              <CardDescription>Find help with your studies</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full py-6 text-lg border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => openModal('login', 'user')}
              >
                Get Help Now
              </Button>
            </CardContent>
          </Card>

          {/* Second Card - Want to Help */}
          <Card className="hover:shadow-lg transition-shadow border-green-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <CardTitle className="text-xl">I'm here to assist</CardTitle>
              <CardDescription>Help others with their studies</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full py-6 text-lg border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => openModal('login', 'assistant')}
              >
                Start Helping
              </Button>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
