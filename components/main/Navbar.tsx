"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-10">
      <div className="w-full h-full flex items-center justify-between m-auto px-[10px]">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/NavLogo.png"
            alt="logo"
            width={70}
            height={70}
            className="cursor-pointer hover:animate-slowspin"
          />
          <span className="font-bold ml-[10px] hidden md:block text-gray-300">
            AI-Powered Geospatial Learning Platform
          </span>
        </Link>

        {/* Center Navigation (only when logged in) */}
        {session && (
          <div className="w-[500px] flex items-center justify-between md:mr-20">
            <div className="flex items-center justify-between w-full border border-[#7042f861] bg-[#0300145e] px-[20px] py-[10px] rounded-full text-gray-200">
              <a href="#about-me" className="cursor-pointer">
                About me
              </a>
              <a href="#skills" className="cursor-pointer">
                Skills
              </a>
              <Link href="/dashboard" className="cursor-pointer">
                Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Right Side */}
        <div className="flex gap-4 items-center">

          {status === "loading" ? (
            <div className="text-gray-400">Loading...</div>
          ) : session ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={session.user?.image || "/default-avatar.png"}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border border-[#7042f861]"
                />
                <span className="text-gray-200 hidden md:block">
                  {session.user?.name}
                </span>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-full border border-[#7042f861] text-gray-200 hover:bg-[#7042f861]/30 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              {/* Sign In */}
              <Link
                href="/auth/signin?callbackUrl=/dashboard"
                className="px-4 py-2 rounded-full border border-[#7042f861] text-gray-200 hover:bg-[#7042f861]/30 transition"
              >
                Sign in
              </Link>

              {/* Sign Up (same flow for now) */}
              <Link
                href="/auth/signin?callbackUrl=/dashboard"
                className="px-4 py-2 rounded-full bg-[#7042f861] text-white hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;