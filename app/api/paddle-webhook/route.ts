import { Resend } from "resend";
import crypto from "crypto";
import { productMap } from "../../lib/products";
import { sendDesk1TelegramMessage, tg } from "../../lib/telegram";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY!);

const ICONS = {
  success: "\u{1F4B8}",
  failed: "\u{26A0}\u{FE0F}",
  website: "\u{1F310}",
  email: "\u{1F464}",
  product: "\u{1F4E6}",
  amount: "\u{1F4B0}",
  payment: "\u{1F4B3}",
  country: "\u{1F30D}",
  error: "\u{26A0}\u{FE0F}",
  reason: "\u{1F4DD}",
  id: "\u{1F9FE}",
  date: "\u{1F552}",
};

const PAYMENT_ERROR_MESSAGES: Record<string, string> = {
  authentication_failed: "3DS authentication failed. Customer completed the bank verification challenge, but it was not successful.",
  blocked_card: "The card is blocked, frozen, lost, damaged, or stolen. Customer should try another card.",
  canceled: "Payment was canceled by the customer, bank, or payment provider.",
  declined: "Payment was declined by the bank or payment provider. Customer should try another card.",
  expired_card: "The card is expired. Customer should use another card.",
  fraud: "Payment was blocked as potentially fraudulent.",
  invalid_payment_details: "Payment details are invalid. Customer should re-enter card details or use another card.",
  issuer_unavailable: "The bank was unavailable and could not confirm the payment.",
  not_enough_balance: "Insufficient funds or card limit reached.",
  psp_error: "Payment provider error. Customer can retry later or use another payment method.",
  system_error: "Paddle platform error. Customer can retry later.",
  transaction_not_permitted: "The bank does not allow this type of transaction.",
  unknown: "Unknown payment failure. Check Paddle transaction details for the exact bank/provider response.",
};

const processedEvents = new Set<string>();
const processedTransactions = new Set<string>();

function verifyPaddleSignature(rawBody: string, signature: string, secret: string) {
  try {
    const parts = Object.fromEntries(signature.split(";").map((part) => part.split("=")));
    const ts = parts.ts;
    const h1 = parts.h1;
    if (!ts || !h1) return false;
    const digest = crypto.createHmac("sha256", secret).update(ts + ":" + rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(h1, "hex"));
  } catch {
    return false;
  }
}

function normalizeDomain(value: unknown) {
  return String(value || "").replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
}

function shouldProcessSourceDomain(sourceDomain: unknown) {
  return normalizeDomain(sourceDomain) === "devshelf.company";
}

function latestPayment(payments: any[]) {
  if (!Array.isArray(payments) || payments.length === 0) return {};
  return [...payments].sort((a, b) => new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime())[0] || {};
}

function latestFailedPayment(payments: any[]) {
  const failed = Array.isArray(payments) ? payments.filter((payment) => {
    const status = String(payment?.status || "").toLowerCase();
    return status === "error" || status === "failed" || Boolean(payment?.error_code);
  }) : [];
  return latestPayment(failed.length ? failed : payments);
}

function paymentFingerprint(eventType: string, transactionId: unknown, payment: any) {
  if (eventType === "transaction.completed") return eventType + "_" + (transactionId || "unknown");
  return [eventType, transactionId || "unknown", payment?.payment_attempt_id || payment?.payment_method_id || payment?.created_at || payment?.error_code || "unknown"].join("_");
}

function getAmount(data: any) {
  const total = data.details?.totals?.grand_total;
  return total === undefined || total === null ? "?" : (Number(total) / 100).toFixed(2);
}

function getPaymentMethod(payment: any) {
  return payment.method_details?.type || payment.method_details?.card?.type || payment.payment_method_id || "unknown";
}

function getFailureReason(payment: any, data: any) {
  const code = payment.error_code || data.error_code || data.checkout?.error_code || "unknown";
  return { code, message: payment.error_message || data.error_message || PAYMENT_ERROR_MESSAGES[code] || PAYMENT_ERROR_MESSAGES.unknown };
}

async function fetchPaddleAddress(customerId: string, addressId: string) {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey || customerId === "unknown" || !addressId) return null;
  try {
    const res = await fetch("https://api.paddle.com/customers/" + customerId + "/addresses/" + addressId, { headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" } });
    if (!res.ok) return null;
    const json = await res.json();
    return { country: json.data?.country_code || null, postalCode: json.data?.postal_code || json.data?.zip_code || null };
  } catch {
    return null;
  }
}

async function resolveAddress(data: any) {
  const customerId = data.customer_id || data.customer?.id || "unknown";
  const addressId = data.address_id || data.customer?.address_id || "";
  const paddleAddress = await fetchPaddleAddress(customerId, addressId);
  return {
    country: data.customer?.address?.country_code || data.address?.country_code || data.billing_details?.address?.country_code || data.details?.tax_rates_used?.[0]?.tax_rate_country || paddleAddress?.country || "unknown",
    postalCode: data.customer?.address?.postal_code || data.customer?.address?.zip_code || data.address?.postal_code || data.address?.zip_code || data.billing_details?.address?.postal_code || data.billing_details?.address?.zip_code || paddleAddress?.postalCode || "",
  };
}

function formatCountry(country: unknown, postalCode: unknown) {
  const zip = String(postalCode || "").trim();
  return zip ? String(country || "unknown") + " ZIP: " + zip : String(country || "unknown");
}

function buildDownloadLink(productId: string, sourceDomain: unknown) {
  const product = productMap[productId];
  if (!product) return "";
  const domain = normalizeDomain(sourceDomain) || "devshelf.company";
  return "https://" + domain + product.downloadFile;
}

function buildPaymentMessage(title: string, details: Record<string, unknown>) {
  let message = "<b>" + title + "</b>\n\n";
  message += ICONS.website + " <b>Website:</b> " + tg(details.website) + "\n\n";
  message += ICONS.email + " <b>Email:</b> " + tg(details.email) + "\n";
  message += ICONS.product + " <b>Product:</b> " + tg(details.product) + "\n";
  message += ICONS.amount + " <b>Amount:</b> " + tg(details.amount) + " " + tg(details.currency) + "\n";
  message += ICONS.payment + " <b>Payment:</b> " + tg(details.paymentMethod) + "\n";
  message += ICONS.country + " <b>Country:</b> " + tg(formatCountry(details.country, details.postalCode)) + "\n";
  if (details.errorCode) {
    message += ICONS.error + " <b>Error:</b> " + tg(details.errorCode) + "\n";
    message += ICONS.reason + " <b>Reason:</b> " + tg(details.errorReason) + "\n";
  }
  message += ICONS.id + " <b>ID:</b> " + tg(details.transactionId) + "\n";
  message += ICONS.date + " <b>Date:</b> " + tg(details.date);
  return message;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

    if (!webhookSecret || !signature || !verifyPaddleSignature(rawBody, signature, webhookSecret)) {
      console.log("PADDLE WEBHOOK SIGNATURE SKIPPED OR INVALID");
      return new Response("OK", { status: 200 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;
    const data = event.data || {};
    const eventId = event.notification_id || event.event_id || eventType + "_" + data.id;

    if (processedEvents.has(eventId)) return new Response("OK", { status: 200 });
    processedEvents.add(eventId);

    const sourceDomain = data.custom_data?.sourceDomain || req.headers.get("host") || "devshelf.company";
    if (!shouldProcessSourceDomain(sourceDomain)) return new Response("OK", { status: 200 });

    const productId = data.custom_data?.productId || "advanced-study-vault";
    const product = productMap[productId];
    const payment = eventType === "transaction.payment_failed" ? latestFailedPayment(data.payments) : latestPayment(data.payments);
    const transactionEventId = paymentFingerprint(eventType, data.id, payment);

    if (data.id && (eventType === "transaction.payment_failed" || eventType === "transaction.completed") && processedTransactions.has(transactionEventId)) return new Response("OK", { status: 200 });
    if (data.id && (eventType === "transaction.payment_failed" || eventType === "transaction.completed")) processedTransactions.add(transactionEventId);

    const address = await resolveAddress(data);
    const failureReason = getFailureReason(payment, data);
    const details = {
      website: sourceDomain,
      email: data.customer?.email || data.customer_email || data.custom_data?.email || "unknown",
      product: product?.name || data.custom_data?.productName || data.items?.[0]?.product?.name || "DevShelf product",
      amount: getAmount(data),
      currency: data.currency_code || data.details?.totals?.currency_code || "EUR",
      paymentMethod: getPaymentMethod(payment),
      country: address.country,
      postalCode: address.postalCode,
      transactionId: data.id || "unknown",
      date: new Date().toLocaleString("en-GB"),
    };

    if (eventType === "transaction.payment_failed") {
      await sendDesk1TelegramMessage(buildPaymentMessage(ICONS.failed + " PADDLE PAYMENT FAILED", { ...details, errorCode: failureReason.code, errorReason: failureReason.message }));
      return new Response("OK", { status: 200 });
    }

    if (eventType !== "transaction.completed") return new Response("OK", { status: 200 });

    await sendDesk1TelegramMessage(buildPaymentMessage(ICONS.success + " PADDLE PAYMENT SUCCESSFUL", details));

    const downloadLink = buildDownloadLink(String(productId), sourceDomain);
    if (downloadLink && details.email !== "unknown") {
      const html = "<h2>Thank you for your purchase</h2><p>Your digital product is ready:</p><p><strong>" + details.product + "</strong></p><p><a href=\"" + downloadLink + "\" style=\"display:inline-block;padding:12px 20px;background:#101014;color:white;border-radius:8px;text-decoration:none;font-weight:bold;\">Download your product</a></p>";
      await resend.emails.send({
        from: "DevShelf Academy <support@devshelf.company>",
        to: String(details.email),
        subject: "Your DevShelf product: " + details.product,
        html,
      });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Paddle webhook error:", err);
    return new Response("OK", { status: 200 });
  }
}
