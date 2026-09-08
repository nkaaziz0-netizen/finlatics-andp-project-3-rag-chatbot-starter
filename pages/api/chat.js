// pages/chat/[docId].js
import { useState } from "react";
import { useRouter } from "next/router";
import ChatMessage from "../../components/ChatMessage";

export default function ChatPage() {
  const router = useRouter();
  const { docId } = router.query;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const assistantMsgIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "", sources: [] }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, documentId: docId }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") break;

            const parsed = JSON.parse(dataStr);
            setMessages((prev) => {
              const updated = [...prev];
              if (parsed.text) {
                updated[assistantMsgIndex].content += parsed.text;
              }
              if (parsed.sources) {
                updated[assistantMsgIndex].sources = parsed.sources;
              }
              return updated;
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <ChatMessage key={idx} message={m} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your PDF..."
          className="flex-1 bg-zinc-900 border border-zinc-700 p-3 rounded text-white"
        />
        <button disabled={loading} className="bg-blue-600 px-6 py-3 rounded text-white font-medium">
          Send
        </button>
      </form>
    </div>
  );
}