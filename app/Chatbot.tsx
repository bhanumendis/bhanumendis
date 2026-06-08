"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  "Who is Bhanu?",
  "Awards & achievements",
  "How to contact?",
  "About Swara Concert",
  "Tuition / teaching",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "ආයුබෝවන්! I'm Bhanu's AI assistant. Ask me anything about his work, achievements, or how to get in touch.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response. Please try emailing bhanumendis@gmail.com directly.";
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: userMsg }] },
        { role: "model", parts: [{ text: reply }] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please email bhanumendis@gmail.com directly." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* Chat window */}
      <div className={`chat-window ${open ? "open" : ""}`} role="dialog" aria-label="Chat with Bhanu's AI assistant">
        <div className="chat-header">
          <div className="chat-header-dot"></div>
          <div>
            <div className="chat-header-title">Ask Bhanu&apos;s AI</div>
            <div className="chat-header-sub">Powered by Gemini · Usually instant</div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
        </div>

        <div className="chat-messages" role="log" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-typing">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <input
            ref={inputRef}
            className="chat-input"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
            aria-label="Chat message input"
            maxLength={500}
          />
          <button
            className="chat-send"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button
        className="chat-btn"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
      </button>
    </>
  );
}