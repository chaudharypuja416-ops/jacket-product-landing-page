import { z } from "zod";

export const orderInputSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required"),
  phone: z.string().trim().min(7, "Phone number is required"),
  email: z.string().trim().email("Enter a valid email address"),
  location: z.string().trim().min(3, "Exact location is required"),
  productName: z.string().trim().min(1, "Product name is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  pricePerPiece: z.coerce.number().positive("Price per piece must be valid"),
  totalPrice: z.coerce.number().positive("Total price must be valid"),
  selectedSize: z.string().trim().min(1, "Size is required"),
  selectedColor: z.string().trim().min(1, "Color is required"),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export type CompleteOrder = OrderInput & {
  orderId: string;
  dateTime: string;
  paymentMethod: "Cash On Delivery";
  orderStatus: "New Order";
  notes: string;
};

export function createOrderId() {
  const date = new Date();
  const stamp = date
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `COD-${stamp}-${random}`;
}
