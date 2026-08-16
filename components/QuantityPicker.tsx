"use client";

import { Minus, Plus } from "lucide-react";

type QuantityPickerProps = {
  quantity: number;
  onChange: (quantity: number) => void;
};

export function QuantityPicker({ quantity, onChange }: QuantityPickerProps) {
  return (
    <div className="flex h-12 w-36 items-center justify-between rounded border border-espresso/15 bg-white px-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="grid h-8 w-8 place-items-center rounded bg-linen text-espresso transition hover:bg-cognac hover:text-white"
        onClick={() => onChange(Math.max(1, quantity - 1))}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-lg font-bold">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="grid h-8 w-8 place-items-center rounded bg-espresso text-white transition hover:bg-cognac"
        onClick={() => onChange(quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
