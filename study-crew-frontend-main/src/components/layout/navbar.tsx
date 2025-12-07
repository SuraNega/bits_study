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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const { openModal } = useAuthModal();
  const { roles, activeRole, setActiveRole, hasRole, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleSwitch = async (newRole: "user" | "assistant") => {
    await setActiveRole(newRole);
    if (newRole === "assistant") {
      navigate("/dashboard/assistant");
    } else {
      navigate("/dashboard/user");
    }
    setMobileMenuOpen(false);
  };

  const handleNavigate = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Always Visible */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <img
              src="/bits-logo.png"
              alt="BITS Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              StudyCrew
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile/Tablet */}
          <NavigationMenu className="hidden lg:flex">
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
              {/* Dashboard link based on active role */}
              {user && (
                <NavigationMenuItem>
                  <Link
                    to={
                      activeRole === "assistant"
                        ? "/dashboard/assistant"
                        : "/dashboard/user"
                    }
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <>
                {/* Role Switcher - Always Visible for Multi-Role Users */}
                {roles.length > 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 border-green-600 text-green-700 hover:bg-green-50 font-semibold"
                      >
                        <span className="hidden sm:inline">
                          {activeRole === "assistant" ? "Assistant" : "Student"}
                        </span>
                        <span className="sm:hidden">
                          {activeRole === "assistant" ? "A" : "S"}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleRoleSwitch("user")}
                        className={activeRole === "user" ? "bg-green-50" : ""}
                      >
                        <span className="flex items-center gap-2 w-full">
                          {activeRole === "user" && (
                            <span className="text-green-600">✓</span>
                          )}
                          Student Mode
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleSwitch("assistant")}
                        className={
                          activeRole === "assistant" ? "bg-green-50" : ""
                        }
                      >
                        <span className="flex items-center gap-2 w-full">
                          {activeRole === "assistant" && (
                            <span className="text-green-600">✓</span>
                          )}
                          Assistant Mode
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Profile Modal - Always Visible */}
                <ProfileModal />

                {/* Logout - Always Visible */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="border-red-500 text-red-600 hover:bg-red-50 hidden sm:flex"
                >
                  Logout
                </Button>
                
                {/* Mobile Logout Icon */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="border-red-500 text-red-600 hover:bg-red-50 sm:hidden p-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-600 hover:bg-green-50 hidden sm:flex"
                  onClick={() => openModal("login")}
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => openModal("register")}
                >
                  Sign up
                </Button>
              </>
            )}

            {/* Hamburger Menu - Mobile & Tablet Only */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Sidebar Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto border-l border-gray-200">
            <div className="p-6 space-y-4">
              {/* User Info */}
              {user && (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.name || user.email}
                      </p>
                      {activeRole === "assistant" && user.activity_status && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              user.activity_status === "available"
                                ? "bg-green-500"
                                : user.activity_status === "busy"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {user.activity_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.href)}
                    className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors"
                  >
                    {item.name}
                  </button>
                ))}

                {user && (
                  <button
                    onClick={() =>
                      handleNavigate(
                        activeRole === "assistant"
                          ? "/dashboard/assistant"
                          : "/dashboard/user"
                      )
                    }
                    className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors"
                  >
                    Dashboard
                  </button>
                )}
              </nav>

              {/* Login Button for Guest Users */}
              {!user && (
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 mb-2"
                    onClick={() => {
                      openModal("login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign in
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
