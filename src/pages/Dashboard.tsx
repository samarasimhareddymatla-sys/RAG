// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import PdfUpload from "@/components/PdfUpload";
// import ChatPanel from "@/components/ChatPanel";
// import { Button } from "@/components/ui/button";
// import { FileText, LogOut, PanelLeftClose, PanelLeft } from "lucide-react";

// interface Doc {
//   name: string;
//   text: string;
// }

// const Dashboard = () => {
//   const { user, signOut } = useAuth();
//   const navigate = useNavigate();
//   const [documents, setDocuments] = useState<Doc[]>([]);
//   const [activeDoc, setActiveDoc] = useState<number | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const handleLogout = async () => {
//     await signOut();
//     navigate("/");
//   };

//   const handleTextExtracted = (text: string, fileName: string) => {
//     const newDocs = [...documents, { name: fileName, text }];
//     setDocuments(newDocs);
//     setActiveDoc(newDocs.length - 1);
//   };

//   const handleRemoveDocument = (index: number) => {
//     const newDocs = documents.filter((_, i) => i !== index);
//     setDocuments(newDocs);
//     if (activeDoc === index) setActiveDoc(newDocs.length > 0 ? 0 : null);
//     else if (activeDoc !== null && activeDoc > index) setActiveDoc(activeDoc - 1);
//   };

//   const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
//   const currentDoc = activeDoc !== null ? documents[activeDoc] : null;

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       {/* Top bar */}
//       <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
//         <div className="flex items-center gap-3">
//           <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
//             {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
//           </Button>
//           <div className="flex items-center gap-2">
//             <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
//               <FileText className="w-3.5 h-3.5 text-primary-foreground" />
//             </div>
//             <span className="font-semibold text-foreground hidden sm:inline">DocChat AI</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {displayName}</span>
//           <Button variant="ghost" size="sm" onClick={handleLogout}>
//             <LogOut className="w-4 h-4 mr-1" /> Logout
//           </Button>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-200 border-r border-border bg-card overflow-hidden flex-shrink-0`}>
//           <div className="p-4 w-80 h-full overflow-y-auto">
//             <h2 className="text-sm font-semibold text-foreground mb-4">Documents</h2>
//             <PdfUpload
//               onTextExtracted={handleTextExtracted}
//               documents={documents}
//               onRemoveDocument={handleRemoveDocument}
//             />
//             {documents.length > 1 && (
//               <div className="mt-4 space-y-1">
//                 <p className="text-xs font-medium text-muted-foreground mb-2">Select document to chat:</p>
//                 {documents.map((doc, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveDoc(i)}
//                     className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
//                       activeDoc === i
//                         ? "bg-accent text-accent-foreground font-medium"
//                         : "text-muted-foreground hover:bg-muted"
//                     }`}
//                   >
//                     {doc.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </aside>

//         {/* Chat */}
//         <main className="flex-1 overflow-hidden">
//           <ChatPanel
//             documentText={currentDoc?.text || ""}
//             documentName={currentDoc?.name || ""}
//           />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import PdfUpload from "@/components/PdfUpload";
// import ChatPanel from "@/components/ChatPanel";
// import { Button } from "@/components/ui/button";
// import { FileText, LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
// import { supabase } from "@/lib/supabase";

// interface Doc {
//   name: string;
//   text: string;
// }

// const Dashboard = () => {
//   const { user, signOut } = useAuth();
//   const navigate = useNavigate();

//   const [documents, setDocuments] = useState<Doc[]>([]);
//   const [activeDoc, setActiveDoc] = useState<number | null>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedChat, setSelectedChat] = useState<any>(null);
//   const [history, setHistory] = useState<any[]>([]);

//   const handleLogout = async () => {
//     await signOut();
//     navigate("/");
//   };

//   // 🔥 Upload → new chat
//   const handleTextExtracted = async (text: string, fileName: string) => {
//     const newDocs = [...documents, { name: fileName, text }];
//     setDocuments(newDocs);
//     setActiveDoc(newDocs.length - 1);
//     setSelectedChat(null);

//     fetchHistory();
//   };

//   // 🔥 Fetch sidebar history
//   const fetchHistory = async () => {
//     const { data } = await supabase
//       .from("conversations")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (data) setHistory(data);
//   };

//   // 🔥 Load chat when clicked
//   const handleSelectChat = async (chat: any) => {
//     const { data } = await supabase
//       .from("messages")
//       .select("*")
//       .eq("conversation_id", chat.id)
//       .order("created_at");

//     setSelectedChat({
//       id: chat.id,
//       messages: data,
//     });
//   };

//   const displayName =
//     user?.user_metadata?.full_name ||
//     user?.email?.split("@")[0] ||
//     "User";

//   const currentDoc = activeDoc !== null ? documents[activeDoc] : null;

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       {/* Header */}
//       <header className="flex items-center justify-between px-4 py-3 border-b">
//         <div className="flex items-center gap-2">
//           <FileText className="w-4 h-4" />
//           <span>DocChat AI</span>
//         </div>

//         <Button onClick={handleLogout}>
//           <LogOut className="w-4 h-4 mr-1" />
//           Logout
//         </Button>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside className={`${sidebarOpen ? "w-80" : "w-0"} border-r overflow-hidden`}>
//           <div className="p-4 w-80 overflow-y-auto">

//             {/* Upload */}
//             <PdfUpload
//               onTextExtracted={handleTextExtracted}
//               documents={documents}
//               onRemoveDocument={() => {}}
//             />

//             {/* 🔥 History */}
//             <div className="mt-4">
//               <h3 className="text-sm font-semibold mb-2">Chat History</h3>

//               {history.map((chat) => (
//                 <div
//                   key={chat.id}
//                   onClick={() => handleSelectChat(chat)}
//                   className="p-2 rounded hover:bg-muted cursor-pointer"
//                 >
//                   <p className="text-sm">{chat.document_name}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Chat */}
//         <main className="flex-1">
//           <ChatPanel
//             documentText={currentDoc?.text || ""}
//             documentName={currentDoc?.name || ""}
//             selectedChat={selectedChat}
//           />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PdfUpload from "@/components/PdfUpload";
import ChatPanel from "@/components/ChatPanel";
import { Button } from "@/components/ui/button";
import { FileText, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Doc {
  name: string;
  text: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<Doc[]>([]);
  const [activeDoc, setActiveDoc] = useState<number | null>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // ✅ Load history on page load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setHistory(data);
  };

  // ✅ Upload = new chat
  const handleTextExtracted = async (text: string, fileName: string) => {
    const newDocs = [...documents, { name: fileName, text }];
    setDocuments(newDocs);
    setActiveDoc(newDocs.length - 1);
    setSelectedChat(null);

    await fetchHistory();
  };

  // ✅ Load full conversation
  const handleSelectChat = async (chat: any) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", chat.id)
      .order("created_at");

    setSelectedChat({
      id: chat.id,
      messages: data,
    });
  };

  const currentDoc = activeDoc !== null ? documents[activeDoc] : null;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Pheniox</span>
        </div>
        <Button onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-80 border-r p-4 overflow-y-auto">
          <PdfUpload
            onTextExtracted={handleTextExtracted}
            documents={documents}
            onRemoveDocument={() => {}}
          />

          {/* ✅ Chat History */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Chat History</h3>

            {history.length === 0 && (
              <p className="text-xs text-muted-foreground">No chats yet</p>
            )}

            {history.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className="p-2 rounded hover:bg-muted cursor-pointer mb-1"
              >
                <p className="text-sm truncate">{chat.document_name}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <main className="flex-1">
          <ChatPanel
            documentText={currentDoc?.text || ""}
            documentName={currentDoc?.name || ""}
            selectedChat={selectedChat}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
