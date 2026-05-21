import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAILS = {
  welcome: {
    subject: "You're in. Now let's get to work.",
    body: `Welcome to Blue Collar Up.

You're now part of something real — a movement built by workers, for workers. No union dues. No politics. Just collective power and deals that actually move the needle.

Here's what happens next:

- We're building the member app and vendor partnerships as fast as we can
- Founding member pricing is locked for the first 1,000 members — $100/month, locked in forever
- Standard membership will be $20/month when we launch

We'll send you updates as we get closer to launch. No spam. No sales pitches. Just straight progress reports on what BCU is building for you.

In the meantime — share with a coworker. Every member who joins before launch strengthens the whole community.

Stand up. We've got your back.

— The BCU Team`,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    // 1. Add to Resend audience
    const { error: contactError } = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribeGroupId: process.env.RESEND_UNSUBSCRIBE_GROUP_ID,
      ...(firstName ? { firstName } : {}),
    });

    // Silently handle already-subscribed — it's fine
    if (contactError) {
      console.error("Resend contact error:", contactError);
    }

    // 2. Send welcome email immediately — don't fail signup if email fails
    try {
      const fromName = process.env.RESEND_FROM_NAME || "BCU Team";
      await resend.emails.send({
        from: `${fromName} <${process.env.RESEND_FROM_EMAIL}>`,
        to: email,
        subject: EMAILS.welcome.subject,
        text: EMAILS.welcome.body,
      });
    } catch (emailErr) {
      console.error("Welcome email failed:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list.",
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Server error. Try again." },
      { status: 500 }
    );
  }
}