import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // 1. Add to Resend audience — minimal fields only
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
      } catch (contactErr) {
        console.error("Contact create failed:", contactErr);
        // Continue anyway — signup should still succeed
      }
    }

    // 2. Send welcome email — don't fail signup if this errors
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      try {
        const fromName = process.env.RESEND_FROM_NAME || "BCU Team";
        await resend.emails.send({
          from: `${fromName} <${process.env.RESEND_FROM_EMAIL}>`,
          to: email,
          subject: "You're in. Now let's get to work.",
          text: `Welcome to Blue Collar Up.

You're now part of something real — a movement built by workers, for workers. No union dues. No politics. Just collective power and deals that actually move the needle.

Here's what happens next:

- We're building the member app and vendor partnerships as fast as we can
- Founding member pricing is locked for the first 1,000 members — $100/month, locked in forever
- Standard membership will be $20/month when we launch

We'll send you updates as we get closer to launch. No spam. No sales pitches. Just straight progress reports on what BCU is building for you.

In the meantime — share with a coworker. Every member who joins before launch strengthens the whole community.

Stand up. We've got your back.

— The BCU Team`,
        });
      } catch (emailErr) {
        console.error("Welcome email failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true, message: "You're on the list." });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Server error. Try again." }, { status: 500 });
  }
}