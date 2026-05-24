import { allItems, type FaqItem } from "@/lib/faqSearch";

export type SubCategory = {
  name: string;
  // any keyword match (in question or answer, case-insensitive) puts a FAQ item in this sub
  keywords: string[];
  // optionally restrict to one or more existing main categories from faq.json
  fromMains?: string[];
};

export type MainCategory = {
  name: string;
  emoji: string;
  subs: SubCategory[];
};

export const HIERARCHY: MainCategory[] = [
  {
    name: "Getting Started",
    emoji: "🚀",
    subs: [
      { name: "About the Internship", keywords: ["what is vins", "what is the vicharanashala", "summership", "vled", "iit ropar", "about the internship"], fromMains: ["About the internship"] },
      { name: "Eligibility & Participation", keywords: ["eligible", "eligibility", "alumni", "currently-enrolled", "currently enrolled", "graduated", "who is the internship for"] },
      { name: "Joining the Program", keywords: ["join", "joining", "opt in", "opt-in", "how do i join", "onboard", "how to apply"] },
      { name: "Internship Modes", keywords: ["mode", "online", "offline", "remote", "in-person", "hybrid"] },
      { name: "Internship Structure", keywords: ["phase", "bronze", "silver", "gold", "platinum", "structure", "badge"] },
      { name: "Orientation & Kickoff", keywords: ["orientation", "kickoff", "kick-off", "first day", "induction", "welcome session"] },
      { name: "General Expectations", keywords: ["expectation", "hours", "commitment", "full-attention", "full attention", "what is expected"] },
    ],
  },
  {
    name: "Dates, Leave & Scheduling",
    emoji: "📅",
    subs: [
      { name: "Internship Dates", keywords: ["start date", "end date", "when can i start", "how long", "duration", "cohort", "december 2026", "may", "june", "july"], fromMains: ["Timing and dates"] },
      { name: "Exam Conflicts", keywords: ["exam", "exams", "semester exam", "college exam", "test"] },
      { name: "Leaves & Relaxations", keywords: ["leave", "relaxation", "exemption", "break", "off day", "holiday"] },
      { name: "Changing Internship Dates", keywords: ["change date", "change start", "postpone", "defer", "reschedule"] },
      { name: "Daily Scheduling", keywords: ["daily", "schedule", "working hours", "per day", "timings"] },
      { name: "Notifications & Updates", keywords: ["notification", "update", "announcement", "reminder"] },
      { name: "Attendance & Participation", keywords: ["attendance", "participation", "55-day", "continuous", "present"] },
    ],
  },
  {
    name: "NOC & Documentation",
    emoji: "📄",
    subs: [
      { name: "NOC Basics", keywords: ["what is noc", "do i need an noc", "noc required", "why noc"], fromMains: ["NOC (No Objection Certificate)"] },
      { name: "Filling the NOC", keywords: ["fill", "dates on the noc", "what dates", "format", "blank noc", "download"], fromMains: ["NOC (No Objection Certificate)"] },
      { name: "Signing Authority", keywords: ["sign", "signing", "hod", "principal", "dean", "director", "authority", "signatory"], fromMains: ["NOC (No Objection Certificate)"] },
      { name: "Submission Process", keywords: ["submit", "upload", "submission", "deadline"], fromMains: ["NOC (No Objection Certificate)"] },
      { name: "NOC Problems", keywords: ["problem", "issue", "rejected", "refuse", "can't get", "cannot get", "won't sign", "denied"], fromMains: ["NOC (No Objection Certificate)"] },
      { name: "Alternative Documents", keywords: ["alternative", "email-forward", "email forward", "instead of", "other document"], fromMains: ["NOC (No Objection Certificate)"] },
      { name: "Technical Submission Issues", keywords: ["upload error", "pdf", "file size", "technical issue", "can't upload", "cannot upload", "not uploading"], fromMains: ["NOC (No Objection Certificate)"] },
    ],
  },
  {
    name: "Offer Letter, Selection & Certification",
    emoji: "🏅",
    subs: [
      { name: "Selection Process", keywords: ["selection", "selected", "result", "shortlist", "interview"], fromMains: ["Selection, offer letter, and certificate", "Interviews Related"] },
      { name: "Offer Letter", keywords: ["offer letter", "offer", "appointment letter"], fromMains: ["Selection, offer letter, and certificate"] },
      { name: "Withdrawal & Reversal", keywords: ["withdraw", "withdrawal", "reversal", "cancel", "decline", "opt out"], fromMains: ["Selection, offer letter, and certificate"] },
      { name: "Internship Confirmation", keywords: ["confirmation", "confirm", "yellow panel", "samagama", "dashboard"], fromMains: ["Selection, offer letter, and certificate"] },
      { name: "Certificates", keywords: ["certificate", "certification", "completion certificate"], fromMains: ["Certificate", "Selection, offer letter, and certificate"] },
      { name: "Academic Credit", keywords: ["credit", "academic credit", "college credit", "transferable"] },
      { name: "Communication After Selection", keywords: ["after selection", "next step", "what happens next", "post selection"] },
    ],
  },
  {
    name: "Learning, Projects & Mentorship",
    emoji: "💻",
    subs: [
      { name: "Projects", keywords: ["project", "open-source", "open source", "contribution", "repo"], fromMains: ["Work, mentorship, and projects"] },
      { name: "Mentorship", keywords: ["mentor", "mentorship", "guide", "ta ", "teaching assistant"], fromMains: ["Work, mentorship, and projects"] },
      { name: "Work Expectations", keywords: ["work expectation", "hours a day", "how much work", "deliverable"] },
      { name: "Technical Setup", keywords: ["setup", "install", "environment", "git", "github", "vs code", "laptop"] },
      { name: "Learning Path", keywords: ["learning path", "syllabus", "curriculum", "what will i learn", "topics covered"] },
      { name: "Internship Outcomes", keywords: ["outcome", "what do i get", "benefit", "skill gained"] },
      { name: "Support & Escalation", keywords: ["support", "escalate", "stuck", "help", "blocked"] },
    ],
  },
  {
    name: "ViBe Platform & Coursework",
    emoji: "🎓",
    subs: [
      { name: "Access & Login", keywords: ["login", "log in", "access", "password", "sign in", "credentials"], fromMains: ["ViBe Platform", "Phase 1 — coursework, Vibe LMS, and live sessions"] },
      { name: "Learning Experience", keywords: ["course", "lecture", "video", "module", "lesson", "learning"], fromMains: ["ViBe Platform", "Phase 1 — coursework, Vibe LMS, and live sessions"] },
      { name: "Quiz & Evaluation", keywords: ["quiz", "test", "evaluation", "assessment", "exam on vibe", "score"], fromMains: ["ViBe Platform"] },
      { name: "Technical Issues", keywords: ["bug", "error", "not working", "crash", "loading", "technical"], fromMains: ["ViBe Platform"] },
      { name: "Proctoring & Monitoring", keywords: ["proctor", "monitoring", "camera", "webcam", "anti-cheat"], fromMains: ["ViBe Platform"] },
      { name: "Study Best Practices", keywords: ["best practice", "study tip", "how to study", "preparation"] },
      { name: "Rules & Penalties", keywords: ["rule", "penalty", "violation", "ban", "disqualif"], fromMains: ["ViBe Platform"] },
      { name: "Exceptions & Complaints", keywords: ["exception", "complaint", "grievance", "appeal"] },
    ],
  },
  {
    name: "Teams, Collaboration & Communication",
    emoji: "👥",
    subs: [
      { name: "Team Formation", keywords: ["form a team", "team formation", "create team", "join team", "find team"], fromMains: ["Team Formation"] },
      { name: "Team Changes", keywords: ["change team", "switch team", "leave team", "new team"], fromMains: ["Team Formation"] },
      { name: "Team Issues", keywords: ["team issue", "team problem", "conflict", "inactive member", "team mate"], fromMains: ["Team Formation"] },
      { name: "Team Logistics", keywords: ["team size", "team meeting", "team logistics", "members"], fromMains: ["Team Formation"] },
      { name: "Project Allocation", keywords: ["allocation", "allocated", "assigned project", "project assignment"], fromMains: ["Team Formation"] },
      { name: "Communication Channels", keywords: ["yaksha", "chat", "channel", "email", "communication", "discord", "slack"], fromMains: ["Yaksha Chat Related", "Code of conduct — communication channels"] },
      { name: "Mentor & Coordination", keywords: ["coordinator", "coordination", "mentor contact", "point of contact"] },
    ],
  },
  {
    name: "Rosetta, Journals & Reflection",
    emoji: "📘",
    subs: [
      { name: "About Rosetta", keywords: ["what is rosetta", "about rosetta", "rosetta is"], fromMains: ["Rosetta — your internship journal"] },
      { name: "Daily Usage", keywords: ["daily", "every day", "use rosetta", "fill rosetta"], fromMains: ["Rosetta — your internship journal"] },
      { name: "Rules & Integrity", keywords: ["rule", "integrity", "honest", "plagiar", "copy"], fromMains: ["Rosetta — your internship journal"] },
      { name: "Review & Evaluation", keywords: ["review", "evaluation", "graded", "feedback"], fromMains: ["Rosetta — your internship journal"] },
      { name: "Submission", keywords: ["submit", "submission", "deadline"], fromMains: ["Rosetta — your internship journal"] },
      { name: "Extra Support", keywords: ["extra support", "help with rosetta", "stuck on rosetta"], fromMains: ["Rosetta — your internship journal"] },
    ],
  },
];

export function getSubcategoryItems(main: string, sub: string): FaqItem[] {
  const m = HIERARCHY.find((x) => x.name === main);
  if (!m) return [];
  const s = m.subs.find((x) => x.name === sub);
  if (!s) return [];
  const pool = s.fromMains?.length
    ? allItems.filter((i) => s.fromMains!.includes(i.category))
    : allItems;
  const kws = s.keywords.map((k) => k.toLowerCase());
  const matched = pool.filter((i) => {
    const hay = (i.question + " " + i.answer).toLowerCase();
    return kws.some((k) => hay.includes(k));
  });
  // De-dupe by question
  const seen = new Set<string>();
  const unique: FaqItem[] = [];
  for (const it of matched) {
    if (!seen.has(it.question)) {
      seen.add(it.question);
      unique.push(it);
    }
  }
  return unique;
}
