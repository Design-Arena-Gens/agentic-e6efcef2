"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/message-bubble";
import { QuickActions } from "@/components/chat/quick-actions";
import {
  AgentContext,
  AgentMessage,
  generateAgentResponse,
  initialiseContext,
  welcomeMessage,
} from "@/lib/agent";

type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

function formatTimestamp(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createMessage(role: "user" | "assistant", content: string): ConversationMessage {
  const now = new Date();
  return {
    id: `${role}-${now.getTime()}-${Math.random().toString(16).slice(2, 6)}`,
    role,
    content,
    timestamp: formatTimestamp(now),
  };
}

export default function Home() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [context, setContext] = useState<AgentContext>(() => initialiseContext());
  const [agentSuggestions, setAgentSuggestions] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcome = createMessage(
      "assistant",
      welcomeMessage(context.preferredLanguage)
    );
    setMessages([welcome]);
    setAgentSuggestions([
      "I need a repair estimate",
      "Tell me about your spray painting services",
      "Can I get an update on my vehicle?",
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages]);

  const conversationHistory = useMemo(
    () => messages.filter((message) => message.role === "user").map((message) => message.content),
    [messages]
  );

  const handleAgentReply = (input: string) => {
    const agentMessage: AgentMessage = generateAgentResponse(input, context, conversationHistory);
    const reply = createMessage("assistant", agentMessage.reply);

    setMessages((prev) => [...prev, reply]);
    setContext(agentMessage.context);
    setAgentSuggestions(agentMessage.suggestions);
    setIsBusy(false);
  };

  const handleSend = (content: string) => {
    if (!content.trim() || isBusy) return;
    setIsBusy(true);
    const userMessage = createMessage("user", content);
    setMessages((prev) => [...prev, userMessage]);

    window.setTimeout(() => {
      handleAgentReply(content);
    }, 650);
  };

  const handleSelect = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-10 text-white sm:px-6 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <section className="flex w-full flex-col gap-6 rounded-3xl bg-white/10 p-8 shadow-2xl ring-1 ring-blue-900/40 backdrop-blur-lg lg:w-2/3">
          <header className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-100">
              De Jongh’s Panelbeating Centre
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Your trusted digital assistant for collision repair, resprays, and insurance support.
            </h1>
            <p className="max-w-2xl text-base text-blue-100/80">
              We&apos;re a family-run workshop in the Cape dedicated to honest advice, precision
              workmanship, and keeping you safely on the road.
            </p>
          </header>

          <div
            ref={viewportRef}
            className="flex h-[500px] flex-col gap-6 overflow-y-auto rounded-3xl bg-blue-950/40 p-6 shadow-inner ring-1 ring-blue-800/40"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isBusy && (
              <div className="flex w-full justify-start">
                <div className="flex items-center gap-3 rounded-2xl bg-white/30 px-5 py-3 text-sm text-white/80">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-white/80" />
                  Typing…
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <QuickActions onSelect={handleSelect} disabled={isBusy} />
            <ChatInput onSend={handleSend} isBusy={isBusy} suggestions={agentSuggestions} />
          </div>
        </section>

        <aside className="flex w-full flex-col gap-6 rounded-3xl border border-blue-900/40 bg-blue-950/40 p-8 shadow-lg backdrop-blur lg:w-1/3">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-blue-50">
              What our assistant can help with
            </h2>
            <ul className="space-y-2 text-sm text-blue-100/80">
              <li>• Detailed panel beating, dent removal, rust repair, and chassis alignment</li>
              <li>• Premium spray painting, colour matching, and polishing</li>
              <li>• Guided insurance claim assistance with regular updates</li>
              <li>• Booking consultations and on-site assessments</li>
              <li>• Friendly advice in English and Afrikaans</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-blue-500/20 p-5 text-sm text-blue-100/90 ring-1 ring-blue-400/30">
            <p className="font-semibold text-blue-50">Need to send photos?</p>
            <p className="mt-2">
              Attach images when replying to our follow-up email or WhatsApp. Clear, well-lit photos
              help us give accurate estimates faster.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-5 text-sm text-blue-100/90 ring-1 ring-blue-200/20">
            <p className="font-semibold text-blue-50">Workshop hours</p>
            <p className="mt-2">
              Monday to Friday: 7:30 – 17:30
              <br />
              Saturdays: By appointment
              <br />
              Sundays &amp; Public Holidays: Closed
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
