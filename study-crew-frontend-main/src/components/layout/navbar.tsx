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
          <Link to="/" className="group flex items-center space-x-2 sm:space-x-3 flex-shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]">
            <img
              src="/bits-logo.png"
              alt="BITS Logo"
              className="h-15 w-15 sm:h-14 sm:w-14 object-contain transition-transform duration-500 group-hover:rotate-6"
            />
            <span className="text-lg sm:text-xl font-bold text-[#8fc95d] transition-all duration-300 group-hover:tracking-wide">
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
                      className={`${navigationMenuTriggerStyle()} relative text-base font-medium transition-all duration-200 hover:-translate-y-0.5 hover:text-[#8fc95d] hover:bg-[#8fc95d]/10 after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-[2px] after:bg-[#8fc95d] after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100`}
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
                      className={`${navigationMenuTriggerStyle()} relative text-base font-medium transition-all duration-200 hover:-translate-y-0.5 hover:text-[#8fc95d] hover:bg-[#8fc95d]/10 after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-[2px] after:bg-[#8fc95d] after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100`}
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
                        className="gap-1 border-[#8fc95d] text-[#8fc95d] hover:bg-[#8fc95d]/10 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
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
                        className={`cursor-pointer transition-colors ${activeRole === "user" ? "bg-[#8fc95d]/10" : "hover:bg-[#8fc95d]/10"}`}
                      >
                        <span className="flex items-center gap-2 w-full">
                          {activeRole === "user" && (
                            <span className="text-[#8fc95d] animate-in zoom-in spin-in-90 duration-300">✓</span>
                          )}
                          Student Mode
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleSwitch("assistant")}
                        className={`cursor-pointer transition-colors ${activeRole === "assistant" ? "bg-[#8fc95d]/10" : "hover:bg-[#8fc95d]/10"}`}
                      >
                        <span className="flex items-center gap-2 w-full">
                          {activeRole === "assistant" && (
                            <span className="text-[#8fc95d] animate-in zoom-in spin-in-90 duration-300">✓</span>
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
                  className="border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000]/10 hidden sm:flex text-base font-semibold px-6 transition-all duration-200 hover:scale-105 active:scale-95"
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
                  className="border-[#8fc95d] text-[#8fc95d] hover:bg-[#8fc95d]/10 sm:hidden p-2"
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
                  className="border-[#8fc95d] text-[#8fc95d] hover:bg-[#8fc95d]/10 hidden sm:flex text-base font-semibold px-6 transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => openModal("login")}
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  className="bg-[#8fc95d] hover:bg-[#8fc95d] text-white text-base font-bold px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
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
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8fc95d] to-[#8fc95d] rounded-full flex items-center justify-center text-white font-bold">
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
                    className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-[#8fc95d]/10 hover:text-[#8fc95d] font-medium transition-all duration-200 hover:translate-x-0.5"
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
                    className="w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-[#8fc95d]/10 hover:text-[#8fc95d] font-medium transition-all duration-200 hover:translate-x-0.5"
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
                    className="w-full border-[#8fc95d] text-[#8fc95d] hover:bg-[#8fc95d]/10 mb-2"
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
