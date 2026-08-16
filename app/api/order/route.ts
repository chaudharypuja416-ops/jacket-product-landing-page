import { NextResponse } from "next/server";
import { appendOrderToSheet } from "@/lib/google-sheets";
import { sendOrderEmails } from "@/lib/email";
import { createOrderId, orderInputSchema, type CompleteOrder } from "@/lib/order-schema";

export async function POST(request: Request) {
  try {
    const allowedOrigin = process.env.FRONTEND_URL;
    const requestOrigin = request.headers.get("origin");

    if (allowedOrigin && requestOrigin && requestOrigin !== allowedOrigin) {
      return NextResponse.json(
        {
          success: false,
          message: "Order requests are not allowed from this origin.",
        },
        { status: 403 },
      );
    }

    const payload = await request.json();
    const parsed = orderInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the form and try again.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const expectedTotal = parsed.data.quantity * parsed.data.pricePerPiece;
    if (parsed.data.totalPrice !== expectedTotal) {
      return NextResponse.json(
        {
          success: false,
          message: "Total price does not match the selected quantity.",
        },
        { status: 400 },
      );
    }

    const order: CompleteOrder = {
      ...parsed.data,
      orderId: createOrderId(),
      dateTime: new Intl.DateTimeFormat("en-NP", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kathmandu",
      }).format(new Date()),
      paymentMethod: "Cash On Delivery",
      orderStatus: "New Order",
      notes: `Size: ${parsed.data.selectedSize}; Color: ${parsed.data.selectedColor}`,
    };

    await appendOrderToSheet(order);
    await sendOrderEmails(order);

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      order,
    });
  } catch (error) {
    console.error("Order submission failed", error);
    const message =
      error instanceof Error
        ? error.message
        : "Order submission failed. Please try again.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
