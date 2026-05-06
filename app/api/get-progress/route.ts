import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json([]);
  }

  const { data } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_email", session.user.email);

  return NextResponse.json(data || []);
}