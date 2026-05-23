import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  FileCheck,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { categories, searchFaq, suggestionsFor, getStarterQuestion } from "@/lib/faqSearch";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
  chips?: string[];
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "About the internship": Info,
  "Timing and dates": Calendar,
  "NOC": FileCheck,
  "Selection and offer letter": GraduationCap,
  "Certificate": Award,
  "Rosetta Journal": BookOpen,
  "Teams": Users,
};

const iconFor = (cat: string) => categoryIcons[cat] ?? HelpCircle;

const now = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const uid = () => Math.random().toString(36).slice(2, 10);

const WELCOME_CHIPS = [
  "What is VINS?",
  "When can I start?",
  "Do I need an NOC?",
  "When will I get my certificate?",
];

export default function Chatbot() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const breadcrumb = activeCategory ?? "Home";

  const answerQuery = (query: string) => {
    const results = searchFaq(query, { category: activeCategory ?? undefined, topK: 3 });
    if (results.length === 0 || results[0].s < 2) {
      return {
        content:
          "I couldn't find a confident answer in the FAQ. Try rephrasing, or pick a topic from the sidebar. For anything outside the FAQ, please write to the Vicharanashala team.",
        chips: suggestionsFor(activeCategory ?? undefined),
      };
    }
    const top = results[0].item;
    const followups = results
      .slice(1)
      .map((r) => r.item.question)
      .concat(suggestionsFor(top.category, top.question))
      .filter((q, i, arr) => arr.indexOf(q) === i)
      .slice(0, 3);
    return { content: top.answer, chips: followups };
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: trimmed,
      time: now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const { content, chips } = answerQuery(trimmed);
      const botMsg: Message = {
        id: uid(),
        role: "bot",
        content,
        time: now(),
        chips,
      };
      setMessages((m) => [...m, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const onCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setSidebarOpen(false);
    if (messages.length === 0) {
      const q = getStarterQuestion(cat);
      setInput(q);
      inputRef.current?.focus();
    }
  };

  const onStarterCard = (cat: string) => {
    setActiveCategory(cat);
    const q = getStarterQuestion(cat);
    send(q);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-full w-[260px] bg-sidebar-bg border-r border-divider flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 flex items-center gap-3 border-b border-divider">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
            V
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[16px] font-semibold truncate">Vicharanashala</span>
            <span className="text-[12px] text-muted-foreground">VINS Assistant</span>
          </div>
          <button
            className="md:hidden ml-auto text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
          <button
            onClick={() => {
              setActiveCategory(null);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors border-l-[3px] ${
              activeCategory === null
                ? "bg-teal-50 border-primary text-accent-teal"
                : "border-transparent text-foreground hover:bg-[hsl(var(--sidebar-bg))] hover:brightness-95"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            All topics
          </button>
          {categories.map((cat) => {
            const Icon = iconFor(cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryClick(cat)}
                className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors border-l-[3px] ${
                  isActive
                    ? "bg-teal-50 border-primary text-accent-teal"
                    : "border-transparent text-foreground hover:bg-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{cat}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-divider text-[11px] text-muted-foreground">
          Powered by Vicharanashala · IIT Ropar
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center px-4 md:px-6 border-b border-divider bg-white">
          <button
            className="md:hidden mr-3 text-foreground"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <span className="font-medium text-foreground">VINS Assistant</span>
            <span>›</span>
            <span>{breadcrumb}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[12px] text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Online
          </div>
        </header>

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6"
        >
          {messages.length === 0 ? (
            <WelcomeState onStarter={onStarterCard} onChip={(q) => send(q)} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} onChip={(q) => send(q)} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-divider bg-white px-4 md:px-8 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white border-[1.5px] border-teal-200 rounded-full px-4 py-1.5 focus-within:border-primary focus-within:shadow-[0_0_0_3px_hsl(var(--teal-50))] transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask anything about VINS…"
                  className="flex-1 resize-none bg-transparent outline-none text-[14px] py-1.5 max-h-32"
                />
              </div>
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all active:scale-95 ${
                  input.trim()
                    ? "bg-primary hover:bg-accent"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground text-center">
              Press Enter to send · Shift+Enter for new line
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({
  message,
  onChip,
}: {
  message: Message;
  onChip: (q: string) => void;
}) {
  const isBot = message.role === "bot";
  if (isBot) {
    return (
      <div className="animate-message-in">
        <div className="text-[11px] text-accent-teal/80 mb-1 ml-10">
          Vicharanashala Bot
        </div>
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-bold shrink-0">
            V
          </div>
          <div className="max-w-[75%]">
            <div
              className="bg-teal-25 border border-teal-200 px-4 py-3 text-[14px] leading-[1.7] whitespace-pre-wrap"
              style={{ borderRadius: "4px 16px 16px 16px" }}
            >
              {message.content}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{message.time}</div>
            {message.chips && message.chips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.chips.map((c, i) => (
                  <Chip key={c} text={c} onClick={() => onChip(c)} delay={i * 50} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="animate-message-in flex flex-col items-end">
      <div className="text-[11px] text-muted-foreground mb-1 mr-1">You</div>
      <div
        className="bg-primary text-white max-w-[65%] px-4 py-2.5 text-[14px] leading-[1.6]"
        style={{ borderRadius: "16px 4px 16px 16px" }}
      >
        {message.content}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1 mr-1">{message.time}</div>
    </div>
  );
}

function Chip({
  text,
  onClick,
  delay = 0,
}: {
  text: string;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="animate-chip-in inline-flex items-center gap-1.5 rounded-full bg-white border-[1.5px] border-primary text-accent-teal text-[12px] px-3 py-1.5 hover:bg-primary hover:text-white transition-colors duration-150"
      style={{ animationDelay: `${delay}ms` }}
    >
      <ArrowRight className="w-3 h-3" />
      {text}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="animate-message-in flex items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-bold shrink-0">
        V
      </div>
      <div
        className="bg-teal-25 border border-teal-200 px-4 py-3 flex items-center gap-1.5"
        style={{ borderRadius: "4px 16px 16px 16px" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary dot-bounce" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-primary dot-bounce"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-primary dot-bounce"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  );
}

function WelcomeState({
  onStarter,
  onChip,
}: {
  onStarter: (cat: string) => void;
  onChip: (q: string) => void;
}) {
  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 text-center">
      <div className="text-4xl mb-3">👋</div>
      <h1 className="text-[20px] font-semibold mb-1">Hi, I'm the VINS Assistant</h1>
      <p className="text-[14px] text-muted-foreground max-w-md mx-auto">
        Ask me anything about the Vicharanashala internship — NOC, timelines,
        certificates, Rosetta, and more.
      </p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const Icon = iconFor(cat);
          return (
            <button
              key={cat}
              onClick={() => onStarter(cat)}
              className="group bg-white border border-divider rounded-xl p-4 text-left hover:border-primary hover:shadow-sm transition-all"
            >
              <Icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-[13px] font-medium">{cat}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="text-[12px] text-muted-foreground mb-3">Try asking</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {WELCOME_CHIPS.map((c, i) => (
            <Chip key={c} text={c} onClick={() => onChip(c)} delay={i * 60} />
          ))}
        </div>
      </div>
    </div>
  );
}
