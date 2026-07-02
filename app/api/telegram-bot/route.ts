export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIME_ZONE = "Europe/Kyiv";
const DESK1_CHAT_ID = process.env.TELEGRAM_DESK1_CHAT_ID || "-1003983054033";
const DESK2_CHAT_ID = process.env.TELEGRAM_DESK2_CHAT_ID || "-1003808961913";
const DESK3_CHAT_ID = process.env.TELEGRAM_DESK3_CHAT_ID || "-1004235978427";
const SUCCESS_STATUSES = new Set(["completed", "billed", "paid"]);
const DEFAULT_BALANCE_BASE_CUTOFF_ISO = "2026-06-28T16:44:06Z";

type StatsAccount = {
  apiKey: string;
  title: string;
  balanceBaseAmount: number;
  balanceBaseCurrency: string;
  balanceBaseCutoffIso: string;
  successfulPaymentsBaseCount: number;
  refundsAllTimeAmount: number;
  refundsAllTimeCurrency: string;
};

function tg(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAccountForChat(chatId: unknown): StatsAccount {
  const id = String(chatId || "");

  if (id === DESK1_CHAT_ID) {
    return {
      apiKey: process.env.PADDLE_DESK1_API_KEY || process.env.PADDLE_API_KEY || "",
      title: "Holytime Auction",
      balanceBaseAmount: Number(process.env.PADDLE_DESK1_BALANCE_BASE_AMOUNT || 6825.02),
      balanceBaseCurrency: process.env.PADDLE_DESK1_BALANCE_BASE_CURRENCY || "USD",
      balanceBaseCutoffIso: process.env.PADDLE_DESK1_BALANCE_BASE_CUTOFF_ISO || DEFAULT_BALANCE_BASE_CUTOFF_ISO,
      successfulPaymentsBaseCount: Number(process.env.PADDLE_DESK1_SUCCESSFUL_PAYMENTS_BASE_COUNT || 29),
      refundsAllTimeAmount: Number(process.env.PADDLE_DESK1_REFUNDS_ALL_TIME_AMOUNT || 0),
      refundsAllTimeCurrency: process.env.PADDLE_DESK1_REFUNDS_ALL_TIME_CURRENCY || "USD",
    };
  }

  if (id === DESK2_CHAT_ID) {
    return {
      apiKey: process.env.PADDLE_DESK2_API_KEY || "",
      title: "Holytime Final",
      balanceBaseAmount: Number(process.env.PADDLE_DESK2_BALANCE_BASE_AMOUNT || 61279.56),
      balanceBaseCurrency: process.env.PADDLE_DESK2_BALANCE_BASE_CURRENCY || "USD",
      balanceBaseCutoffIso: process.env.PADDLE_DESK2_BALANCE_BASE_CUTOFF_ISO || DEFAULT_BALANCE_BASE_CUTOFF_ISO,
      successfulPaymentsBaseCount: Number(process.env.PADDLE_DESK2_SUCCESSFUL_PAYMENTS_BASE_COUNT || 330),
      refundsAllTimeAmount: Number(process.env.PADDLE_DESK2_REFUNDS_ALL_TIME_AMOUNT || 6159.22),
      refundsAllTimeCurrency: process.env.PADDLE_DESK2_REFUNDS_ALL_TIME_CURRENCY || "USD",
    };
  }

  if (id === DESK3_CHAT_ID) {
    return {
      apiKey: process.env.PADDLE_DESK3_API_KEY || "",
      title: "JolliesTime",
      balanceBaseAmount: Number(process.env.PADDLE_DESK3_BALANCE_BASE_AMOUNT || 0),
      balanceBaseCurrency: process.env.PADDLE_DESK3_BALANCE_BASE_CURRENCY || "USD",
      balanceBaseCutoffIso: process.env.PADDLE_DESK3_BALANCE_BASE_CUTOFF_ISO || DEFAULT_BALANCE_BASE_CUTOFF_ISO,
      successfulPaymentsBaseCount: Number(process.env.PADDLE_DESK3_SUCCESSFUL_PAYMENTS_BASE_COUNT || 0),
      refundsAllTimeAmount: Number(process.env.PADDLE_DESK3_REFUNDS_ALL_TIME_AMOUNT || 0),
      refundsAllTimeCurrency: process.env.PADDLE_DESK3_REFUNDS_ALL_TIME_CURRENCY || "USD",
    };
  }

  return {
    apiKey: "",
    title: `Unknown chat ${id}`,
    balanceBaseAmount: 0,
    balanceBaseCurrency: "USD",
    balanceBaseCutoffIso: DEFAULT_BALANCE_BASE_CUTOFF_ISO,
    successfulPaymentsBaseCount: 0,
    refundsAllTimeAmount: 0,
    refundsAllTimeCurrency: "USD",
  };
}

function kyivDateKey(value: string | null | undefined) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function formatMoney(amount: unknown, currency: unknown) {
  const value = Number(amount || 0) / 100;
  return `${value.toFixed(2)} ${String(currency || "EUR")}`;
}

function formatDecimalMoney(amount: unknown, currency: unknown) {
  return `${Number(amount || 0).toFixed(2)} ${String(currency || "USD")}`;
}

function parsePaddleDate(value: unknown) {
  const normalized = String(value || "")
    .replace(" ", "T")
    .replace(" Z", "Z");

  return new Date(normalized);
}

function minorToMajor(amount: unknown) {
  return Number(amount || 0) / 100;
}

function transactionNetAmount(transaction: any) {
  const payoutTotals = transaction.details?.payout_totals || transaction.details?.adjusted_payout_totals;
  const totals = transaction.details?.totals;

  if (payoutTotals?.earnings !== undefined && payoutTotals?.earnings !== null) {
    return {
      amount: Number(payoutTotals.earnings),
      currency: payoutTotals.currency_code || transaction.currency_code || totals?.currency_code || "EUR",
    };
  }

  if (totals?.fee !== undefined && totals?.fee !== null) {
    return {
      amount: Number(totals.grand_total || totals.total || 0) - Number(totals.fee || 0),
      currency: totals.currency_code || transaction.currency_code || "EUR",
    };
  }

  return {
    amount: Number(totals?.grand_total || totals?.total || 0),
    currency: totals?.currency_code || transaction.currency_code || "EUR",
  };
}

async function fetchAddress(transaction: any, apiKey: string) {
  const customerId = transaction.customer_id;
  const addressId = transaction.address_id;

  if (!apiKey || !customerId || !addressId) {
    return { country: "unknown", postalCode: "" };
  }

  try {
    const res = await fetch(`https://api.paddle.com/customers/${customerId}/addresses/${addressId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return { country: "unknown", postalCode: "" };
    }

    const json = await res.json();

    return {
      country: json.data?.country_code || "unknown",
      postalCode: json.data?.postal_code || json.data?.zip_code || "",
    };
  } catch {
    return { country: "unknown", postalCode: "" };
  }
}

async function fetchTodayTransactions(apiKey: string) {
  if (!apiKey) return [];

  const today = kyivDateKey(new Date().toISOString());
  let url = "https://api.paddle.com/transactions?per_page=100&order_by=created_at[DESC]";
  const transactions: any[] = [];

  for (let page = 0; page < 5 && url; page += 1) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!res.ok) break;

    const json = await res.json();
    const pageTransactions = Array.isArray(json.data) ? json.data : [];

    for (const transaction of pageTransactions) {
      const dateForReport = transaction.billed_at || transaction.created_at;
      const status = String(transaction.status || "").toLowerCase();

      if (kyivDateKey(dateForReport) === today && SUCCESS_STATUSES.has(status)) {
        transactions.push(transaction);
      }
    }

    const oldest = pageTransactions[pageTransactions.length - 1];
    if (oldest && kyivDateKey(oldest.created_at) !== today) break;

    url = json.meta?.pagination?.has_more ? json.meta.pagination.next : "";
  }

  return transactions;
}

async function paddleGet(apiKey: string, path: string) {
  const res = await fetch(`https://api.paddle.com${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Paddle API error ${res.status}`);
  }

  return res.json();
}

async function fetchNewSuccessfulTransactions(apiKey: string, cutoff: Date) {
  if (!apiKey) return [];

  let url = "/transactions?per_page=100&order_by=created_at[DESC]";
  const transactions: any[] = [];

  for (let page = 0; page < 20 && url; page += 1) {
    const json = await paddleGet(apiKey, url);
    const pageTransactions = Array.isArray(json.data) ? json.data : [];

    for (const transaction of pageTransactions) {
      const dateForBalance = parsePaddleDate(transaction.billed_at || transaction.updated_at || transaction.created_at);
      const status = String(transaction.status || "").toLowerCase();

      if (dateForBalance > cutoff && SUCCESS_STATUSES.has(status)) {
        transactions.push(transaction);
      }
    }

    const oldest = pageTransactions[pageTransactions.length - 1];
    if (oldest && parsePaddleDate(oldest.created_at) <= cutoff) break;

    url = json.meta?.pagination?.has_more ? json.meta.pagination.next : "";
  }

  return transactions;
}

function adjustmentSign(adjustment: any) {
  const action = String(adjustment.action || adjustment.type || "").toLowerCase();

  if (action.includes("reverse")) return 1;
  if (action.includes("refund") || action.includes("chargeback") || action.includes("credit")) return -1;

  return -1;
}

function adjustmentNetAmount(adjustment: any) {
  const payoutTotals = adjustment.payout_totals || adjustment.adjusted_payout_totals;
  const totals = adjustment.totals || adjustment.adjusted_totals;
  const amount =
    payoutTotals?.earnings ??
    payoutTotals?.total ??
    totals?.earnings ??
    totals?.grand_total ??
    totals?.total ??
    0;

  return {
    amount: adjustmentSign(adjustment) * Math.abs(Number(amount || 0)),
    currency: payoutTotals?.currency_code || totals?.currency_code || adjustment.currency_code || "USD",
  };
}

async function fetchNewBalanceAdjustments(apiKey: string, cutoff: Date) {
  if (!apiKey) return [];

  let url = "/adjustments?per_page=50";
  const adjustments: any[] = [];

  for (let page = 0; page < 20 && url; page += 1) {
    const json = await paddleGet(apiKey, url);
    const pageAdjustments = Array.isArray(json.data) ? json.data : [];

    for (const adjustment of pageAdjustments) {
      const dateForBalance = parsePaddleDate(adjustment.updated_at || adjustment.created_at);
      const status = String(adjustment.status || "").toLowerCase();

      if (dateForBalance > cutoff && (!status || status === "approved" || status === "reversed")) {
        adjustments.push(adjustment);
      }
    }

    const oldest = pageAdjustments[pageAdjustments.length - 1];
    if (oldest && parsePaddleDate(oldest.created_at) <= cutoff) break;

    url = json.meta?.pagination?.has_more ? json.meta.pagination.next : "";
  }

  return adjustments;
}

async function buildTodayReport(account: StatsAccount) {
  const transactions = await fetchTodayTransactions(account.apiKey);
  const totals = new Map<string, number>();
  const lines: string[] = [];

  for (const transaction of transactions) {
    const { amount, currency } = transactionNetAmount(transaction);
    totals.set(currency, (totals.get(currency) || 0) + amount);
    const email = transaction.customer?.email || transaction.customer_email || transaction.custom_data?.email || "unknown";

    lines.push(`- ${tg(email)}`);
  }

  const totalText =
    [...totals.entries()]
      .map(([currency, amount]) => formatMoney(amount, currency))
      .join(", ") || "0.00 EUR";

  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    dateStyle: "short",
  }).format(new Date());

  const body = lines.length ? lines.join("\n") : "No successful payments today.";
  const report = `<b>${tg(account.title)} - Today (${tg(date)})</b>

Total after Paddle fee: <b>${tg(totalText)}</b>

${body}`;

  return report.length > 3900 ? `${report.slice(0, 3800)}\n\n...truncated` : report;
}

async function buildBalanceReport(account: StatsAccount) {
  const fallbackReport = (note = "") => {
    const refundsText = account.refundsAllTimeAmount
      ? `\nRefunds all time: <b>${tg(formatDecimalMoney(account.refundsAllTimeAmount, account.refundsAllTimeCurrency))}</b>`
      : "";
    const noteText = note ? `\n${tg(note)}` : "";

    return `<b>${tg(account.title)} - Balance</b>

Currently in Paddle balance: <b>${tg(formatDecimalMoney(account.balanceBaseAmount, account.balanceBaseCurrency))}</b>
New successful payments: <b>${tg(account.successfulPaymentsBaseCount)}</b>${refundsText}${noteText}`;
  };

  if (!account.apiKey) {
    return fallbackReport();
  }

  try {
    const totals = new Map<string, number>();
    const cutoff = new Date(account.balanceBaseCutoffIso);
    const transactions = await fetchNewSuccessfulTransactions(account.apiKey, cutoff);
    const adjustments = await fetchNewBalanceAdjustments(account.apiKey, cutoff);

    totals.set(account.balanceBaseCurrency, account.balanceBaseAmount);

    for (const transaction of transactions) {
      const { amount, currency } = transactionNetAmount(transaction);
      totals.set(currency, (totals.get(currency) || 0) + minorToMajor(amount));
    }

    for (const adjustment of adjustments) {
      const { amount, currency } = adjustmentNetAmount(adjustment);
      totals.set(currency, (totals.get(currency) || 0) + minorToMajor(amount));
    }

    const totalText =
      [...totals.entries()]
        .map(([currency, amount]) => formatDecimalMoney(amount, currency))
        .join(", ") || "0.00 USD";
    const successfulAllTime = account.successfulPaymentsBaseCount + transactions.length;
    const refundsText = account.refundsAllTimeAmount
      ? `\nRefunds all time: <b>${tg(formatDecimalMoney(account.refundsAllTimeAmount, account.refundsAllTimeCurrency))}</b>`
      : "";

    return `<b>${tg(account.title)} - Balance</b>

Currently in Paddle balance: <b>${tg(totalText)}</b>
New successful payments: <b>${tg(successfulAllTime)}</b>${refundsText}`;
  } catch (error) {
    return fallbackReport("Live Paddle check is unavailable, showing saved balance.");
  }
}

async function sendTelegram(chatId: string | number, text: string) {
  const botToken = process.env.TELEGRAM_DESK1_BOT_TOKEN;

  if (!botToken) return;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

function buildJolliesTestMessages() {
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date());
  const icon = {
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

  return [
    `<b>TEST / EXAMPLE - PADDLE PAYMENT SUCCESSFUL</b>

${icon.website} <b>Website:</b> jolliestime.space

${icon.email} <b>Email:</b> customer@example.com
${icon.product} <b>Product:</b> Advanced Practice Vault
${icon.amount} <b>Amount:</b> 250.00 EUR
${icon.payment} <b>Payment:</b> card
${icon.country} <b>Country:</b> DE ZIP: 54292
${icon.id} <b>ID:</b> txn_test_jollies_success
${icon.date} <b>Date:</b> ${tg(date)}`,
    `<b>TEST / EXAMPLE - PADDLE PAYMENT FAILED</b>

${icon.website} <b>Website:</b> jolliestime.space

${icon.email} <b>Email:</b> customer@example.com
${icon.product} <b>Product:</b> Advanced Practice Vault
${icon.amount} <b>Amount:</b> 250.00 EUR
${icon.payment} <b>Payment:</b> card
${icon.country} <b>Country:</b> DE ZIP: 54292
${icon.error} <b>Error:</b> authentication_failed
${icon.reason} <b>Reason:</b> 3DS authentication failed. Customer completed the bank verification challenge, but it was not successful.
${icon.id} <b>ID:</b> txn_test_jollies_failed
${icon.date} <b>Date:</b> ${tg(date)}`,
  ];
}

export async function POST(req: Request) {
  const update = await req.json().catch(() => null);
  const message = update?.message || update?.edited_message;
  const chatId = message?.chat?.id;
  const text = String(message?.text || "").trim().split(/\s+/)[0].split("@")[0].toLowerCase();

  if (!chatId) {
    return new Response("OK", { status: 200 });
  }

  const account = getAccountForChat(chatId);

  if (text === "/id") {
    await sendTelegram(
      chatId,
      `<b>Chat ID</b>

${tg(chatId)}
${message?.chat?.title ? `\n${tg(message.chat.title)}` : ""}`
    );
    return new Response("OK", { status: 200 });
  }

  if (text === "/testjollies") {
    for (const testMessage of buildJolliesTestMessages()) {
      await sendTelegram(chatId, testMessage);
    }
    return new Response("OK", { status: 200 });
  }

  if (text === "/today") {
    await sendTelegram(chatId, await buildTodayReport(account));
    return new Response("OK", { status: 200 });
  }

  if (text === "/balance") {
    await sendTelegram(chatId, await buildBalanceReport(account));
    return new Response("OK", { status: 200 });
  }

  if (text === "/help" || text === "/start") {
    await sendTelegram(chatId, "Commands: /today, /balance, /id, /testjollies");
  }

  return new Response("OK", { status: 200 });
}
