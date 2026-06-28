export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIME_ZONE = "Europe/Kyiv";
const DESK1_CHAT_ID = process.env.TELEGRAM_DESK1_CHAT_ID || "-1003983054033";
const SUCCESS_STATUSES = new Set(["completed", "billed", "paid"]);
const BALANCE_REPORT_START = "2020-01-01";
const FRESH_REPORT_MAX_AGE_MS = 2 * 60 * 1000;
const DEFAULT_BALANCE_BASE_CUTOFF_ISO = "2026-06-28T16:44:06Z";

type StatsAccount = {
  apiKey: string;
  title: string;
  balanceBaseAmount: number;
  balanceBaseCurrency: string;
  balanceBaseCutoffIso: string;
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
      apiKey: process.env.PADDLE_API_KEY || "",
      title: "Holytime Auction",
      balanceBaseAmount: Number(process.env.PADDLE_DESK1_BALANCE_BASE_AMOUNT || 4568.82),
      balanceBaseCurrency: process.env.PADDLE_DESK1_BALANCE_BASE_CURRENCY || "USD",
      balanceBaseCutoffIso: process.env.PADDLE_DESK1_BALANCE_BASE_CUTOFF_ISO || DEFAULT_BALANCE_BASE_CUTOFF_ISO,
    };
  }

  return {
    apiKey: process.env.PADDLE_DESK2_API_KEY || "",
    title: "Holytime Final",
    balanceBaseAmount: Number(process.env.PADDLE_DESK2_BALANCE_BASE_AMOUNT || 60845.43),
    balanceBaseCurrency: process.env.PADDLE_DESK2_BALANCE_BASE_CURRENCY || "USD",
    balanceBaseCutoffIso: process.env.PADDLE_DESK2_BALANCE_BASE_CUTOFF_ISO || DEFAULT_BALANCE_BASE_CUTOFF_ISO,
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parsePaddleDate(value: unknown) {
  const normalized = String(value || "")
    .replace(" ", "T")
    .replace(" Z", "Z");

  return new Date(normalized);
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

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === "\"" && quoted && next === "\"") {
      cell += "\"";
      i += 1;
      continue;
    }

    if (char === "\"") {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [header = [], ...data] = rows;

  return data
    .filter((values) => values.some(Boolean))
    .map((values) =>
      Object.fromEntries(header.map((name, index) => [name, values[index] || ""])),
    );
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

async function paddlePost(apiKey: string, path: string, body: unknown) {
  const res = await fetch(`https://api.paddle.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Paddle API error ${res.status}`);
  }

  return res.json();
}

async function getFreshBalanceReport(apiKey: string) {
  const reports = await paddleGet(apiKey, "/reports?per_page=20&order_by=created_at[DESC]");
  const now = Date.now();
  const fresh = (Array.isArray(reports.data) ? reports.data : []).find((report: any) => {
    const age = now - new Date(report.created_at || 0).getTime();
    return report.type === "balance" && age >= 0 && age <= FRESH_REPORT_MAX_AGE_MS && report.status !== "expired";
  });

  if (fresh) return fresh;

  const created = await paddlePost(apiKey, "/reports", {
    type: "balance",
    filters: [{ name: "updated_at", operator: "gte", value: BALANCE_REPORT_START }],
  });

  return created.data;
}

async function waitForReadyReport(apiKey: string, report: any) {
  let current = report;

  for (let attempt = 0; attempt < 14; attempt += 1) {
    if (current?.status === "ready") return current;
    if (current?.status === "failed" || current?.status === "expired") return current;

    await sleep(2500);
    const refreshed = await paddleGet(apiKey, `/reports/${current.id}`);
    current = refreshed.data;
  }

  return current;
}

async function downloadReportCsv(apiKey: string, reportId: string) {
  const link = await paddleGet(apiKey, `/reports/${reportId}/download-url`);
  const res = await fetch(link.data?.url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Report download error ${res.status}`);
  }

  return res.text();
}

async function buildBalanceReport(account: StatsAccount) {
  if (!account.apiKey) {
    return `<b>${tg(account.title)} - Balance</b>

Paddle API key is missing.`;
  }

  try {
    const report = await waitForReadyReport(account.apiKey, await getFreshBalanceReport(account.apiKey));

    if (report.status !== "ready") {
      return `<b>${tg(account.title)} - Balance</b>

Paddle is preparing the real balance report.
Repeat /balance in about 1 minute.`;
    }

    const rows = parseCsv(await downloadReportCsv(account.apiKey, report.id));
    const totals = new Map<string, number>();
    const cutoff = new Date(account.balanceBaseCutoffIso);
    let newRows = 0;

    totals.set(account.balanceBaseCurrency, account.balanceBaseAmount);

    for (const row of rows) {
      if (row.payout_id) continue;
      if (parsePaddleDate(row.updated_at) <= cutoff) continue;

      const currency = row.balance_currency_code || "USD";
      const amount = Number(row.balance_amount || 0);
      const direction = String(row.direction || "").toLowerCase();
      const signedAmount = direction === "out" ? -amount : amount;

      newRows += 1;
      totals.set(currency, (totals.get(currency) || 0) + signedAmount);
    }

    const totalText =
      [...totals.entries()]
        .map(([currency, amount]) => formatDecimalMoney(amount, currency))
        .join(", ") || "0.00 USD";

    return `<b>${tg(account.title)} - Balance</b>

Currently in Paddle balance: <b>${tg(totalText)}</b>
New balance movements: <b>${tg(newRows)}</b>`;
  } catch (error) {
    return `<b>${tg(account.title)} - Balance</b>

Could not read Paddle balance: ${tg(error instanceof Error ? error.message : "unknown error")}`;
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

export async function POST(req: Request) {
  const update = await req.json().catch(() => null);
  const message = update?.message || update?.edited_message;
  const chatId = message?.chat?.id;
  const text = String(message?.text || "").trim().split(/\s+/)[0].split("@")[0].toLowerCase();

  if (!chatId) {
    return new Response("OK", { status: 200 });
  }

  const account = getAccountForChat(chatId);

  if (text === "/today") {
    await sendTelegram(chatId, await buildTodayReport(account));
    return new Response("OK", { status: 200 });
  }

  if (text === "/balance") {
    await sendTelegram(chatId, await buildBalanceReport(account));
    return new Response("OK", { status: 200 });
  }

  if (text === "/help" || text === "/start") {
    await sendTelegram(chatId, "Commands: /today, /balance");
  }

  return new Response("OK", { status: 200 });
}
