import { calculateNights } from "./utils";
import { PriceQuote } from "./types";

export interface CalculatePriceParams {
  checkInDate: string;
  checkOutDate: string;
  basePricePerNight: number;
  numAdults: number;
  maxStandardAdults?: number;
  extraPersonFee?: number;
  serviceChargeRate?: number; // default 0.10 (10%)
  vatRate?: number;           // default 0.15 (15%)
  currency?: string;
}

/**
 * Authoritative Server-Side Pricing Engine
 * Computes exact breakdown: Base Nights + Extra Guest Fee + 10% Service Charge + 15% VAT
 */
export function calculateReservationPrice({
  checkInDate,
  checkOutDate,
  basePricePerNight,
  numAdults,
  maxStandardAdults = 2,
  extraPersonFee = 0,
  serviceChargeRate = 0.10,
  vatRate = 0.15,
  currency = "ETB",
}: CalculatePriceParams): PriceQuote {
  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights <= 0) {
    throw new Error("Invalid stay duration: Check-out date must follow check-in date.");
  }

  const roomSubtotal = nights * basePricePerNight;
  
  // Extra guest surcharge
  const extraGuestsCount = Math.max(0, numAdults - maxStandardAdults);
  const extraGuestsCharge = extraGuestsCount * extraPersonFee * nights;

  const totalBeforeTaxes = roomSubtotal + extraGuestsCharge;

  // 10% Hotel Service Charge
  const serviceCharge = Math.round(totalBeforeTaxes * serviceChargeRate * 100) / 100;

  // 15% VAT applied on base + service charge in Ethiopian hospitality practice
  const taxableSubtotal = totalBeforeTaxes + serviceCharge;
  const vat = Math.round(taxableSubtotal * vatRate * 100) / 100;

  const total = Math.round((totalBeforeTaxes + serviceCharge + vat) * 100) / 100;

  return {
    nights,
    baseRatePerNight: basePricePerNight,
    roomSubtotal,
    extraGuestsCharge,
    serviceCharge,
    vat,
    total,
    currency,
  };
}
