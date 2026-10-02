import { SHOP_DEFAULTS, LOCAL_AREAS } from './constants';

export interface DeliveryCheckResult {
  pincode: string;
  locality?: string;
  distanceKm: number;
  isWithinRadius: boolean;
  maxRadiusKm: number;
  deliveryFee: number;
  estimatedHours: number;
  message: string;
  badgeText: string;
  badgeType: 'success' | 'warning' | 'info';
}

/**
 * Calculates straight line distance using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Validates delivery eligibility based on pincode or query
 */
export function validateDeliveryLocation(
  query: string,
  orderSubtotal: number = 0,
  isGrocery: boolean = false,
  customRadiusKm: number = SHOP_DEFAULTS.deliveryRadiusKm
): DeliveryCheckResult {
  const cleanQuery = (query || '').trim().toLowerCase();
  
  // Find match in our Vaishali/Hajipur localities database
  const matchedArea = LOCAL_AREAS.find(
    (area) =>
      area.pincode === cleanQuery ||
      area.name.toLowerCase().includes(cleanQuery) ||
      cleanQuery.includes(area.pincode)
  );

  let distanceKm = 3.2; // default reasonable estimation in Hajipur if area unknown
  let localityName = 'Hajipur / Vaishali';

  if (matchedArea) {
    distanceKm = matchedArea.distanceKm;
    localityName = matchedArea.name;
  } else if (/^84410[1-2]$/.test(cleanQuery)) {
    // Hajipur urban pin codes
    distanceKm = 3.5;
    localityName = 'Hajipur Town Hub';
  } else if (/^844\d{3}$/.test(cleanQuery)) {
    // Vaishali district other pin codes
    distanceKm = 14.0;
    localityName = 'Vaishali District Area';
  } else if (cleanQuery.length > 0) {
    // Other cities or Bihar regions
    distanceKm = 24.0;
    localityName = cleanQuery.toUpperCase();
  }

  const isWithinRadius = distanceKm <= customRadiusKm;

  // Garment delivery is FREE within local radius
  // Grocery delivery fee logic can be applied if grocery is true
  let deliveryFee = 0;
  if (!isWithinRadius) {
    deliveryFee = 80; // Standard courier fee outside 5km
  } else if (isGrocery) {
    // For future grocery module: free over ₹999, else ₹40
    deliveryFee = orderSubtotal >= SHOP_DEFAULTS.freeDeliveryMinOrder ? 0 : 40;
  }

  const estimatedHours = isWithinRadius ? 24 : 72;

  let message = '';
  let badgeText = '';
  let badgeType: 'success' | 'warning' | 'info' = 'success';

  if (isWithinRadius) {
    message = `Eligible for Free 24-Hr Express Local Delivery (${distanceKm} km from Shubhai Chowk)`;
    badgeText = `${distanceKm} km • Eligible`;
    badgeType = 'success';
  } else {
    message = `Outside 5km local radius (${distanceKm} km). Standard courier shipping applies (₹${deliveryFee}, 3-5 days).`;
    badgeText = `${distanceKm} km • Courier Dispatch`;
    badgeType = 'warning';
  }

  return {
    pincode: cleanQuery,
    locality: localityName,
    distanceKm,
    isWithinRadius,
    maxRadiusKm: customRadiusKm,
    deliveryFee,
    estimatedHours,
    message,
    badgeText,
    badgeType,
  };
}
