import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user;

  const email = user.email;
  const name = user.name;
  const avatar = user.image;
  const provider = session.provider;
  const githubId = session.user.githubId || null;

  // 🔍 STEP 1: Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    return NextResponse.json({ error: fetchError }, { status: 500 });
  }

  // 🟢 STEP 2: IF USER EXISTS → UPDATE
  if (existingUser) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name,
        avatar_url: avatar,
        provider,
        ...(provider === "github" && githubId
          ? { github_id: githubId }
          : {}),
      })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json({ error: updateError }, { status: 500 });
    }

    return NextResponse.json({ message: "User updated" });
  }

  // 🔵 STEP 3: IF USER DOES NOT EXIST → INSERT
  const { error: insertError } = await supabase.from("users").insert({
    email,
    name,
    avatar_url: avatar,
    provider,
    github_id: provider === "github" ? githubId : null,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError }, { status: 500 });
  }

  return NextResponse.json({ message: "User created" });
}