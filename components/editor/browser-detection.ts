/**
 * Detect browser name from user agent
 */
export function detectBrowser(): string {
  if (typeof window === "undefined") return "Chrome";
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes("edg")) return "Edge";
  if (userAgent.includes("chrome")) return "Chrome";
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) return "Safari";
  if (userAgent.includes("firefox")) return "Firefox";
  if (userAgent.includes("opera") || userAgent.includes("opr")) return "Opera";
  if (userAgent.includes("brave")) return "Brave";
  
  return "Chrome"; // Default fallback
}

/**
 * Generate Google search query for clearing localStorage in the detected browser
 */
export function getClearStorageSearchQuery(): string {
  const browser = detectBrowser();
  return `how to clear local storage ${browser} browser`;
}

