"use client";
import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "ai"; text: string; }
interface HistoryItem { role: string; parts: { text: string }[]; }

const SUGGESTIONS = [
  "Who is Bhanu Mendis?",
  "Awards & achievements",
  "How to get in touch?",
  "About Swara Concert",
  "Tuition enquiry",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hello! Feel free to ask anything about Bhanu, his work, or how to get in touch." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const msg = text.trim();
    setInput("");
    setMessages(p => [...p, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      const reply = data.reply || "Something went wrong. Please email bhanumendis@gmail.com directly.";
      setMessages(p => [...p, { role: "ai", text: reply }]);
      setHistory(p => [...p,
        { role: "user", parts: [{ text: msg }] },
        { role: "model", parts: [{ text: reply }] },
      ]);
    } catch {
      setMessages(p => [...p, { role: "ai", text: "Something went wrong. Please email bhanumendis@gmail.com directly." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`cbot-window ${open ? "cbot-open" : ""}`} role="dialog" aria-label="Site assistant">

        <div className="cbot-header">
          <div className="cbot-header-dot" aria-hidden="true"></div>
          <div className="cbot-header-text">Ask AI</div>
          <button className="cbot-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
        </div>

        <div className="cbot-msgs" role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`cbot-msg cbot-${m.role}`}>
              <div className="cbot-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="cbot-typing" aria-label="Typing">
              <span /><span /><span />
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {messages.length <= 1 && (
          <div className="cbot-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="cbot-sug" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        <div className="cbot-input-row">
          <input
            ref={inputRef}
            className="cbot-input"
            placeholder="Ask a question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(input); } }}
            disabled={loading}
            maxLength={400}
            aria-label="Question input"
          />
          <button className="cbot-send" onClick={() => send(input)} disabled={loading || !input.trim()} aria-label="Send">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>

      <button className="cbot-btn" onClick={() => setOpen(o => !o)} aria-label={open ? "Close assistant" : "Open assistant"} aria-expanded={open}>
        {open
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        }
      </button>
    </>
  );
}