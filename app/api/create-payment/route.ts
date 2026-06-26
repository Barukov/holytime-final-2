import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PADDLE_PRICE_IDS: Record<string, string> = {
  starter: "pri_01kw2z9fx18tjm4r24zmksycpd",
  advanced: "pri_01kw2ze9bbv34dt58bzdye7nrq",
  premium: "pri_01kw2zfkhr3hyr83f2r7fqyn5b",

  product159: "pri_01kw2z5j90bmmk73ty98ak4pcy",
  product161: "pri_01kw2z6w4wampqn03515w2acqn",
  product199: "pri_01kw2z8dney4mcq6ha8vn6d9cb",
  product245: "pri_01kw2zckxm0k3vqvzmp8yx143x",
  product255: "pri_01kw2zphnxf35s8b2t65zbt5y2",
};

export async function POST(req: Request) {
  try {
    const { email, productId } = await req.json();

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));

    if (!validEmail || !productId) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const priceId = PADDLE_PRICE_IDS[String(productId)];

    if (!priceId) {
      return NextResponse.json(
        { error: "Product not configured" },
        { status: 400 }
      );
    }

    const apiKey = process.env.PADDLE_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

    if (!apiKey || !siteUrl) {
      return NextResponse.json({ error: "Missing env" }, { status: 500 });
    }

    const sourceDomain = req.headers.get("host") || siteUrl;

    const res = await fetch("https://api.paddle.com/transactions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
        customer: {
          email,
        },
        custom_data: {
          productId,
          email,
          sourceDomain,
        },
        checkout: {
          url: `${siteUrl}/checkout`,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Paddle error:", data);
      return NextResponse.json(
        { error: "Paddle failed", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: data.data.checkout.url,
    });
  } catch (error) {
    console.error("Paddle checkout error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
