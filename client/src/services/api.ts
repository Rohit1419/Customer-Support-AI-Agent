import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export const chatApi = {
  sendMessage: (message: string, sessionId: string) =>
    api.post("/chat/message", { message, sessionId }),

  getHistory: (sessionId: string) => api.get(`/chat/history/${sessionId}`),
};
