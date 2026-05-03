export const socketHandler =
  (fn: (...args: any[]) => Promise<void>) =>
  async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (err) {
      console.error("socket error:", err);
    }
  };
