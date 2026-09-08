// components/ChatMessage.jsx
export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`p-4 rounded-lg my-2 ${isUser ? "bg-blue-900/40 ml-auto max-w-[80%]" : "bg-zinc-800 mr-auto max-w-[90%]"}`}>
      <div className="text-xs text-zinc-400 font-semibold mb-1">
        {isUser ? "You" : "Gemini AI"}
      </div>
      
      {/* Streamed Answer */}
      <div className="text-zinc-100 whitespace-pre-wrap text-sm leading-relaxed">
        {message.content}
      </div>

      {/* Sources list appended at completion */}
      {message.sources && message.sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-700">
          <span className="text-xs font-semibold text-zinc-400">Sources Cited:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {message.sources.map((src, i) => (
              <span key={src.id || i} className="text-xs bg-zinc-700 px-2 py-1 rounded text-zinc-300">
                [Source {i + 1}] Page {src.metadata?.page || "N/A"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}