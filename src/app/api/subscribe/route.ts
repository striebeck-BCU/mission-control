import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    console.log("Signup received for:", email);

    return NextResponse.json({ success: true, message: "You're on the list." });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Server error. Try again." }, { status: 500 });
  }
}