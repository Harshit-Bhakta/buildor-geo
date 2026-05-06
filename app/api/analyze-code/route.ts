import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const MAX_HINTS = 10;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, taskId } = await req.json();

    // 🔹 hint usage
    const { data } = await supabase
      .from("hints_usage")
      .select("*")
      .eq("user_email", session.user.email)
      .eq("task_id", taskId)
      .single();

    const count = data?.count || 0;

    if (count >= MAX_HINTS) {
      return NextResponse.json({
        blocked: true,
        remaining: 0,
      });
    }

    // 🔹 call python backend
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        task_id: taskId,
        hint_level: count + 1,
      }),
    });

    const result = await res.json();

    // 🔹 update count
    if (data) {
      await supabase
        .from("hints_usage")
        .update({ count: count + 1 })
        .eq("user_email", session.user.email)
        .eq("task_id", taskId);
    } else {
      await supabase.from("hints_usage").insert({
        user_email: session.user.email,
        task_id: taskId,
        count: 1,
      });
    }

    return NextResponse.json({
      hint: result.hint,
      errors: result.errors,
      remaining: MAX_HINTS - (count + 1),
      level: result.level,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analyze failed" }, { status: 500 });
  }
}