export const socketHandler =
  (fn: (socket: any, ...args: any[]) => Promise<void>) =>
  async (socket: any, ...args: any[]) => {
    try {
      await fn(socket, ...args);
    } catch (err) {
      console.error("socket error:", err);
      socket.emit("socket_error", "Something went wrong");
    }
  };
