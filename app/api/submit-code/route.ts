import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, taskId, subtaskId } = await req.json();

    // 🔹 call python backend
    const res = await fetch("http://localhost:8000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        task_id: taskId,
      }),
    });

    const result = await res.json();

    // ❌ syntax error only
    if (result.status === "error") {
      return NextResponse.json({
        error: result.hint,
        details: result.errors,
      });
    }

    // 🔥 INSERT submission
    const { error: subError } = await supabase.from("submissions").insert({
      user_email: session.user.email,
      task_id: taskId,
      subtask_id: subtaskId,
      score: result.score,
      status: result.status,
      created_at: new Date().toISOString(),
    });

    if (subError) console.error("SUBMISSION ERROR:", subError);

    // 🔥 UPDATE PROGRESS
    const { error: progError } = await supabase.from("user_progress").upsert({
      user_email: session.user.email,
      task_id: taskId,
      subtask_id: subtaskId,
      completed: result.status === "completed",
      updated_at: new Date().toISOString(),
    });

    if (progError) console.error("PROGRESS ERROR:", progError);

    // 🔥 UPDATE USER STATS (FIXED ACCURACY)
    const { data: existing } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_email", session.user.email)
      .single();

    if (existing) {
      const newTotal = (existing.total_attempts || 0) + 1;
      const newCompleted =
        (existing.tasks_completed || 0) +
        (result.status === "completed" ? 1 : 0);

      await supabase
        .from("user_stats")
        .update({
          total_attempts: newTotal,
          tasks_completed: newCompleted,
          score: (existing.score || 0) + result.score,
          accuracy: (newCompleted / newTotal) * 100, // ✅ FIXED
        })
        .eq("user_email", session.user.email);
    } else {
      await supabase.from("user_stats").insert({
        user_email: session.user.email,
        total_attempts: 1,
        tasks_completed: result.status === "completed" ? 1 : 0,
        score: result.score,
        accuracy: result.status === "completed" ? 100 : 0,
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("SUBMIT API ERROR:", err);
    return NextResponse.json({ error: "Submit failed" }, { status: 500 });
  }
}