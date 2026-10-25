import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with Ethiopian Birr (ETB) default or configured currency
 */
export function formatCurrency(amount: number, currency: string = "ETB"): string {
  if (currency === "ETB") {
    return `${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ETB`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Calculate total nights between check-in and check-out
 * Check-in is inclusive, check-out is exclusive
 */
export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const dIn = new Date(checkIn);
  const dOut = new Date(checkOut);
  
  // Normalize to UTC midnight to avoid DST or timezone edge cases
  const utcIn = Date.UTC(dIn.getFullYear(), dIn.getMonth(), dIn.getDate());
  const utcOut = Date.UTC(dOut.getFullYear(), dOut.getMonth(), dOut.getDate());
  
  const diffMs = utcOut - utcIn;
  const nights = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

/**
 * Format ISO date string into luxury editorial format (e.g., "Thursday, 24 Oct 2026")
 */
export function formatDateEditorial(dateString: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Generate a unique Medaresha reservation number (e.g. MED-82914)
 */
export function generateReservationNumber(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `MED-${randomSuffix}`;
}
