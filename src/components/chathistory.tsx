import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ChatItem {
  id: string;
  document_name: string;
  user_message: string;
  ai_response: string;
  created_at: string;
}

interface Props {
  onSelectChat: (chat: ChatItem) => void;
}

const ChatHistory = ({ onSelectChat }: Props) => {
  const [history, setHistory] = useState<ChatItem[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("chat_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setHistory(data);
  };

  return (
    <div className="w-64 border-r h-full overflow-y-auto p-3">
      <h2 className="text-lg font-semibold mb-3">History</h2>

      {history.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectChat(item)}
          className="p-2 rounded-lg hover:bg-muted cursor-pointer mb-2"
        >
          <p className="text-sm font-medium truncate">
            {item.document_name || "Untitled"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {item.user_message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;