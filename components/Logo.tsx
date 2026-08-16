import { ShieldCheck } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded bg-espresso text-linen shadow-premium">
        <ShieldCheck className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="font-serif text-xl font-bold text-espresso">Leather Jacket</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leather">
          Premium COD Store
        </p>
      </div>
    </div>
  );
}
