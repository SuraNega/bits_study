import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useAuthModal } from '@/components/context/AuthModalContext';
import { useAuth } from '@/components/context/AuthContext';
import ProfileModal from '@/components/auth/ProfileModal';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

export function Navbar() {
  const { openModal } = useAuthModal();
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex h-16 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">StudyCrew</span>
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link to={item.href}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              {role === 'assistant' && (
                <NavigationMenuItem>
                  <Link to="/dashboard/assistant">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Assistant Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              {role === 'user' && (
                <NavigationMenuItem>
                  <Link to="/dashboard/user">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      User Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">Hi, {user.name || user.email}</span>
                <ProfileModal />
                <Button
                  variant="outline"
                  onClick={() => { logout(); navigate('/'); }}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => openModal('login')}>
                  Sign in
                </Button>
                <Button onClick={() => openModal('register')}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
