// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
// };

// serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       status: 204,
//       headers: corsHeaders,
//     });
//   }

//   try {
//     const payload = await req.json().catch(() => null);
//     const messages = Array.isArray(payload?.messages) ? payload.messages : [];

//     // Get the latest user message from provided messages array
//     const latestUserMessage = [...messages]
//       .reverse()
//       .find((m) => m?.role === "user" || m?.author === "user");

//     const userMessage =
//       latestUserMessage?.content ||
//       latestUserMessage?.message ||
//       latestUserMessage?.text ||
//       latestUserMessage?.data?.text ||
//       "";

//     if (!userMessage || typeof userMessage !== "string" || userMessage.trim() === "") {
//       return new Response(
//         JSON.stringify({ reply: "No user message provided" }),
//         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
//     if (!GEMINI_API_KEY) {
//       console.error("GEMINI_API_KEY missing");
//       return new Response(
//         JSON.stringify({ reply: "Server configuration error: GEMINI_API_KEY missing" }),
//         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     const geminiBody = {
//       model: "gemini-1.5-flash",
//       // no streaming
//       temperature: 0.2,
//       max_output_tokens: 1024,
//       candidate_count: 1,
//       // this matches the requested structure for the injector
//       contents: [{ role: "user", parts: [{ text: userMessage }] }],
//     };

//     const geminiResponse = await fetch(
//       "https://gemini.googleapis.com/v1/models/gemini-1.5-flash:generateText",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${GEMINI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(geminiBody),
//       },
//     );

//     const geminiText = await geminiResponse.text();
//     console.log("Gemini raw response:", geminiText);

//     let geminiJson;
//     try {
//       geminiJson = JSON.parse(geminiText);
//     } catch (parseError) {
//       console.error("Failed to parse Gemini response", parseError);
//       return new Response(
//         JSON.stringify({ reply: `Gemini parse error: ${parseError?.message ?? "unknown"}` }),
//         { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     if (!geminiResponse.ok) {
//       const errorFromAPI =
//         geminiJson?.error ||
//         geminiJson?.message ||
//         JSON.stringify(geminiJson, null, 2);
//       console.error("Gemini API returned non-OK status", geminiResponse.status, errorFromAPI);
//       return new Response(
//         JSON.stringify({ reply: `Gemini API error (${geminiResponse.status}): ${errorFromAPI}` }),
//         { status: geminiResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     const candidateText =
//       geminiJson?.candidates?.[0]?.content?.[0]?.text ||
//       geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       geminiJson?.output?.[0]?.content?.[0]?.text ||
//       geminiJson?.output?.[0]?.content?.parts?.[0]?.text ||
//       geminiJson?.text ||
//       "";

//     if (!candidateText || candidateText.trim() === "") {
//       const fallback = geminiJson?.error || geminiJson?.message || JSON.stringify(geminiJson);
//       console.error("Gemini did not return text candidate, fallback:", fallback);
//       return new Response(
//         JSON.stringify({ reply: `No response from AI, raw API: ${fallback}` }),
//         { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     return new Response(JSON.stringify({ reply: candidateText.trim() }), {
//       status: 200,
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Unhandled function error:", error);
//     return new Response(
//       JSON.stringify({ reply: `Internal server error: ${error instanceof Error ? error.message : "unknown"}` }),
//       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//     );
//   }
// });

// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
// };

// serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       status: 204,
//       headers: corsHeaders,
//     });
//   }

//   try {
//     const payload = await req.json().catch(() => null);
//     const messages = Array.isArray(payload?.messages) ? payload.messages : [];

//     // Get the latest user message from provided messages array
//     const latestUserMessage = [...messages]
//       .reverse()
//       .find((m) => m?.role === "user" || m?.author === "user");

//     const userMessage =
//       latestUserMessage?.content ||
//       latestUserMessage?.message ||
//       latestUserMessage?.text ||
//       latestUserMessage?.data?.text ||
//       "";

//     if (!userMessage || typeof userMessage !== "string" || userMessage.trim() === "") {
//       return new Response(
//         JSON.stringify({ reply: "No user message provided" }),
//         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
//     if (!GEMINI_API_KEY) {
//       console.error("GEMINI_API_KEY missing");
//       return new Response(
//         JSON.stringify({ reply: "Server configuration error: GEMINI_API_KEY missing" }),
//         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     const geminiBody = {
//       model: "gemini-1.5-flash",
//       // no streaming
//       temperature: 0.2,
//       max_output_tokens: 1024,
//       candidate_count: 1,
//       // this matches the requested structure for the injector
//       contents: [{ role: "user", parts: [{ text: userMessage }] }],
//     };

//     const geminiResponse = await fetch(
//       "https://gemini.googleapis.com/v1/models/gemini-1.5-flash:generateText",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${GEMINI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(geminiBody),
//       },
//     );

//     const geminiText = await geminiResponse.text();
//     console.log("Gemini raw response:", geminiText);

//     let geminiJson;
//     try {
//       geminiJson = JSON.parse(geminiText);
//     } catch (parseError) {
//       console.error("Failed to parse Gemini response", parseError);
//       return new Response(
//         JSON.stringify({ reply: `Gemini parse error: ${parseError?.message ?? "unknown"}` }),
//         { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     if (!geminiResponse.ok) {
//       const errorFromAPI =
//         geminiJson?.error ||
//         geminiJson?.message ||
//         JSON.stringify(geminiJson, null, 2);
//       console.error("Gemini API returned non-OK status", geminiResponse.status, errorFromAPI);
//       return new Response(
//         JSON.stringify({ reply: `Gemini API error (${geminiResponse.status}): ${errorFromAPI}` }),
//         { status: geminiResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     const candidateText =
//       geminiJson?.candidates?.[0]?.content?.[0]?.text ||
//       geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       geminiJson?.output?.[0]?.content?.[0]?.text ||
//       geminiJson?.output?.[0]?.content?.parts?.[0]?.text ||
//       geminiJson?.text ||
//       "";

//     if (!candidateText || candidateText.trim() === "") {
//       const fallback = geminiJson?.error || geminiJson?.message || JSON.stringify(geminiJson);
//       console.error("Gemini did not return text candidate, fallback:", fallback);
//       return new Response(
//         JSON.stringify({ reply: `No response from AI, raw API: ${fallback}` }),
//         { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//       );
//     }

//     return new Response(JSON.stringify({ reply: candidateText.trim() }), {
//       status: 200,
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Unhandled function error:", error);
//     return new Response(
//       JSON.stringify({ reply: `Internal server error: ${error instanceof Error ? error.message : "unknown"}` }),
//       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
//     );
//   }
// });


// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
// };

// serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const { messages, documentText } = await req.json();

//     const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
//     if (!GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");

//     const userMessage = messages[messages.length - 1]?.content || "";

//     const prompt = `
// You are an AI assistant helping with a document.

// IMPORTANT:
// - Only use the given document chunk
// - If answer not found, say "Not found in document"

// DOCUMENT:
// ${documentText}

// QUESTION:
// ${userMessage}
// `;

//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${GROQ_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "llama-3.1-8b-instant",
//           messages: [
//             { role: "system", content: "You are a helpful AI assistant." },
//             ...messages,
//             { role: "user", content: prompt },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();

//     const reply =
//       data?.choices?.[0]?.message?.content || "No response from AI";

//     return new Response(JSON.stringify({ reply }), {
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//     });

//   } catch (error) {
//     return new Response(
//       JSON.stringify({ error: error.message }),
//       {
//         status: 500,
//         headers: { ...corsHeaders, "Content-Type": "application/json" },
//       }
//     );
//   }
// });


// // @ts-ignore
// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// // @ts-ignore
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
// };

// // ✅ Initialize Supabase
// // @ts-ignore
// const supabase = createClient(
//   Deno.env.get("SUPABASE_URL"),
//   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
// );

// serve(async (req: Request) => {
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const { messages, documentText, documentName } = await req.json();

//     // @ts-ignore
//     const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
//     if (!GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");

//     const userMessage =
//       messages && messages.length > 0
//         ? messages[messages.length - 1].content
//         : "";

//     // ✅ Prompt (smart + strict)
//     const prompt = `
// You are an AI assistant helping with a document.

// IMPORTANT:
// - Only use the provided document chunk
// - If answer is not in it, say "Not found in document"

// DOCUMENT:
// ${documentText}

// QUESTION:
// ${userMessage}
// `;

//     // ✅ Groq API call
//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${GROQ_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "llama-3.1-8b-instant",
//           messages: [
//             { role: "system", content: "You are a helpful AI assistant." },
//             ...messages, // ✅ chat memory
//             { role: "user", content: prompt },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();

//     const reply =
//       data?.choices?.[0]?.message?.content || "No response from AI";

//     // ✅ SAVE CHAT HISTORY (NEW FEATURE)
//     await supabase.from("chat_history").insert({
//       document_name: documentName,
//       user_message: userMessage,
//       ai_response: reply,
//     });

//     // ✅ Return response
//     return new Response(JSON.stringify({ reply }), {
//       headers: {
//         ...corsHeaders,
//         "Content-Type": "application/json",
//       },
//     });

//   } catch (error: any) {
//     console.error("ERROR:", error);

//     return new Response(
//       JSON.stringify({
//         error: error.message || "Unknown error",
//       }),
//       {
//         status: 500,
//         headers: {
//           ...corsHeaders,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// });


// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// @ts-ignore
const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, documentText, documentName, conversationId } = await req.json();

    // @ts-ignore
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    const userMessage = messages[messages.length - 1]?.content || "";

    // ✅ Create or reuse conversation
    let convId = conversationId;

    if (!convId) {
      const { data } = await supabase
        .from("conversations")
        .insert({ document_name: documentName })
        .select()
        .single();

      convId = data.id;
    }

    // ✅ Save user message
    await supabase.from("messages").insert({
      conversation_id: convId,
      role: "user",
      content: userMessage,
    });

    const prompt = `
You are an AI assistant helping with a document.

DOCUMENT:
${documentText}

QUESTION:
${userMessage}
`;

    // ✅ AI call
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are helpful AI" },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response";

    // ✅ Save AI response
    await supabase.from("messages").insert({
      conversation_id: convId,
      role: "assistant",
      content: reply,
    });

    return new Response(
      JSON.stringify({ reply, conversationId: convId }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});