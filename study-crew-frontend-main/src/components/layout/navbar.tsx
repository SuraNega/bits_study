import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuthModal } from "@/components/context/AuthModalContext";
import { useAuth } from "@/components/context/AuthContext";
import ProfileModal from "@/components/auth/ProfileModal";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const { openModal } = useAuthModal();
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex h-16 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-3">
            <img 
              src="/bits-logo.png" 
              alt="BITS Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              StudyCrew
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link to={item.href}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              {role === "assistant" && (
                <NavigationMenuItem>
                  <Link to="/dashboard/assistant">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Assistant Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              {role === "user" && (
                <NavigationMenuItem>
                  <Link to="/dashboard/user">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
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
                <span className="text-gray-700 font-medium flex items-center gap-2">
                  Hi, {user.name || user.email}
                  {role === "assistant" && user.activity_status && (
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        user.activity_status === "available"
                          ? "bg-green-500"
                          : user.activity_status === "busy"
                          ? "bg-yellow-500"
                          : user.activity_status === "not available"
                          ? "bg-red-500"
                          : ""
                      }`}
                    ></span>
                  )}
                </span>
                <ProfileModal />
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => openModal("login")}
                >
                  Sign in
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => openModal("register")}
                >
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
