"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      // 🔥 Sync user to Supabase
      fetch("/api/user/sync", {
        method: "POST",
      });

      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  return (
    <div className="relative z-50 min-h-screen flex items-center justify-center">

      <div className="relative z-50 bg-[#030014cc] backdrop-blur-xl border border-[#7042f861] rounded-2xl p-10 max-w-md w-full shadow-2xl">

        <div className="text-center mb-6">
          <h1 className="text-2xl text-white font-bold">
            Welcome to Buildor-GEO
          </h1>
          <p className="text-gray-400 text-sm">
            AI-Powered Geospatial Learning Platform
          </p>
        </div>

        {/* 🔥 GitHub Login */}
        <button
          onClick={() => {
            setLoading(true);
            signIn("github", { callbackUrl });
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#2f363d] text-white py-3 px-4 rounded-lg transition mb-3"
        >
          {loading ? "Signing in..." : "Continue with GitHub"}
        </button>

        {/* 🔥 Google Login */}
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-lg transition"
        >
          Continue with Google
        </button>

        <p className="text-gray-500 text-xs text-center mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}