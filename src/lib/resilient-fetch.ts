import { toast } from "sonner";

// Check if we are already in Simulation Mode
export const isSimulationMode = (): boolean => {
  return localStorage.getItem("e_vara_simulation_mode") === "true";
};

// Enable Simulation Mode
export const enableSimulationMode = (): void => {
  if (localStorage.getItem("e_vara_simulation_mode") !== "true") {
    localStorage.setItem("e_vara_simulation_mode", "true");
    toast.warning("DATABASE OFFLINE: Silent failover engaged. Booting Local Simulation Mode.", {
      description: "App features are fully simulated using client-side vaults.",
      duration: 5000,
    });
  }
};

/**
 * Executes an operation with automatic retry & fallback to localStorage.
 * If both fail, it returns the provided static mock fallback data.
 */
export async function runResilient<T>(
  operation: () => Promise<T>,
  storageKey: string,
  mockFallback: T,
  retries = 3,
  delay = 500
): Promise<T> {
  // If we are already in simulation mode, immediately bypass and serve cache/mock
  if (isSimulationMode()) {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch (e) {
        return mockFallback;
      }
    }
    return mockFallback;
  }

  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await operation();
      // Cache successful database responses
      localStorage.setItem(storageKey, JSON.stringify(result));
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const backoffDelay = delay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  console.warn(`Resilient fetch exhausted all ${retries} retries for ${storageKey}. Silent failover engaged. Error:`, lastError);
  enableSimulationMode();

  const cached = localStorage.getItem(storageKey);
  if (cached) {
    try {
      return JSON.parse(cached) as T;
    } catch (e) {}
  }
  return mockFallback;
}
