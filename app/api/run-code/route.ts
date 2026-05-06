import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, taskId } = await req.json();

    const res = await fetch("http://localhost:8000/analyze", {
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

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Run failed" },
      { status: 500 }
    );
  }
}