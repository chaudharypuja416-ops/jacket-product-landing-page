# Leather Jacket Cash On Delivery Funnel

Production-ready Next.js App Router funnel for Cash On Delivery product orders.

## Recommended Tech Stack

- Next.js App Router for landing, checkout, thank-you, and `/api/order`
- Tailwind CSS for responsive premium styling
- Zod for server-side order validation
- Google Sheets API for order storage
- Nodemailer with Gmail SMTP for owner and customer emails
- Vercel for deployment

## Order Flow

1. Customer chooses quantity on the landing page.
2. CTA sends `productName`, `quantity`, `pricePerPiece`, and `totalPrice` to `/checkout`.
3. Checkout auto-fills product and price fields.
4. Customer submits name, phone, email, and exact location.
5. `/api/order` validates the request, creates an Order ID, date/time, payment method, and status.
6. The API appends the order to Google Sheets.
7. The API sends the owner notification email.
8. The API sends the customer order received email.
9. The customer is redirected to `/thank-you`.

The thank-you redirect only happens after the API returns success.

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

```bash
NEXT_PUBLIC_SITE_URL=
BUSINESS_EMAIL=chaudharypuja416@gmail.com
EMAIL_FROM=chaudharypuja416@gmail.com
BRAND_NAME=Leather Jacket

GOOGLE_SHEET_ID=
GOOGLE_SHEET_TAB_NAME=sheet 1
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

EMAIL_SERVICE_API_KEY=
FRONTEND_URL=
```

For Gmail SMTP, `SMTP_USER` is usually the Gmail address and `SMTP_PASS` should be a Google App Password, not the normal Gmail password.

For `GOOGLE_PRIVATE_KEY`, keep newline characters as `\n` in Vercel or `.env.local`. The app converts them before authenticating.

## Google Spreadsheet Setup

1. Create a Google Spreadsheet.
2. Rename the tab to `sheet 1`, or update `GOOGLE_SHEET_TAB_NAME`.
3. Add these columns in row 1:

```text
Order ID
Date & Time
Customer Name
Phone Number
Email Address
Exact Location
Product Name
Quantity
Price Per Piece
Total Price
Payment Method
Order Status
Notes
```

4. Select row 1 and enable filters with `Data > Create a filter`.
5. Add dropdown options for `Order Status` with:

```text
New Order
Order Confirmed
Order Ongoing
Delivered
Cancelled
```

6. Get the Sheet ID from the spreadsheet URL. It is the long value between `/d/` and `/edit`.
7. Create a Google Cloud service account, enable Google Sheets API, and generate a JSON key.
8. Put the service account email into `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
9. Put the private key into `GOOGLE_PRIVATE_KEY`.
10. Share the Google Sheet with the service account email and give Editor access.

The API also writes the header row automatically to `A1:M1`, but setting it up manually first is recommended.

## Email Setup

The app sends two HTML emails after the sheet append succeeds:

- Owner email to `BUSINESS_EMAIL`
- Customer confirmation email to the checkout email

Required SMTP variables:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail-address
SMTP_PASS=your-google-app-password
EMAIL_FROM=Leather Jacket <your-gmail-address>
BUSINESS_EMAIL=chaudharypuja416@gmail.com
BRAND_NAME=Leather Jacket
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Testing Order Submission

1. Add all `.env.local` values.
2. Run `npm run dev`.
3. Place a test order from the landing page.
4. Confirm the order appears in Google Sheets.
5. Confirm the owner Gmail receives the order notification.
6. Confirm the customer email receives the order received message.
7. Confirm the browser redirects to `/thank-you`.

If credentials are missing or invalid, the checkout page shows the API error and does not redirect.

## Vercel Deployment

1. Push the project to GitHub or import the local project into Vercel.
2. Add every variable from `.env.example` in Vercel Project Settings.
3. Make sure `GOOGLE_PRIVATE_KEY` keeps `\n` newline escapes.
4. Deploy.
5. Test a real order on the Vercel URL.

## Editing Product Content

Main product content lives in:

```text
lib/product.ts
```

Product images live in:

```text
public/products
```
