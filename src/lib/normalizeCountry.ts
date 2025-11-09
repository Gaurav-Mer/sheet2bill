import { countryList } from "@/lib/countryList";

/**
 * Returns the full country name for a given country code.
 * If not found, returns the code itself or a fallback text.
 *
 * @param code - The ISO country code (e.g. "IN", "US")
 * @returns The full country name (e.g. "India") or the code if not found
 */
export function normalizeCountry(code?: string): string {
    if (!code) return "";
    const country = countryList.find(
        (c) => c.code.toLowerCase() === code.toLowerCase()
    );
    return country ? country.name : code;
}
