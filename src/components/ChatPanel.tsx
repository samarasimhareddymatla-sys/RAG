// import { useState, useRef, useEffect } from "react";
// import { Send, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ChatMessage from "./ChatMessage";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// interface ChatPanelProps {
//   documentText: string;
//   documentName: string;
// }

// const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doc-chat`;

// const ChatPanel = ({ documentText, documentName }: ChatPanelProps) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   const sendMessage = async () => {
//     const text = input.trim();
//     if (!text || isLoading) return;

//     const userMsg: Message = { role: "user", content: text };

//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const resp = await fetch(CHAT_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
//         },
//         body: JSON.stringify({
//           messages: [...messages, userMsg],
//           documentText,
//           documentName,
//         }),
//       });

//       if (!resp.ok) {
//         throw new Error("Request failed");
//       }

//       const data = await resp.json();

//       console.log("AI RESPONSE:", data);

//       const reply = data.reply || "No response from AI";

//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: reply },
//       ]);
//     } catch (error) {
//       console.error("Chat error:", error);

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Something went wrong. Please try again.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Messages */}
//       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 && (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <p className="text-lg font-medium text-foreground mb-1">
//                 Ask anything about your document
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 {documentName
//                   ? `Chatting with: ${documentName}`
//                   : "Upload a document to get started"}
//               </p>
//             </div>
//           </div>
//         )}

//         {messages.map((msg, i) => (
//           <ChatMessage key={i} role={msg.role} content={msg.content} />
//         ))}

//         {isLoading && (
//           <div className="flex gap-3">
//             <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
//               <Loader2 className="w-4 h-4 animate-spin" />
//             </div>
//             <div className="rounded-2xl px-4 py-3 bg-muted">
//               <p className="text-sm text-muted-foreground">Thinking...</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="border-t border-border p-4">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             sendMessage();
//           }}
//           className="flex gap-2"
//         >
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder={
//               documentText
//                 ? "Ask about your document..."
//                 : "Upload a document first..."
//             }
//             disabled={!documentText || isLoading}
//             className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none disabled:opacity-50"
//           />

//           <Button
//             type="submit"
//             size="icon"
//             className="h-12 w-12 rounded-xl"
//             disabled={!input.trim() || !documentText || isLoading}
//           >
//             <Send className="w-4 h-4" />
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatPanel;

// import { useState, useRef, useEffect } from "react";
// import { Send, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ChatMessage from "./ChatMessage";
// import { splitIntoChunks, findRelevantChunk } from "@/lib/pdf";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// interface ChatPanelProps {
//   documentText: string;
//   documentName: string;
// }

// const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doc-chat`;

// const ChatPanel = ({ documentText, documentName }: ChatPanelProps) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   const sendMessage = async () => {
//     const text = input.trim();
//     if (!text || isLoading) return;

//     const userMsg: Message = { role: "user", content: text };

//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       // 🔥 SMART CHUNKING
//       const chunks = splitIntoChunks(documentText);
//       const bestChunk = findRelevantChunk(chunks, text);

//       const resp = await fetch(CHAT_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messages: [...messages, userMsg],
//           documentText: bestChunk,
//           documentName,
//         }),
//       });

//       const data = await resp.json();

//       const reply = data.reply || "No response from AI";

//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: reply },
//       ]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Something went wrong. Please try again.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg, i) => (
//           <ChatMessage key={i} role={msg.role} content={msg.content} />
//         ))}

//         {isLoading && (
//           <div className="flex gap-3">
//             <Loader2 className="w-4 h-4 animate-spin" />
//             <p>Thinking...</p>
//           </div>
//         )}
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           sendMessage();
//         }}
//         className="flex gap-2 p-4"
//       >
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border px-3 py-2"
//         />
//         <Button type="submit">
//           <Send />
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default ChatPanel;


// import { useState, useRef, useEffect } from "react";
// import { Send, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ChatMessage from "./ChatMessage";
// import { splitIntoChunks, findRelevantChunk } from "@/lib/pdf";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// interface ChatPanelProps {
//   documentText: string;
//   documentName: string;
//   selectedChat?: any;
// }

// const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doc-chat`;

// const ChatPanel = ({ documentText, documentName, selectedChat }: ChatPanelProps) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // 🔥 Auto scroll
//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   // 🔥 Load selected chat from sidebar
//   useEffect(() => {
//     if (selectedChat) {
//       setConversationId(selectedChat.id);

//       const formatted = selectedChat.messages.map((m: any) => ({
//         role: m.role,
//         content: m.content,
//       }));

//       setMessages(formatted);
//     }
//   }, [selectedChat]);

//   // 🔥 New chat when document changes
//   useEffect(() => {
//     setMessages([]);
//     setConversationId(null);
//   }, [documentName]);

//   const sendMessage = async () => {
//     const text = input.trim();
//     if (!text || isLoading) return;

//     const userMsg: Message = { role: "user", content: text };

//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const chunks = splitIntoChunks(documentText);
//       const bestChunk = findRelevantChunk(chunks, text);

//       const resp = await fetch(CHAT_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           messages: [...messages, userMsg],
//           documentText: bestChunk,
//           documentName,
//           conversationId,
//         }),
//       });

//       const data = await resp.json();

//       if (data.conversationId && !conversationId) {
//         setConversationId(data.conversationId);
//       }

//       const reply = data.reply || "No response from AI";

//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: reply },
//       ]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Something went wrong. Please try again.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg, i) => (
//           <ChatMessage key={i} role={msg.role} content={msg.content} />
//         ))}

//         {isLoading && (
//           <div className="flex gap-3">
//             <Loader2 className="w-4 h-4 animate-spin" />
//             <p>Thinking...</p>
//           </div>
//         )}
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           sendMessage();
//         }}
//         className="flex gap-2 p-4"
//       >
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border px-3 py-2"
//         />
//         <Button type="submit">
//           <Send />
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default ChatPanel;


import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import { splitIntoChunks, findRelevantChunk } from "@/lib/pdf";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  documentText: string;
  documentName: string;
  selectedChat?: any;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doc-chat`;

const ChatPanel = ({ documentText, documentName, selectedChat }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // ✅ Load previous chat
  useEffect(() => {
    if (selectedChat) {
      setConversationId(selectedChat.id);

      const formatted = selectedChat.messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages(formatted);
    }
  }, [selectedChat]);

  // ✅ Reset when new document
  useEffect(() => {
    setMessages([]);
    setConversationId(null);
  }, [documentName]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const chunks = splitIntoChunks(documentText);
      const bestChunk = findRelevantChunk(chunks, text);

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          documentText: bestChunk,
          documentName,
          conversationId,
        }),
      });

      const data = await resp.json();

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const reply = data.reply || "No response from AI";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p>Thinking...</p>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-3 py-2"
        />
        <Button type="submit">
          <Send />
        </Button>
      </form>
    </div>
  );
};

export default ChatPanel;