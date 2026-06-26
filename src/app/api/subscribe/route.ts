import { NextRequest, NextResponse } from "next/server";

const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE = process.env.RESEND_AUDIENCE_ID;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL;
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || "BCU Team";

async function resendPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text}`);
  }
  return res.json();
}

function logSubscribeError(label: string, err: unknown) {
  console.error(label, err instanceof Error ? err.message : err);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    if (!RESEND_KEY || !RESEND_AUDIENCE || !RESEND_FROM) {
      console.error("Subscribe email configuration missing", {
        hasResendKey: Boolean(RESEND_KEY),
        hasResendAudience: Boolean(RESEND_AUDIENCE),
        hasResendFrom: Boolean(RESEND_FROM),
      });

      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 500 },
      );
    }

    try {
      await resendPost("/contacts", { email, audienceId: RESEND_AUDIENCE });
    } catch (e) {
      logSubscribeError("Contact error:", e);
      return NextResponse.json(
        { error: "Could not add you to the list. Please try again later." },
        { status: 502 },
      );
    }

    try {
      await resendPost("/emails", {
          from: `${RESEND_FROM_NAME} <${RESEND_FROM}>`,
          to: email,
          subject: "You're in. Now let's get to work.",
          text: `Welcome to Blue Collar Up.

You're now part of something real â€” a movement built by workers, for workers. No union dues. No politics. Just collective power and deals that actually move the needle. The middle class BUILDS this nation and it's time WE get some representation.

*If you're tired of slow wages growth & sub-par per diem
* limited health and financial options
* being treated like you're expendable

Join us - band together and make a difference.

The politicians aren't going to save the working class. They're only going to tax us more. It's up to US to save ourselves!

Here's what happens next:

- We're building the member app and vendor partnerships as fast as we can.
- Founding member pricing is locked for the first 1,000 members â€” $100/month, locked in forever, with referral commissions on members you bring in.
- Standard membership will be $20/month when we launch

We'll send you updates as we get closer to launch. No spam. No sales pitches. Just straight progress reports on what BCU is building for you.

In the meantime â€” share with a coworker. Every member who joins before launch strengthens the whole community.

Stand up. We've got your back.

â€” The BCU Team`,
      });
    } catch (e) {
      logSubscribeError("Email error:", e);
      return NextResponse.json(
        { error: "You were added, but the welcome email could not be sent." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, message: "You're on the list." });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Server error. Try again." }, { status: 500 });
  }
}
