import nodemailer from "nodemailer";
import type { CompleteOrder } from "@/lib/order-schema";

function money(amount: number) {
  return `NPR ${new Intl.NumberFormat("en-NP").format(amount)}`;
}

function env(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function row(label: string, value: string | number) {
  return `
    <tr>
      <td style="padding:10px 0;color:#6b5a50;font-size:14px;">${label}</td>
      <td style="padding:10px 0;color:#211713;font-size:14px;font-weight:700;text-align:right;">${value}</td>
    </tr>
  `;
}

function shell(content: string) {
  return `
    <div style="margin:0;padding:0;background:#f5eee7;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5eee7;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eaded4;">
              ${content}
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export function adminOrderEmail(order: CompleteOrder, brandName: string) {
  return shell(`
    <tr>
      <td style="background:#211713;padding:28px 30px;color:#fff;">
        <div style="font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#c47a3d;font-weight:700;">${brandName}</div>
        <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">New order received</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:26px 30px;">
        <div style="display:inline-block;background:#fff3e8;color:#8b4a24;border-radius:999px;padding:8px 12px;font-weight:700;font-size:13px;">${order.orderStatus}</div>
        <h2 style="margin:18px 0 6px;color:#211713;">Order ${order.orderId}</h2>
        <p style="margin:0;color:#6b5a50;">${order.dateTime}</p>
        <div style="margin:22px 0;padding:16px;background:#fff8ef;border-left:4px solid #c47a3d;color:#211713;font-weight:700;">
          Please call the customer soon to confirm this order.
        </div>
        <h3 style="margin:22px 0 8px;color:#211713;">Customer details</h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Customer Name", order.customerName)}
          ${row("Phone Number", order.phone)}
          ${row("Email Address", order.email)}
          ${row("Exact Location", order.location)}
        </table>
        <h3 style="margin:22px 0 8px;color:#211713;">Product details</h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Product Name", order.productName)}
          ${row("Quantity", order.quantity)}
          ${row("Size", order.selectedSize)}
          ${row("Color", order.selectedColor)}
          ${row("Price Per Piece", money(order.pricePerPiece))}
          ${row("Total Price", money(order.totalPrice))}
        </table>
        <h3 style="margin:22px 0 8px;color:#211713;">Payment details</h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Payment Method", order.paymentMethod)}
          ${row("Order Status", order.orderStatus)}
        </table>
      </td>
    </tr>
  `);
}

export function customerOrderEmail(order: CompleteOrder, brandName: string, replyTo: string) {
  return shell(`
    <tr>
      <td style="background:#211713;padding:28px 30px;color:#fff;">
        <div style="font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#c47a3d;font-weight:700;">${brandName}</div>
        <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">Thank you for your order!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:26px 30px;color:#211713;">
        <p style="font-size:16px;line-height:1.7;margin:0 0 14px;">Hi ${order.customerName},</p>
        <p style="font-size:16px;line-height:1.7;margin:0 0 18px;">We have received your order successfully. Our sales representative will call you soon to confirm your order.</p>
        <div style="border:1px solid #eaded4;border-radius:10px;padding:18px;background:#fffaf5;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Order ID", order.orderId)}
            ${row("Product", order.productName)}
            ${row("Quantity", order.quantity)}
            ${row("Size", order.selectedSize)}
            ${row("Color", order.selectedColor)}
            ${row("Total Price", money(order.totalPrice))}
            ${row("Payment Method", order.paymentMethod)}
          </table>
        </div>
        <p style="font-size:15px;line-height:1.7;margin:20px 0 0;color:#6b5a50;">For support, reply to this email or contact ${replyTo}.</p>
        <p style="font-size:16px;line-height:1.7;margin:20px 0 0;">Thank you,<br/><strong>${brandName}</strong></p>
      </td>
    </tr>
  `);
}

export async function sendOrderEmails(order: CompleteOrder) {
  const brandName = process.env.BRAND_NAME || "Leather Jacket";
  const businessEmail = env("BUSINESS_EMAIL");
  const from = env("EMAIL_FROM");
  const replyTo = process.env.EMAIL_FROM || businessEmail;

  const transporter = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port: Number(env("SMTP_PORT") || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: env("SMTP_USER"),
      pass: env("SMTP_PASS"),
    },
  });

  await transporter.sendMail({
    from,
    to: businessEmail,
    replyTo: order.email,
    subject: `New Product Order Received - ${order.orderId}`,
    html: adminOrderEmail(order, brandName),
  });

  await transporter.sendMail({
    from,
    to: order.email,
    replyTo,
    subject: `Your Order Has Been Received - ${brandName}`,
    html: customerOrderEmail(order, brandName, replyTo),
  });
}
