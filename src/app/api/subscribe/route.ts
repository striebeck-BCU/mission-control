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
  whatsBcu: {
    subject: "Here's what we're building for you",
    body: `You signed up. Here's what that means:

BCU is aggregating blue collar workers — pipefitters, welders, ironworkers, millwrights, electricians, crane operators, truck drivers, laborers, landscapers, painters, etc.. — into one community with real bargaining power.

Think of it like a co-op for the rest of us. The big companies get group rates on health insurance, equipment deals, and supplier discounts. Unions get collective bargaining. We've never had either. Remember there are more of US than there are of those who make these decisions that affect us all. It's past time we stand together for the betterment of Blue Collar workers. Skilled workers are in demand everywhere, let's use that to our advantage.

BCU changes that — We want to build a community of workers serious about their craft and their future. We want to quit letting big corporations reap all the benefits off the middles class And bring standards up for things like per diem rates and access to benefits.

What we're building:
- Group health plans options in different states
- Equipment & tool discounts — Clothes, tools, Hotels, fuel, boots, etc.. are being negotiated
- Per diem advocacy — tracking rate changes, pushing for better. Because we believe $100/day per diem isn't enough in today's market

Founding member slots are filling. Share with someone who needs this. It's time for the middle class to STAND UP!! We are the majority..`,
  },
  foundingPush: {
    subject: "Founding slots — don't wait",
    body: `Quick update: BCU is gaining momentum. Vendor partnerships are close. The app is in development.

And founding member slots? We're tracking toward 1,000.

If you've been on the fence — now's the time. Founding members lock in $100/month forever. That's less than $3.50 a day. You'll be locking in a rate most workers will never get access to.

Standard membership will be $20/month at launch. Founding members pay once, keep that rate for life. Every founding member who brings someone on board gets 10% of their membership dues.

Every member who joins early makes the community stronger. Every coworker you bring in does the same.`,
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
    const { data: contactData, error: contactError } = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribeGroupId: process.env.RESEND_UNSUBSCRIBE_GROUP_ID,
      ...(firstName ? { firstName } : {}),
    });

    if (contactError) {
      console.error("Resend contact error:", contactError);
      // Don't fail hard if contact already exists — that's fine
    }

    // 2. Send welcome email immediately
    const fromName = process.env.RESEND_FROM_NAME || "BCU Team";
    await resend.emails.send({
      from: `${fromName} <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: EMAILS.welcome.subject,
      text: EMAILS.welcome.body,
    });

    // 3. Queue 3-day and 7-day emails via cron jobs
    // Store scheduled sends in a simple JSON file (DB alternative for early stage)
    const queuePath = "C:\\Users\\strie\\.openclaw\\workspace\\email-queue.json";
    let queue: Array<{
      email: string;
      template: "whatsBcu" | "foundingPush";
      sendAt: number; // unix timestamp
      sent: boolean;
    }> = [];

    try {
      const fs = require("fs");
      if (fs.existsSync(queuePath)) {
        queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
      }
    } catch {}

    const now = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    queue.push(
      {
        email,
        template: "whatsBcu",
        sendAt: now + threeDaysMs,
        sent: false,
      },
      {
        email,
        template: "foundingPush",
        sendAt: now + sevenDaysMs,
        sent: false,
      }
    );

    const fs = require("fs");
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));

    return NextResponse.json({
      success: true,
      message: "You're on the list. Welcome email sent.",
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Server error. Try again." },
      { status: 500 }
    );
  }
}