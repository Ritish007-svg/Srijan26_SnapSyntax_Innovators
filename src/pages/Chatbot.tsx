import { useEffect, useRef, useState } from "react";
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
import { searchFaq, suggestionsFor } from "@/lib/faqSearch";
import { HIERARCHY, getSubcategoryItems } from "@/lib/faqHierarchy";
import { ChevronDown } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
  chips?: string[];
  askResolution?: boolean;
};

type Reply = { content: string; chips?: string[]; resolved?: boolean };

// ---------- Smalltalk: greetings, thanks, yes/no, goodbyes ----------
function handleSmalltalk(raw: string): Reply | null {
  const q = raw.toLowerCase().trim().replace(/[!.?]+$/g, "");

  const greetings = ["hi", "hii", "hiii", "hello", "hey", "heyy", "yo", "namaste", "hola", "good morning", "good afternoon", "good evening"];
  if (greetings.includes(q) || /^(hi|hello|hey)\b/.test(q)) {
    return {
      content: "Hi there! 👋 I'm the VINS Assistant. Ask me anything about the internship — timelines, NOC, certificates, Rosetta, or anything else.",
      chips: ["What is VINS?", "When can I start?", "Do I need an NOC?"],
    };
  }

  const thanks = ["thanks", "thank you", "thanku", "thnx", "ty", "thx", "thank u", "much appreciated"];
  if (thanks.some((t) => q.includes(t))) {
    return {
      content: "You're welcome! 🌿 If anything else is unclear, just ask.",
      chips: ["Show me all topics", "When will I get the certificate?"],
    };
  }

  const okWords = ["ok", "okay", "k", "kk", "okie", "got it", "cool", "alright", "sure", "fine", "great", "nice", "awesome", "perfect", "understood", "noted", "hmm", "hmmm"];
  if (okWords.includes(q)) {
    return {
      content: "Got it 👍 Let me know if you have another question, or pick a topic from the sidebar.",
    };
  }

  if (/^(yes|yeah|yep|yup|ya|haan|y)$/.test(q) || q.includes("resolved") || q.includes("that helped") || q.includes("clear now")) {
    return {
      content: "Glad that helped! 🌱 Ask another question whenever you're ready, or close the chat — your call.",
      chips: ["When will I get the certificate?", "What is Rosetta?"],
    };
  }

  if (/^(no|nope|nah|not really|n)$/.test(q) || q.includes("not resolved") || q.includes("still confused") || q.includes("didn't help")) {
    return {
      content: "No worries — try rephrasing in your own words, or pick a related topic from the sidebar. If it's something specific to your case, drop a note to the Vicharanashala team.",
      chips: suggestionsFor(),
    };
  }

  const byes = ["bye", "goodbye", "see you", "cya", "later"];
  if (byes.some((b) => q === b || q.startsWith(b))) {
    return {
      content: "See you! 👋 All the best with VINS.",
    };
  }

  if (/^(who are you|what are you|what can you do|help)$/.test(q)) {
    return {
      content: "I'm the VINS Assistant — a helper for the Vicharanashala Internship FAQ. Ask me about start dates, NOC, the certificate, Rosetta, mentorship, or anything else listed in the sidebar.",
      chips: ["What is VINS?", "Show me all topics"],
    };
  }

  return null;
}

// ---------- Common-sense answers for predictable questions ----------
function handleCommonSense(raw: string): Reply | null {
  const q = raw.toLowerCase();

  // Meeting / call / zoom link
  if (
    (q.includes("meeting") || q.includes("zoom") || q.includes("google meet") || q.includes("call") || q.includes("interview link")) &&
    (q.includes("link") || q.includes("join") || q.includes("where") || q.includes("how"))
  ) {
    return {
      content:
        "Meeting links are shared over email by the Vicharanashala team — usually a short while before the scheduled time. Please check the inbox (and spam folder) of the email you applied with. If you still don't see it close to the meeting, reply to the most recent mail from the team.",
      chips: ["When will the interview happen?", "Whom should I contact?"],
      resolved: true,
    };
  }

  // Contact / email / reach out
  if (
    q.includes("contact") || q.includes("email id") || q.includes("reach out") || q.includes("whom to") || q.includes("whom should i") ||
    q.includes("how to contact") || q.includes("how do i contact") || q.includes("get in touch")
  ) {
    return {
      content:
        "For anything not covered here, write to the Vicharanashala team using the email thread you already have with them (e.g. your application/offer mail). They reply on email and through the official Yaksha chat — please avoid unofficial channels.",
      chips: ["What is Yaksha Chat?", "Show me all topics"],
      resolved: true,
    };
  }

  // Reply time / response time
  if ((q.includes("reply") || q.includes("respond") || q.includes("response")) && (q.includes("time") || q.includes("how long") || q.includes("when"))) {
    return {
      content:
        "The team typically responds within 1–2 working days. If something is urgent (e.g. interview today), reply on the latest email thread with a clear subject line so it gets surfaced quickly.",
      resolved: true,
    };
  }

  // Where is the application / form / portal
  if ((q.includes("apply") || q.includes("application") || q.includes("form")) && (q.includes("how") || q.includes("where") || q.includes("link"))) {
    return {
      content:
        "Application happens through the official Vicharanashala portal/form shared on their website and email. If you've already received a result email, the next steps (offer letter, NOC, onboarding) will all come through that same mail thread.",
      chips: ["What happens after selection?", "Do I need an NOC?"],
      resolved: true,
    };
  }

  // Generic time-of-day / date intent (today, tomorrow) without specific topic
  if (/^(today|tomorrow|now|tonight)\??$/.test(q.trim())) {
    return {
      content:
        "Could you give me a bit more context? For example: 'meeting today', 'interview tomorrow', 'start tomorrow'. That way I can point you to the right answer.",
    };
  }

  return null;
}



const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "About the internship": Info,
  "Timing and dates": Calendar,
  "NOC (No Objection Certificate)": FileCheck,
  "Selection, offer letter, and certificate": GraduationCap,
  "Work, mentorship, and projects": Sparkles,
  "Code of conduct — communication channels": Info,
  "Interviews Related": HelpCircle,
  "Certificate": Award,
  "Rosetta — your internship journal": BookOpen,
  "Phase 1 — coursework, Vibe LMS, and live sessions": GraduationCap,
  "Yaksha Chat Related": HelpCircle,
  "ViBe Platform": Sparkles,
  "Team Formation": Users,
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
    // 1. Smalltalk + common-sense intents
    const smalltalk = handleSmalltalk(query);
    if (smalltalk) return smalltalk;

    const common = handleCommonSense(query);
    if (common) return common;

    // 2. FAQ search
    const results = searchFaq(query, { category: activeCategory ?? undefined, topK: 3 });
    if (results.length === 0 || results[0].s < 2) {
      // try without category filter as a wider net
      const wider = activeCategory ? searchFaq(query, { topK: 3 }) : results;
      if (wider.length === 0 || wider[0].s < 2) {
        return {
          content:
            "I couldn't find that in the FAQ. Try rephrasing, or pick a topic from the sidebar. For anything outside the FAQ, write to the Vicharanashala team.",
          chips: suggestionsFor(activeCategory ?? undefined),
          resolved: false as const,
        };
      }
      const top = wider[0].item;
      const followups = wider
        .slice(1)
        .map((r) => r.item.question)
        .slice(0, 2);
      return { content: top.answer, chips: followups, resolved: true as const };
    }
    const top = results[0].item;
    const followups = results
      .slice(1)
      .map((r) => r.item.question)
      .concat(suggestionsFor(top.category, top.question))
      .filter((q, i, arr) => arr.indexOf(q) === i)
      .slice(0, 2);
    return { content: top.answer, chips: followups, resolved: true as const };
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
      const { content, chips, resolved } = answerQuery(trimmed);
      const botMsg: Message = {
        id: uid(),
        role: "bot",
        content,
        time: now(),
        chips,
        askResolution: resolved,
      };
      setMessages((m) => [...m, botMsg]);
      setIsTyping(false);
    }, 550);
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
    const all = getCategoryItems(cat);
    const items = getTopCategoryItems(cat, 5);
    const total = all.length;
    const intro = `**${cat}** — ${total} question${total > 1 ? "s" : ""} total. Tap one below or type your own.`;
    const botMsg: Message = {
      id: uid(),
      role: "bot",
      content: intro,
      time: now(),
      chips: items.map((it) => it.question),
      askResolution: false,
    };
    setMessages((m) => [...m, botMsg]);
  };

  const onStarterCard = (cat: string) => {
    onCategoryClick(cat);
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
            {message.askResolution && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-muted-foreground">Did this resolve your doubt?</span>
                <Chip text="Yes" onClick={() => onChip("Yes, that resolved it")} />
                <Chip text="No" onClick={() => onChip("No, still not clear")} />
              </div>
            )}
            {message.chips && message.chips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.askResolution && (
                  <span className="w-full text-[11px] text-muted-foreground -mb-1">Or try another question:</span>
                )}
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
