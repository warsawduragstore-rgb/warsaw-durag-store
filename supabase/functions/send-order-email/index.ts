// @ts-nocheck
// ========================================================================
// WARSAW DURAG STORE — SUPABASE EDGE FUNCTION
// Sends order notification emails via Resend
//
// Deploy: supabase functions deploy send-order-email
// Or paste this in Supabase Dashboard → Edge Functions → New Function
// ========================================================================

import { Resend } from "npm:resend@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const order = await req.json();

    // Get env variables
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "contact@warsawduragstore.pl";
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "sklep@warsawduragstore.pl";

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    const resend = new Resend(RESEND_API_KEY);

    // Format items for email
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #f0ede8;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #f0ede8; text-align: center;">${item.color || "-"}</td>
          <td style="padding: 10px; border-bottom: 1px solid #f0ede8; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #f0ede8; text-align: right;">${(item.price * item.quantity).toFixed(2)} PLN</td>
        </tr>
      `
      )
      .join("");

    // ── EMAIL 1: Notification to Store Owner ──
    const ownerEmailHtml = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nowe zamówienie — Warsaw Durag Store</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f6f3; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="background-color: #1a1a1a; padding: 30px 40px; text-align: center; margin-bottom: 0;">
      <h1 style="color: #f0ede8; font-size: 22px; font-weight: 300; letter-spacing: 0.15em; margin: 0; text-transform: uppercase;">Warsaw Durag Store</h1>
      <p style="color: #888; font-size: 11px; letter-spacing: 0.2em; margin: 8px 0 0 0; text-transform: uppercase;">Nowe Zamówienie</p>
    </div>

    <!-- Order Number Banner -->
    <div style="background-color: #d4a84b; padding: 16px 40px; text-align: center;">
      <p style="color: #1a1a1a; font-size: 14px; font-weight: 600; letter-spacing: 0.1em; margin: 0; text-transform: uppercase;">
        Zamówienie ${order.order_no}
      </p>
    </div>

    <!-- Content -->
    <div style="background-color: #ffffff; padding: 40px;">

      <!-- Customer Info -->
      <h2 style="font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #888; margin: 0 0 16px 0; border-bottom: 1px solid #f0ede8; padding-bottom: 10px;">Dane klienta</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="padding: 6px 0; color: #888; font-size: 13px; width: 140px;">Imię i Nazwisko</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-size: 13px; font-weight: 500;">${order.customer_name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #888; font-size: 13px;">E-mail</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-size: 13px; font-weight: 500;">${order.customer_email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #888; font-size: 13px;">Telefon</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-size: 13px; font-weight: 500;">${order.customer_phone}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #888; font-size: 13px;">Dostawa</td>
          <td style="padding: 6px 0; color: #1a1a1a; font-size: 13px; font-weight: 500;">
            ${order.delivery_method === "paczkomat" ? `Paczkomat InPost — ${order.locker_code} (${order.locker_address})` : "Kurier WDS"}
          </td>
        </tr>
      </table>

      <!-- Products -->
      <h2 style="font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #888; margin: 0 0 16px 0; border-bottom: 1px solid #f0ede8; padding-bottom: 10px;">Zamówione produkty</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px;">
        <thead>
          <tr style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">
            <th style="padding: 8px 10px 8px 0; text-align: left; font-weight: 500;">Produkt</th>
            <th style="padding: 8px 10px; text-align: center; font-weight: 500;">Kolor</th>
            <th style="padding: 8px 10px; text-align: center; font-weight: 500;">Ilość</th>
            <th style="padding: 8px 0 8px 10px; text-align: right; font-weight: 500;">Cena</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="background-color: #f8f6f3; padding: 20px; margin-bottom: 30px;">
        <table style="width: 100%; font-size: 13px;">
          ${order.discount_code ? `
          <tr>
            <td style="padding: 4px 0; color: #888;">Kod rabatowy (${order.discount_code})</td>
            <td style="padding: 4px 0; text-align: right; color: #2e7d32;">-${order.discount_val.toFixed(2)} PLN</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 4px 0; color: #888;">Wysyłka</td>
            <td style="padding: 4px 0; text-align: right; color: #1a1a1a;">Gratis</td>
          </tr>
          <tr>
            <td style="padding: 10px 0 0 0; color: #1a1a1a; font-weight: 600; font-size: 15px; border-top: 1px solid #e0ddd8;">Razem do zapłaty</td>
            <td style="padding: 10px 0 0 0; text-align: right; color: #1a1a1a; font-weight: 600; font-size: 15px; border-top: 1px solid #e0ddd8;">${order.total.toFixed(2)} PLN</td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align: center;">
        <a href="https://supabase.com/dashboard" style="display: inline-block; background-color: #1a1a1a; color: #f0ede8; text-decoration: none; padding: 14px 32px; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">
          Zarządzaj zamówieniem →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 24px 40px; text-align: center;">
      <p style="color: #aaa; font-size: 11px; letter-spacing: 0.05em; margin: 0;">
        © 2026 Warsaw Durag Store • Wiadomość automatyczna, nie odpowiadaj na ten e-mail
      </p>
    </div>
  </div>
</body>
</html>`;

    // ── EMAIL 2: Confirmation to Customer ──
    const customerEmailHtml = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potwierdzenie zamówienia — Warsaw Durag Store</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f6f3; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="background-color: #1a1a1a; padding: 30px 40px; text-align: center;">
      <h1 style="color: #f0ede8; font-size: 22px; font-weight: 300; letter-spacing: 0.15em; margin: 0; text-transform: uppercase;">Warsaw Durag Store</h1>
    </div>

    <!-- Content -->
    <div style="background-color: #ffffff; padding: 40px;">
      <!-- Success message -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 60px; height: 60px; border: 2px solid #1a1a1a; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 28px; color: #1a1a1a;">✓</span>
        </div>
        <h2 style="font-size: 20px; font-weight: 300; color: #1a1a1a; margin: 0 0 8px 0; letter-spacing: 0.05em;">Dziękujemy za zakup!</h2>
        <p style="color: #888; font-size: 13px; margin: 0;">Twoje zamówienie zostało przyjęte i jest w realizacji.</p>
      </div>

      <!-- Order number -->
      <div style="background-color: #f8f6f3; padding: 16px 24px; text-align: center; margin-bottom: 30px;">
        <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 4px 0;">Numer zamówienia</p>
        <p style="color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 0;">${order.order_no}</p>
      </div>

      <!-- Order summary -->
      <h3 style="font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #888; margin: 0 0 16px 0; border-bottom: 1px solid #f0ede8; padding-bottom: 10px;">Twoje zamówienie</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Total -->
      <div style="background-color: #f8f6f3; padding: 16px 20px; margin-bottom: 30px; display: flex; justify-content: space-between;">
        <span style="font-size: 14px; font-weight: 600; color: #1a1a1a;">Suma</span>
        <span style="font-size: 14px; font-weight: 600; color: #1a1a1a;">${order.total.toFixed(2)} PLN</span>
      </div>

      <!-- Delivery info -->
      <div style="border: 1px solid #f0ede8; padding: 20px; margin-bottom: 30px;">
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin: 0 0 10px 0; font-weight: 600;">Informacje o dostawie</p>
        <p style="color: #1a1a1a; font-size: 13px; margin: 0 0 4px 0;"><strong>${order.customer_name}</strong></p>
        <p style="color: #888; font-size: 13px; margin: 0 0 4px 0;">${order.customer_phone}</p>
        ${order.delivery_method === "paczkomat" 
          ? `<p style="color: #888; font-size: 13px; margin: 4px 0 0 0;">Paczkomat: <strong>${order.locker_code}</strong> — ${order.locker_address}</p>`
          : `<p style="color: #888; font-size: 13px; margin: 4px 0 0 0;">Dostawa Kurierem (1-2 dni robocze)</p>`
        }
      </div>

      <p style="color: #888; font-size: 12px; line-height: 1.7; text-align: center; margin: 0;">
        Masz pytania? Napisz na <a href="mailto:contact@warsawduragstore.pl" style="color: #1a1a1a;">contact@warsawduragstore.pl</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 24px 40px; text-align: center;">
      <p style="color: #aaa; font-size: 11px; letter-spacing: 0.05em; margin: 0;">
        © 2026 Warsaw Durag Store • ul. Mokotowska 42, Warszawa
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send both emails in parallel
    const [ownerResult, customerResult] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `🛍️ Nowe zamówienie ${order.order_no} — ${order.customer_name} (${order.total.toFixed(2)} PLN)`,
        html: ownerEmailHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: order.customer_email,
        subject: `Potwierdzenie zamówienia ${order.order_no} — Warsaw Durag Store`,
        html: customerEmailHtml,
      }),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        ownerEmailId: ownerResult.data?.id,
        customerEmailId: customerResult.data?.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
