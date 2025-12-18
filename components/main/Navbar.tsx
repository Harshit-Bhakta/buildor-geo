"use client";

import Image from "next/image";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <a
          href="/"
          className="h-auto w-auto flex flex-row items-center"
        >
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
        </a>

        {session && (
          <div className="w-[500px] h-full flex flex-row items-center justify-between md:mr-20">
            <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
              <a href="#about-me" className="cursor-pointer">
                About me
              </a>
              <a href="#skills" className="cursor-pointer">
                Skills
              </a>
              <a href="/dashboard" className="cursor-pointer">
                Dashboard
              </a>
            </div>
          </div>
        )}

        <div className="flex flex-row gap-4 items-center">
          {status === "loading" ? (
            <div className="text-gray-400">Loading...</div>
          ) : session ? (
            <>
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
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-full border border-[#7042f861] text-gray-200 hover:bg-[#7042f861]/30"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <a
                href="/auth/signin?callbackUrl=/"
                className="px-4 py-2 rounded-full border border-[#7042f861] text-gray-200 hover:bg-[#7042f861]/30"
              >
                Sign in
              </a>
              <a
                href="/auth/signin"
                className="px-4 py-2 rounded-full bg-[#7042f861] text-white hover:opacity-90"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;