import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAILS = {
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

const queuePath = "C:\\Users\\strie\\.openclaw\\workspace\\email-queue.json";

export async function GET() {
  try {
    const fs = require("fs");
    if (!fs.existsSync(queuePath)) {
      return NextResponse.json({ processed: 0, message: "No queue file" });
    }

    let queue: Array<{
      email: string;
      template: "whatsBcu" | "foundingPush";
      sendAt: number;
      sent: boolean;
    }> = JSON.parse(fs.readFileSync(queuePath, "utf8"));

    const now = Date.now();
    const due = queue.filter((q) => !q.sent && q.sendAt <= now);
    const fromName = process.env.RESEND_FROM_NAME || "BCU Team";
    let sentCount = 0;

    for (const item of due) {
      const emailContent = EMAILS[item.template];
      if (!emailContent) continue;

      try {
        await resend.emails.send({
          from: `${fromName} <${process.env.RESEND_FROM_EMAIL}>`,
          to: item.email,
          subject: emailContent.subject,
          text: emailContent.body,
        });
        item.sent = true;
        sentCount++;
      } catch (err) {
        console.error(`Failed to send ${item.template} to ${item.email}:`, err);
      }
    }

    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));

    return NextResponse.json({
      processed: sentCount,
      total: due.length,
      message: `Sent ${sentCount} email(s)`,
    });
  } catch (err) {
    console.error("Queue process error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}