"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  contenu: string;
  createdAt: Date;
  auteurId: string;
  auteur: { name: string | null; role: string };
}

interface MessageThreadProps {
  demandeId: string;
  messages: Message[];
  currentUserId: string;
}

export function MessageThread({ demandeId, messages: initialMessages, currentUserId }: MessageThreadProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demandeId, contenu: text.trim() }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      const { message } = await res.json();
      setMessages((prev) => [...prev, message]);
      setText("");
    } catch {
      toast({ title: "Erreur", description: "Message non envoyé", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-display font-bold text-[#1a1a2e]">Messagerie</h3>
      </div>

      {/* Messages */}
      <div className="p-6 space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            Aucun message. Commencez la conversation !
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.auteurId === currentUserId;
            return (
              <div
                key={msg.id}
                className={cn("flex gap-3", isOwn ? "flex-row-reverse" : "flex-row")}
              >
                <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-400 text-xs font-bold">
                    {msg.auteur.name?.[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div className={cn("max-w-[75%]", isOwn ? "items-end" : "items-start", "flex flex-col")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      isOwn
                        ? "bg-[#1a1a2e] text-white rounded-tr-sm"
                        : "bg-[#f8f7f4] text-[#1a1a2e] rounded-tl-sm"
                    )}
                  >
                    {msg.contenu}
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
        <div className="flex gap-3 items-end">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message... (Entrée pour envoyer)"
            rows={2}
            className="flex-1 resize-none"
          />
          <Button
            onClick={sendMessage}
            disabled={!text.trim() || sending}
            aria-label="Envoyer le message"
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 h-auto"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
