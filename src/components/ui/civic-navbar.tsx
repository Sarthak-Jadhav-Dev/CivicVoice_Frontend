"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useAuth } from "@/hooks/useAuth";

interface CivicNavbarProps {
  variant?: "home" | "admin" | "dashboard";
  onLogout?: () => void;
  user?: { name?: string; username?: string; email?: string } | null;
}

export const CivicNavbar: React.FC<CivicNavbarProps> = ({ 
  variant = "home", 
  onLogout,
  user: propUser 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user: authUser, isAuthenticated, logout } = useAuth();
  
  // Use auth user if available, otherwise use prop user
  const user = authUser || propUser;

  // Different nav items based on page variant
  const getNavItems = () => {
    switch (variant) {
      case "home":
        return [
          { name: "About CivicVoice", link: "/about" },
          { name: "How It Works", link: "/about" },
          { name: "Report Issue", link: "/join-us" },
          { name: "Contact Support", link: "/contact" },
        ];
      case "admin":
        return [
           { name: "About CivicVoice", link: "/about" },
          { name: "How It Works", link: "/about" },
          { name: "Report Issue", link: "/join-us" },
          { name: "Contact Support", link: "/contact" },
        ];
      case "dashboard":
        return [
          { name: "Dashboard", link: "/admin/dashboard" },
          { name: "Issues", link: "/admin/dashboard#issues" },
          { name: "Users", link: "/admin/dashboard#users" },
          { name: "Analytics", link: "/admin/dashboard#analytics" },
          { name: "Home", link: "/" },
        ];
      default:
        return [];
    }
  };

  const getNavButtons = () => {
    switch (variant) {
      case "home":
        return (
          <>
            <NavbarButton variant="secondary" onClick={() => window.location.href = "/join-us"}>
              Citizen Portal
            </NavbarButton>
            <NavbarButton variant="primary" onClick={() => window.location.href = "/admin"}>
              Admin Login
            </NavbarButton>
          </>
        );
      case "admin":
        return (
          <>
            <NavbarButton variant="secondary" onClick={() => window.location.href = "/join-us"}>
              Citizen Portal
            </NavbarButton>
            {isAuthenticated ? (
              <NavbarButton variant="primary" onClick={() => window.location.href = "/admin/dashboard"}>
                Dashboard ({user?.username || user?.email})
              </NavbarButton>
            ) : (
              <NavbarButton variant="primary">
                Admin Login
              </NavbarButton>
            )}
          </>
        );
      case "dashboard":
        return (
          <>
            <div className="hidden md:flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <span>Welcome, {user?.username || user?.email || "Admin"}</span>
            </div>
            <NavbarButton variant="secondary" onClick={() => window.location.href = "/"}>
              Home
            </NavbarButton>
            <NavbarButton variant="primary" onClick={onLogout || logout}>
              Logout
            </NavbarButton>
          </>
        );
      default:
        return null;
    }
  };

  const getMobileNavButtons = () => {
    switch (variant) {
      case "home":
        return (
          <>
            <NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.location.href = "/join-us";
              }}
              variant="secondary"
              className="w-full"
            >
              Citizen Portal
            </NavbarButton>
            <NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.location.href = "/admin";
              }}
              variant="primary"
              className="w-full"
            >
              Admin Login
            </NavbarButton>
          </>
        );
      case "admin":
        return (
          <>
            <NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.location.href = "/join-us";
              }}
              variant="secondary"
              className="w-full"
            >
              Citizen Portal
            </NavbarButton>
            {isAuthenticated ? (
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = "/admin/dashboard";
                }}
                variant="primary"
                className="w-full"
              >
                Dashboard ({user?.username || user?.email})
              </NavbarButton>
            ) : (
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = "/admin";
                }}
                variant="primary"
                className="w-full"
              >
                Admin Login
              </NavbarButton>
            )}
          </>
        );
      case "dashboard":
        return (
          <>
            <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
              Welcome, {user?.username || user?.email || "Admin"}
            </div>
            <NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.location.href = "/";
              }}
              variant="secondary"
              className="w-full"
            >
              Home
            </NavbarButton>
            <NavbarButton
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout?.();
              }}
              variant="primary"
              className="w-full"
            >
              Logout
            </NavbarButton>
          </>
        );
      default:
        return null;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {getNavButtons()}
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {getMobileNavButtons()}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};
