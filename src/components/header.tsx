"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-2 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Navigate">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/">Home</HoveredLink>
            <HoveredLink href="/admin">Login</HoveredLink>
            <HoveredLink href="/panel">Admin Panel</HoveredLink>
            <HoveredLink href="/about">About us</HoveredLink>
          </div>
        </MenuItem>
        <Link href={'/'}><Image 
          src='/logo.jpeg'
          height={40}
          width={40}
          alt="logo"
        /></Link>
        <MenuItem setActive={setActive} active={active} item="Features">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Fast"
              href="/"
              src="/feature(1).png"
              description="Seamless Connectivity like never before"
            />
            <ProductItem
              title="Secure"
              href="/"
              src="/feature(2).png"
              description="We Dont use your data for commercial purpose"
            />
            <ProductItem
              title="Transparent"
              href="/"
              src="/feature(3).png"
              description="Full Transparency between citizens and Government"
            />
            <ProductItem
              title="Reliable"
              href="/"
              src="/feature(4).png"
              description="Sit back and Relax , you are in contoll"
            />
          </div>
        </MenuItem>
        
      </Menu>
    </div>
  );
}
