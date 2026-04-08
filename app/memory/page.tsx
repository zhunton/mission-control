"use client";

import { useState } from "react";
import { Search, BookOpen, Lightbulb, CheckCircle, MessageSquare } from "lucide-react";

interface Discussion {
  title: string;
  thingsToRemember: string[];
  recommendations: string[];
  decisions: string[];
}

interface MemoryEntry {
  id: string;
  date: string;
  title: string;
  discussions: Discussion[];
}

const ENTRIES: MemoryEntry[] = [
  {
    id: "12",
    date: "April 7, 2026",
    title: "Chuckl Takes Shape, App Lab Ships & Satellite HVAC Idea",
    discussions: [
      {
        title: "Cron Delivery Feedback — Fixed Immediately",
        thingsToRemember: [
          "Zach flagged at 10:51 PM that all 3 crons (morning brief, AI brief, quiz) were sending preamble messages before the actual content — fixed on the spot",
          "All 3 crons updated: morning brief, AI brief, quiz now start directly with content, no intro text before the delivery",
          "Quiz also adjusted: reduced from 6 long questions to shorter format — lesson first, then 3 targeted questions per session",
          "Zach's message was cut off mid-sentence on the quiz complaint — but the intent was clear enough to act on immediately",
        ],
        recommendations: [
          "Continue monitoring cron delivery quality — Zach notices when the format drifts; stay clean and direct",
          "The quiz reduction to 3 questions is a quality-of-life win; watch engagement/completion rates going forward",
        ],
        decisions: [
          "All 3 cron payloads updated: no more preamble, start directly with content",
          "Quiz format changed: lesson + 3 questions instead of 6 long standalone questions",
        ],
      },
      {
        title: "Idea Lab Critique & App Ideas Expansion",
        thingsToRemember: [
          "Zach called out that the Idea Lab ideas were too service-heavy and required too much of his ongoing time — not what he wanted",
          "He asked for underserved market app ideas that could generate passive or near-passive income — no high-maintenance service businesses",
          "Atlas ran parallel research threads on micro-SaaS and underserved app markets; 4 new ideas added to Idea Lab by deadline (8am)",
          "New Idea Lab entries: Field Service App for HVAC/Trade Contractors, Testimonial/Social Proof Tool, Job Profitability Calculator, Drop-off Analytics Dashboard for SMBs",
          "Wally flagged Field Service HVAC App as the top pick: insider knowledge moat, $75/month, 50 customers = $3,750 MRR; Patch can build the MVP",
          "Testimonial tool (idea #7) noted as a proven model — Senja.io at $1M+ ARR — could bundle with field service app",
        ],
        recommendations: [
          "Field Service HVAC App is the most defensible idea on the list — Zach's Hunton Group experience is a genuine moat no outside founder can replicate",
          "Start with a validated pain point conversation with 5-10 HVAC contractors before building — kill or confirm the idea in a week",
          "The Testimonial Tool is the easiest to build and has the clearest comps; consider it as a potential second bet if field service stalls",
        ],
        decisions: [
          "4 new app ideas added to Idea Lab — all weighted toward low-maintenance, subscription-based revenue models",
          "Idea Lab is for concepts only; App Lab (built same evening) is for apps actively in progress",
        ],
      },
      {
        title: "Chuckl — Product Concept Locked & Prototype v2 Built",
        thingsToRemember: [
          "Zach pitched Chuckl: a utility app for browsing and stashing reaction GIFs and images — inspired by how people hoard reactions across camera rolls, Discord, Telegram, etc.",
          "Original junior dev prototype had a full social Feed page and Profile page — explicitly cut after Wally pushback; Zach agreed",
          "Final concept: utility only — browse categories, search, stash, copy to clipboard. No feed, no followers, no social layer.",
          "Monetization: free tier (20-30 stash limit, conversion happens at limit) → $2.99/month unlimited",
          "Content sourcing: GIPHY API (free) as the base + curated approval-based library for premium-feel reactions",
          "Stack: React Native (faster for Patch than Swift native)",
          "Patch built prototype v2 with all social elements removed; deployed to Vercel; repo at /Users/wallybot/Projects/chuckl",
          "Outstanding for morning of April 8: gamification analysis + GIPHY differentiation strategy",
          "Zach asked that before shipping, Patch should test it, then make upgrades based on findings",
        ],
        recommendations: [
          "The stash-limit freemium model is the correct conversion hook — people hit the wall right when they're most engaged and have highest willingness to pay",
          "GIPHY differentiation is the real existential question: the answer is curation + UX, not content volume. GIPHY has everything; Chuckl should have the best reactions, organized for instant access.",
          "Gamification should be lightweight: stash streak (use the app 3 days in a row), reaction badges (your 'Happy' stash is on fire), unlock categories at milestones — not points/leaderboards",
          "React Native is the right call — faster to ship, Patch knows it, and it's a prototype; native Swift can come later if the idea validates",
        ],
        decisions: [
          "Social layer completely removed — utility-only product direction locked",
          "Prototype v2 built and deployed to Vercel by Patch",
          "App Lab entry created in Mission Control with full Chuckl breakdown",
          "Satellite HVAC lead tool discussion deferred to April 8",
        ],
      },
      {
        title: "Satellite Imagery HVAC Lead Detection Tool — Added to Backlog",
        thingsToRemember: [
          "Zach's idea: build software that uses satellite imagery + Google Maps API to detect cooling towers, RTUs, and commercial HVAC equipment on building rooftops",
          "The tool would identify buildings with aging or detectable equipment and generate qualified leads for HVAC service companies — especially Hunton Group",
          "First-mover advantage in a building's service contract is everything in this industry — catching a lead before a competitor does is the whole game",
          "If it works internally, could become a standalone SaaS product sold to other HVAC companies",
          "Added to tasks.json as task #12 (Zach-owned, protected backlog, high priority)",
          "Plan to discuss building further on April 8",
        ],
        recommendations: [
          "This idea has a real moat: Zach understands the HVAC sales cycle, what equipment looks like from above, and what a 'qualified lead' means in this industry — that domain knowledge is the secret weapon",
          "Start with a proof of concept using Google Maps Static API + a computer vision model (YOLO or similar) to detect circular cooling tower footprints and rectangular RTU shapes on rooftops",
          "The property data enrichment layer (owner contact info, building age) is what turns a detection into a lead — worth scoping that API piece early",
          "If validated, pricing to HVAC companies could be $500-2,000/month per territory — significantly higher ARR than consumer apps",
        ],
        decisions: [
          "Task added to backlog — Zach-owned, protected, high priority",
          "No build started yet — discussion and planning on April 8",
        ],
      },
      {
        title: "Daily AI Brief — April 7",
        thingsToRemember: [
          "Claude Opus 4.6 hits #1 on LMSYS Chatbot Arena, beating GPT-5.4 and Gemini 3.1 Pro in human preference evals; SWE-bench 65.3%; hybrid transformer + sparse MoE architecture",
          "GPT-5.4 gets major refresh: 40% fewer refusals, better multi-doc analysis; GPT-5.4 Mini nearly on par with full model at fraction of cost",
          "Gemini 3.1 Pro goes GA on Vertex AI with 2M context — full enterprise production readiness; full-book caching, native video understanding at 1fps, live web grounding",
          "DeepSeek R2 drops with 92.7% AIME 2025 and 89.4% MATH-500 — rivaling OpenAI o3, priced ~70% cheaper than comparable Western models; open-weight 32B distill also released; China cost efficiency gap widening",
          "Claude Mythos (Capybara) phased rollout officially begins — confirmed by Anthropic; 'dramatically better' at code/reasoning, 'far ahead of any AI in cyber capabilities'",
          "Llama 4 Scout: 17B vision-language model for edge deployment, runs on single 24GB GPU or M4 Pro — image, video, PDF inputs; open-source fully in the game",
        ],
        recommendations: [
          "DeepSeek R2 at 70% cheaper than Western models is the most structurally significant story — if it holds up, AI cost curves are about to inflect again",
          "Claude Mythos rollout is the capability story to watch — if cyber claims hold, enterprise security AI and agentic workflows will be in a different league",
          "Gemini GA on Vertex is quietly important for enterprise — Google is no longer the also-ran; Hunton Group's tech partners and data center clients may start evaluating Gemini seriously",
        ],
        decisions: [
          "No system changes — AI brief delivered as scheduled via cron",
        ],
      },
    ],
  },
  {
    id: "11",
    date: "April 6, 2026",
    title: "Quiz Feedback, Claude Mythos Confirmed & OpenAI IPO Wobbles",
    discussions: [
      {
        title: "Quiz Coaching — Zach's First Direct Feedback",
        thingsToRemember: [
          "Zach submitted quiz session 3 (April 5 HVAC answers) just before midnight — scored 85% (5/6); cooling towers + VFDs",
          "Running scores: 92%, 92%, 85% — HVAC trending up; financial math needs full work shown, not just conclusions",
          "Zach told Wally directly: 'Many of these seem repetitive. I want you to dig deeper into KPIs, new technical stuff not just cooling towers.'",
          "He wants harder HVAC: refrigeration cycle components, Trane-specific tech, compressor types — not surface-level definitions",
          "He wants harder finance: EBITDA, variance analysis, full P&L scenarios — partial credit not accepted going forward",
          "Quiz cron updated immediately after feedback",
        ],
        recommendations: [
          "Keep escalating difficulty week over week — Zach is progressing fast on HVAC fundamentals; the quiz should stay slightly ahead of him",
          "For finance questions, require full work shown (formulas + numbers) not just final answers — builds real fluency for CEO-level conversations",
          "Consider adding scenario-based operations questions tied to real Hunton Group situations",
        ],
        decisions: [
          "Quiz cron updated to harder questions — softballs eliminated",
          "Financial math now requires full work shown, not just conclusions",
        ],
      },
      {
        title: "Morning Brief — April 6",
        thingsToRemember: [
          "Iran did NOT reopen the Strait of Hormuz by Trump's Monday 10am ET hard deadline — conflict now officially dubbed 'Operation Epic Fury' (week 6); gas prices spiking domestically",
          "Trump fired AG Pam Bondi and replaced her with Deputy AG Todd Blanch",
          "CNN poll: 31% approve of Trump's economy handling — down from 39% in January",
          "Bloom Energy 2026 Data Center Power Report: AI compute demand is outpacing grid capacity; widening interconnection timelines driving demand for on-site power alternatives — direct tailwind for HT data center business",
          "Trump proposing $1.5T Pentagon budget ('Golden Dome' missile defense, subs, fighters) — largest defense spend proposal in U.S. history",
        ],
        recommendations: [
          "Bloom Energy report is the most actionable item for Hunton Group — grid capacity lag is a structural tailwind for HT's data center HVAC specialization; worth referencing in any business case or data center proposal",
          "Operation Epic Fury escalation means oil/commodity price pressure continues into Q2; Hunton procurement should be tracking refrigerant and equipment cost exposure",
        ],
        decisions: [
          "No system changes — morning brief delivered as scheduled",
        ],
      },
      {
        title: "Daily AI Brief — April 6",
        thingsToRemember: [
          "Claude Mythos officially confirmed — Anthropic acknowledged 'Capybara': a new model tier above Opus; internal testing says 'dramatically better' at code and reasoning; 'currently far ahead of any AI in cyber capabilities'; deliberate phased rollout underway",
          "OpenAI published an economic manifesto: robot taxes, public wealth funds, 4-day work week to offset AI displacement — policy paper timed ahead of midterms; part wishlist, part positioning",
          "OpenAI IPO in doubt: CFO Sarah Friar raised concerns about going public by late 2026 (rising server costs, slowing revenue growth, readiness); Brad Lightcap out as COO, Fidji Simo on medical leave — notable leadership churn at a pivotal moment",
          "Gemini 3.1 Pro leads 13/16 standard benchmarks; GPT-5.4, Grok 4.20, and Claude all within striking distance — frontier models are converging fast",
          "Anthropic pulling back from third-party platforms: Claude subscriptions no longer cover tools like OpenClaw — users must pay via API or bundles; suspected rationing ahead of Mythos rollout",
          "Q1 2026 VC: $300B into AI startups, up 150%+ YoY — Crunchbase called it 'unlike any quarter in history'",
        ],
        recommendations: [
          "Claude Mythos confirmation is the biggest structural AI story in weeks — if the cyber capabilities claim holds, it changes the threat model for enterprise security and the capability ceiling for agentic AI work",
          "OpenAI's leadership churn (COO out, CMO on leave, CFO pushing back on IPO) paired with Anthropic's Mythos rollout suggests the power balance at the frontier could shift faster than expected in Q2",
          "The Anthropic platform pullback (OpenClaw, etc.) is worth watching for Wally's own stack — may need API fallback or bundle arrangement to maintain capability access",
          "Gemini 3.1 Pro leading benchmarks is a real shift — Google is no longer trailing; enterprise AI tool choices may start factoring in Gemini as a primary option, not just a hedge",
        ],
        decisions: [
          "No system changes — AI brief delivered as scheduled via cron announce",
        ],
      },
    ],
  },
  {
    id: "10",
    date: "April 5, 2026",
    title: "Quiet Sunday — SpaceX Acquires xAI & Iran Escalation Hits Hard Deadline",
    discussions: [
      {
        title: "Automated Systems — All Crons Ran Clean",
        thingsToRemember: [
          "No direct Zach conversations on April 5 — quiet Sunday",
          "Morning brief, daily quiz, and AI market brief all ran and delivered via cron announce",
          "Telegram delivery routing through cron announce (no active main session at fire time) — expected behavior",
          "Midnight sync from April 4→5 ran clean with no errors",
        ],
        recommendations: [
          "Telegram delivery via cron announce is working but Zach doesn't see it in real-time — may be worth wiring a fallback direct message for critical briefs",
        ],
        decisions: [
          "No system changes — all automations nominal",
        ],
      },
      {
        title: "Morning Brief — April 5",
        thingsToRemember: [
          "Trump confirmed rescue of both F-15E crew members shot down over Iran — via special forces/CIA op; Iran reports 5 killed in rescue strikes",
          "Trump threatening to hit Iranian power plants by Tuesday unless Strait of Hormuz reopened by 10am ET Monday — hard deadline, not posturing",
          "Strait of Hormuz standoff: sustained closure means oil/power price spikes hitting commercial building operating costs and data center markets into Q2",
          "This is a direct Hunton Group exposure — HVAC equipment, refrigerants, and energy costs all downstream of oil/commodity chains",
        ],
        recommendations: [
          "If Strait of Hormuz remains closed past Monday, Hunton Group procurement should be watching refrigerant and commodity pricing closely — Q2 forecasts may need revision",
          "The Monday 10am ET deadline is real — Tuesday could see significant escalation; worth having visibility on any open big-ticket proposals that could be affected",
        ],
        decisions: [
          "No system changes — morning brief delivered as scheduled",
        ],
      },
      {
        title: "Daily AI Brief — April 5",
        thingsToRemember: [
          "SpaceX acquires xAI for $250B — biggest AI industry consolidation in history; Musk now controls rockets, satellites, Grok model, and Starlink data/compute pipeline",
          "Anthropic drops Claude Mythos 5 — world's first 10-trillion-parameter model; purpose-built for cybersecurity, research, and long-range multi-step planning; new frontier capability tier",
          "GPT-5.4 'Thinking' crosses the human threshold on OS-level tasks — 75% on OSWorld benchmark (up 27.7 pts from GPT-5.2); agentic desktop workflows are a production reality",
          "Google TurboQuant cuts inference memory 6x; Gemini 3.1 Flash-Lite is 2.5x faster than its predecessor — AI cost is approaching zero",
          "Utah gives AI a medical license — first state to let AI autonomously renew drug prescriptions; regulatory doors are cracking open",
          "OpenAI $122B round: shares almost impossible to move on secondary markets; Anthropic nearly oversubscribed — smart money has fully rotated to Anthropic",
          "Q1 2026: $297B into AI startups (consistent figure; up ~150% QoQ)",
        ],
        recommendations: [
          "SpaceX/xAI merger is the most significant structural shift in AI yet — Musk now has a vertically integrated AI+compute+satellite stack; watch how this changes Grok's capabilities and market position",
          "Claude Mythos 5 at 10T parameters is a real leap — if it delivers on long-range reasoning, it could displace GPT-5.4 as the default for complex agentic work (including Wally's own stack)",
          "AI cost dropping to near-zero via TurboQuant and similar advances will accelerate commoditization — the moat will increasingly be the product layer, not the model",
          "Utah AI medical licensing is a leading indicator — watch for other states to follow; opens a new vertical for AI-native health startups",
        ],
        decisions: [
          "No system changes — AI brief delivered as scheduled",
        ],
      },
    ],
  },
  {
    id: "9",
    date: "April 4, 2026",
    title: "Quiet Saturday — Llama 4 Closes the Gap & Iran Escalates",
    discussions: [
      {
        title: "Automated Systems — All Crons Ran Clean",
        thingsToRemember: [
          "No direct Zach conversations on April 4 — quiet Saturday",
          "Morning brief, daily quiz, and AI market brief all delivered successfully via Telegram",
          "Midnight sync from April 3→4 had errored (tasks.json write failure) — resolved in the April 4→5 sync",
          "No new tasks added or completed; no system changes",
        ],
        recommendations: [
          "The tasks.json write failure pattern has now happened twice — consider adding error recovery or a retry mechanism to the midnight sync cron",
        ],
        decisions: [
          "No changes made — all systems nominal by end of day",
        ],
      },
      {
        title: "Morning Brief — April 4",
        thingsToRemember: [
          "Iran shot down two U.S. military aircraft — the first planes downed since the conflict began five weeks ago; one crew member rescued, one still missing",
          "Trump called it 'It's war' but said the incidents won't affect Iran negotiations",
          "Iran conflict is squeezing global energy markets — oil prices elevated, regional energy infrastructure under threat; real Q2 operational variable for building systems and data center operators",
          "NASA Artemis II crew is nearly halfway to the moon — four astronauts aboard Orion in translunar transit after April 2 launch; first crewed lunar mission since 1972",
        ],
        recommendations: [
          "Sustained oil price pressure from the Iran conflict could hit HVAC equipment and refrigerant costs via commodity chains — worth tracking into Q2 procurement",
          "The Artemis II mission is a signal of renewed aerospace investment; could mean data center/compute demand from federal/space sector over the next 2-3 years",
        ],
        decisions: [
          "No system changes — morning brief delivered as scheduled",
        ],
      },
      {
        title: "Daily AI Brief — April 4",
        thingsToRemember: [
          "Llama 4 ships from Meta — now benchmark-competitive with GPT-5.4 and Gemini 3.1 Pro; open-source has officially closed the gap with closed frontier models",
          "OpenAI, Anthropic, and DeepMind all racing to ship self-improving research systems; Anthropic reports Claude writes ~90% of their internal code",
          "Investor sentiment has quietly shifted — OpenAI secondary market demand collapsing while Anthropic is nearly impossible to get into; the smart money has already moved",
          "GPT-5.5 'Spud' confirmed for Q2 — OpenAI maintaining faster release cadence than expected after shipping 5.3 and 5.4 in the same week",
          "Grok 4.20 introduces multi-agent architecture — orchestrator model coordinating fleets of specialized sub-agents; a potential new design paradigm for AI systems",
          "OpenAI planning to nearly double headcount in 2026 (~1,500+ hires) — aggressive productization push as IPO pressure mounts",
        ],
        recommendations: [
          "Llama 4 reaching frontier parity is a structural shift — open-source AI is now a viable alternative to OpenAI/Anthropic APIs for many use cases; could change the cost model for AI-powered tools",
          "The multi-agent orchestration pattern (Grok 4.20, Wally's own architecture) is becoming the norm — Mission Control's agent model is well-positioned relative to where the industry is heading",
          "OpenAI's collapsing secondary demand paired with Anthropic's scarcity is a signal — if Anthropic ships Claude Mythos (or equivalent), the power balance at the frontier could shift fast",
        ],
        decisions: [
          "No system changes — AI brief delivered as scheduled",
        ],
      },
    ],
  },
  {
    id: "8",
    date: "April 3, 2026",
    title: "Office Overhaul v2, Atlas Joins the Team & Idea Lab Ships",
    discussions: [
      {
        title: "Office Page — Full Rebuild (v2)",
        thingsToRemember: [
          "Patch rebuilt the Office page from scratch with a new SVG castle background and 128px SVG character sprites",
          "Agent positions are now coordinate-mapped to specific stations and tied to real task status (working/idle)",
          "Wally is hardcoded to always show as 'working' — never idle",
          "Round Table removed from the NPC random wandering cycle — reserved for deliberate use",
          "Coordinate mapping tool added temporarily to place agents precisely, then removed when done",
        ],
        recommendations: [
          "Now that positions are tied to task status, keeping tasks.json accurate matters more — it drives the visual state of the office",
          "Consider adding hover tooltips to sprites showing agent name + current task",
        ],
        decisions: [
          "Office page rebuilt with SVG background + 128px sprites — live and deployed",
          "Agent visual state tied to real task data (not random)",
          "Wally always-working behavior locked in by design",
        ],
      },
      {
        title: "Documents Tab — Improved",
        thingsToRemember: [
          "Markdown rendering now works properly in the Documents tab",
          "Download saves as clean .txt file",
          "PDF download added via browser print dialog",
          "Hunton genealogy document updated with accurate Compendium text",
        ],
        recommendations: [
          "Consider adding a document creation UI so Zach can add new docs directly from Mission Control without editing code",
        ],
        decisions: [
          "Documents tab improvements deployed — .txt download, PDF, markdown rendering all live",
        ],
      },
      {
        title: "New Agents: Iris NPC & Atlas (Research)",
        thingsToRemember: [
          "Iris added as an ambient NPC in the castle Office — decorative/environmental, not a task agent",
          "Atlas added as a Research Agent — has a profile photo, appears in the People page org chart, and is stationed in the Alchemy Room on the Office canvas",
          "Atlas represents a real research capability role — to be activated when Perplexity or similar is wired in",
        ],
        recommendations: [
          "When Atlas gets a real backend (Perplexity API), wire it to the Research Agent slot and add it to the task system",
        ],
        decisions: [
          "Atlas added to org chart and Office — placeholder until real research capability is connected",
          "Iris added as ambient NPC — no task role",
        ],
      },
      {
        title: "Idea Lab Tab — Ships",
        thingsToRemember: [
          "Idea Lab tab built and deployed late evening April 3 (~11:22 PM CDT)",
          "New tab in Mission Control for capturing and developing ideas",
        ],
        recommendations: [
          "Start populating Idea Lab with active ideas — it's only useful if used consistently",
        ],
        decisions: [
          "Idea Lab tab live and deployed to Vercel",
        ],
      },
      {
        title: "Daily AI Brief — April 3",
        thingsToRemember: [
          "AI brief delivered successfully at noon via Telegram ✅",
          "OpenAI's $122B round getting messy — institutional holders trying to offload ~$600M in shares, finding buyers 'almost impossible'; smart money quietly pivoting to Anthropic",
          "Q1 2026: $297B into ~6,000 AI startups globally — up 150%+ YoY, consistent with prior reporting",
          "US-Israel military campaign against Iran entering week 5; Iran retaliated with strike on Kuwaiti oil refinery — geopolitical risk elevated",
          "HVAC: April 2026 price increase list published by ACHR News",
          "Morning brief included Ryan Holiday quote: 'The obstacle in the path becomes the path'",
        ],
        recommendations: [
          "The HVAC price increase list is directly relevant — Hunton Group procurement and customer quoting will be affected; worth reviewing the ACHR News article in detail",
          "OpenAI round instability is a signal — if the smart money is moving to Anthropic, watch for Anthropic model/product announcements to accelerate",
          "Iran conflict and Kuwaiti oil refinery strike: if oil/energy disruption escalates, it could hit HVAC equipment costs via commodity prices",
        ],
        decisions: [
          "No system changes — all automated crons ran cleanly",
          "No direct Zach conversations; all activity was build notifications + automated brief delivery",
        ],
      },
    ],
  },
  {
    id: "7",
    date: "April 2, 2026",
    title: "Briefs Tab Ships & OpenAI Hits $852B",
    discussions: [
      {
        title: "Briefs Tab — Built and Live",
        thingsToRemember: [
          "No direct Zach conversations on April 2 — all activity was automated crons + one build completion",
          "Briefs tab built and deployed to Mission Control — displays the daily AI brief inside the app",
          "Task completed alongside noon brief delivery — Patch shipped, system confirmed live",
          "Briefs tab gives Zach a permanent record of daily AI news inside Mission Control",
        ],
        recommendations: [
          "Consider adding historical brief storage — right now only the latest brief shows; archiving past briefs would let Zach reference trends over time",
          "Could add a 'relevance to Hunton Group' tag per brief item to surface what's most actionable",
        ],
        decisions: [
          "Briefs tab shipped and deployed to Vercel — live and accessible",
          "Daily AI brief now lives both in Telegram (push) and Mission Control (pull)",
        ],
      },
      {
        title: "Daily AI Brief — April 2",
        thingsToRemember: [
          "AI brief delivered successfully at noon via Telegram ✅",
          "OpenAI closes $122B round at $852B valuation — largest private capital raise in history (surpasses the $110B April 1 figure; round grew during close)",
          "Q1 2026: $300B+ into AI startups, up 150%+ YoY — AI has essentially become the entire VC asset class",
          "Anthropic leaked Claude Code source — signing system cracked within 24 hours of public release; major security/IP incident",
          "Microsoft building own frontier models by 2027 — explicit move to reduce OpenAI dependency; partnership dynamics shifting at the top",
          "Meta unveils prescription AI smart glasses — consumer AI wearables moving into medical/accessibility territory",
          "Rebellions (South Korea) raises $400M pre-IPO — serious chip challenger to Nvidia emerging from Asia",
          "Oracle, Amazon, Meta all announced major AI-driven layoffs — ~25K at Oracle alone; same pattern as March; human labor being replaced with compute at scale",
        ],
        recommendations: [
          "The Oracle/Amazon/Meta layoff pattern is consistent with HT's data center trajectory — as hyperscalers replace headcount with infrastructure, HVAC demand for those data centers keeps climbing",
          "Microsoft's move to build own frontier models could fragment the AI ecosystem — worth watching whether enterprise AI tools start to diverge by platform (Microsoft vs. OpenAI vs. Anthropic)",
          "Rebellions chip challenge to Nvidia: if a credible alternative emerges, data center capex could shift — keep an eye on what Hunton's data center clients are speccing for cooling (Nvidia GPU density drives heat load)",
        ],
        decisions: [
          "AI brief format continues working well — no changes needed",
          "Systems ran cleanly all day with no intervention required",
        ],
      },
    ],
  },
  {
    id: "6",
    date: "April 1, 2026",
    title: "Coaching Tab Ships & Oracle Axes 30,000 Jobs",
    discussions: [
      {
        title: "Coaching Tab — Built and Live",
        thingsToRemember: [
          "No direct Zach conversations on April 1 — all activity was automated crons + one build completion",
          "At 11:47 PM CDT, system notification confirmed: Coaching tab built and live in Mission Control",
          "Coaching tab features: quiz session tracking, performance chart, category breakdowns, session history with expandable question review",
          "Task #10 completed — Patch delivered, Wally acknowledged via heartbeat",
          "Coaching tab purpose: track Zach's daily quiz performance, category strengths/weaknesses, learning progress over time",
        ],
        recommendations: [
          "Start using the Coaching tab to log quiz sessions — consistent data entry will surface meaningful trends over time",
          "Consider adding a streak tracker to the Coaching tab to make it habit-forming",
        ],
        decisions: [
          "Coaching tab shipped and deployed to Vercel — live and accessible",
          "Task #10 marked complete in tasks.json",
        ],
      },
      {
        title: "Daily AI Brief — April 1",
        thingsToRemember: [
          "AI brief delivered successfully at noon via Telegram ✅",
          "Oracle cut 30,000 jobs (~18% of global workforce) to fund AI data centers — largest layoff in Oracle's history; they are replacing people with infrastructure, not downsizing",
          "OpenAI's $110B funding round officially closed — Amazon, Microsoft, Nvidia, SoftBank + ~$3B from individual investors; largest private capital raise in history",
          "Q1 2026 broke every VC record: $297B invested globally into ~6,000 startups, up 150% QoQ and YoY — AI is the engine",
          "Anthropic vs OpenAI rivalry now theatrically aggressive — both dropped major models on the same day (Claude Opus 4.6 vs GPT-5.3-Codex); Anthropic reportedly ran TV commercials",
          "Anthropic 'Claude Mythos' leaked internally — an unannounced model with a potential new capability tier beyond Opus; no official confirmation from Anthropic",
          "April 1 caveat: brief included a note to treat outlandish announcements with extra skepticism",
        ],
        recommendations: [
          "Oracle's AI data center pivot is a direct signal for Hunton Group's HT division — data center HVAC demand will keep accelerating as companies like Oracle build out massive compute capacity",
          "The $297B Q1 VC figure suggests AI infrastructure investment is still early-innings; HT's data center specialization is well-timed",
          "Watch the Anthropic Claude Mythos situation — if a model significantly above Opus ships, it changes the capability ceiling for what AI can do autonomously",
        ],
        decisions: [
          "AI brief format continues working well — no changes needed",
          "Systems ran cleanly all day with no intervention required",
        ],
      },
    ],
  },
  {
    id: "5",
    date: "March 31, 2026",
    title: "Quiet Tuesday — AI Brief Closes Out a Wild Month",
    discussions: [
      {
        title: "Daily AI Brief — End of March Recap",
        thingsToRemember: [
          "No direct Zach conversations on March 31 — all activity was automated crons",
          "AI brief delivered successfully at noon via Telegram",
          "GPT-5.4 named model of the month: full family (Pro, mini, nano), 1M token context, native Excel add-in, 'nano' variant designed as a subagent delegate — a real architecture shift",
          "OpenAI raised $110B — biggest AI funding round ever, earmarked for inference infrastructure, not more training runs",
          "Google shipped Gemini 3.1 Flash Live — real-time voice model with built-in audio watermarking (deepfake defense baked in from day one)",
          "Arm launched 'Arm AGI CPU' — first data center chip built for running AI agents at rack scale; Meta is lead partner; Arm is no longer just a licensing business",
          "OpenAI killed Sora's API on March 24 with no explanation — video AI strategy clearly shifting",
          "MCP hit 97 million installs — the Model Context Protocol is now standard infrastructure, not experimental",
          "Nebius dropping $10B on a data center in Finland — Europe building sovereign AI compute rather than renting from AWS/Azure",
          "March 2026 bottom line: the AI race shifted from 'what can a model do' to 'who controls the infrastructure'",
        ],
        recommendations: [
          "GPT-5.4 nano's subagent delegation architecture is worth tracking — this pattern (orchestrator model spawning fast cheap subagents) is likely where agentic AI workflows are heading",
          "The infrastructure arms race (Nebius Finland, Arm AGI CPU, OpenAI $110B) is a signal for data center demand — directly relevant to Hunton Group's HT data center business",
        ],
        decisions: [
          "AI brief format continues working well — no changes needed",
          "Systems ran cleanly all day with no intervention required",
        ],
      },
    ],
  },
  {
    id: "4",
    date: "March 30, 2026",
    title: "Canvas Office, Task Persistence & Agent Cleanup",
    discussions: [
      {
        title: "Full Canvas Office Room Build",
        thingsToRemember: [
          "Zach asked to replace the background image + floating avatars with a fully coded canvas room",
          "Patch built the canvas overnight using AI-generated pixel art sprites from Dali for each agent",
          "Room has dedicated workstations per agent: Wizard Tower (Wally), The Forge (Patch), Alchemy Lab (Dali), Tavern (idle), Round Table (meetings), Scribe's Corner (docs)",
          "Agents walk between waypoints using pathfinding — proportional speed, 10s cycle, arrival-then-reroute behavior",
          "Wally built as SVG pixel art wizard with pointed hat, staff, robe, beard, walking animation",
        ],
        recommendations: [
          "As new agents are added, give each a dedicated waypoint and hand-coded or AI-generated sprite",
          "Consider adding click-to-navigate: click a zone, agent walks there on demand",
        ],
        decisions: [
          "Canvas is the permanent format for the Office page — no more background image",
          "Dali generates sprites when new agents need visuals",
          "Wally confirmed as QA — reviews all Patch builds before closing tasks and pinging Zach",
        ],
      },
      {
        title: "Task Persistence via JSON File",
        thingsToRemember: [
          "Tasks were previously stored in React useState — wiped on every new build or tab close",
          "Zach noticed his manually-added backlog tasks disappeared after overnight builds",
          "Patch implemented task persistence: all tasks now stored in /data/tasks.json in the repo",
          "API routes (GET/POST/PATCH/DELETE) handle read/write — tasks survive deploys and syncs",
          "Protection rule: tasks assigned to Zach or with status 'backlog' cannot be deleted by syncs — only status updates are allowed",
        ],
        recommendations: [
          "Daily memory sync should respect the protection rule and never wipe Zach's personal backlog items",
          "When adding future sync automation, always check task owner and status before modifying",
        ],
        decisions: [
          "Tasks are now persistent via JSON file — not lost on build or sync",
          "Backlog and Zach-owned tasks are protected from automated overwrites",
        ],
      },
      {
        title: "Org Chart & Agent Cleanup",
        thingsToRemember: [
          "Zach asked to remove filler agents (Research Agent, Dev Agent, Writing Agent) from the People page",
          "Active team is now: Zach (CEO), Wally (Director of Agents), Patch (Software Developer), Dali (Image Developer)",
          "Zach's rule: don't create agents until there's a real role and real work for them",
          "Future agents in consideration: Research (Perplexity API), Writing (Claude), Image Gen (already have Dali)",
        ],
        recommendations: [
          "Only spin up a new agent when there's a concrete task that justifies it — not as placeholders",
          "When ready, Perplexity API key takes ~5 min to set up for a Research Agent",
        ],
        decisions: [
          "People page now shows only active agents — no placeholders",
          "Agent creation philosophy: real problem first, then build the agent",
        ],
      },
      {
        title: "OpenClaw Update & AI Brief Delivery Fix",
        thingsToRemember: [
          "OpenClaw updated on the night of March 29 — brief network disruption caused noon brief to fail delivery",
          "Zach asked about the missing noon brief on March 30 — Wally identified the error and manually refired it",
          "March 30 brief highlights: OpenAI killed Sora (burned $15M/day, made $2.1M lifetime), March model avalanche (GPT-5.4, Gemini 3.1 Ultra, Grok 4.20, Mistral Small 4), MCP at 97M installs, OpenAI raised $110B",
          "OpenAI API key also wired into agent auth store for semantic memory search after update",
        ],
        recommendations: [
          "Add retry logic or a delivery confirmation check to the noon brief cron to catch failed sends",
        ],
        decisions: [
          "Manual refire is acceptable for one-off failures — monitoring delivery reliability going forward",
        ],
      },
    ],
  },
  {
    id: "3",
    date: "March 29, 2026",
    title: "Office Overhaul, Avatars & New Agents",
    discussions: [
      {
        title: "Pixel Art Avatars",
        thingsToRemember: [
          "Zach sent medieval pixel art avatars: Wally = wizard with staff, Zach = king with crown",
          "Avatars saved to workspace /avatars/ and Mission Control /public/",
          "Wally's Telegram bot photo updated manually via BotFather to the wizard avatar",
          "Initial render bug (broken placeholder text) fixed by Claude Code using standard <img> tags with onError handlers",
        ],
        recommendations: [
          "If new agents are added, create pixel art avatars to match the medieval theme for visual consistency",
        ],
        decisions: [
          "Wally identity locked in: name=Wally, emoji=🧙, avatar=wally-wizard.jpg",
          "Zach avatar saved as zach-king.jpg — available for use in Mission Control People page",
        ],
      },
      {
        title: "Office Page — Medieval Castle Canvas",
        thingsToRemember: [
          "Office page rebuilt as full canvas room with pathfinding — agents walk between locations",
          "Medieval zones: Wizard Tower (Wally), The Forge (Patch/builds), Alchemy Lab (Dali/research), Tavern (idle), Round Table (meetings), Scribe's Corner (docs)",
          "Wally has a pixel art SVG wizard sprite with walking animation",
          "AI-generated sprites used for other agents",
          "Claude Code session 'lucky-pine' built the medieval castle version",
        ],
        recommendations: [
          "As the team grows, add new agent waypoints to the Office canvas",
          "Consider adding click-to-navigate: click a zone, Wally walks there",
        ],
        decisions: [
          "Office page ships as canvas-based with pathfinding (not CSS-only)",
          "Medieval aesthetic chosen as the permanent Office theme",
        ],
      },
      {
        title: "New Agents: Patch & Dali",
        thingsToRemember: [
          "Patch = Software Dev Agent (orange) — owns Mission Control technical builds under Wally's direction",
          "Dali = Image Generation Agent — handles graphics, avatars, visual assets",
          "Both added to Office page, People page, and Tasks page",
          "Patch assigned to Task #7 (Mission Control ongoing improvements)",
        ],
        recommendations: [
          "Use Patch for future Mission Control feature requests to keep Wally focused on strategy",
          "Use Dali when Zach needs generated images, thumbnails, or visual brand assets",
        ],
        decisions: [
          "Agent roster formalized: Wally (strategy/orchestration), Patch (dev), Dali (image gen)",
        ],
      },
      {
        title: "Daily AI Brief — First Confirmed Run",
        thingsToRemember: [
          "Noon cron fired successfully on March 29 — first full Sunday brief delivered to Zach via Telegram",
          "Top story: Anthropic 'Claude Mythos' (codename Capybara) leaked from unsecured database — described as above Opus, with advanced cyber capabilities",
          "Other headlines: OpenAI 'Spud' finished pretraining March 25; Jensen Huang says AGI is already here; Perplexity on 1B Samsung devices; March was one of the busiest months in AI history",
        ],
        recommendations: [
          "Keep monitoring AI brief quality — adjust scope if Zach wants HVAC tech or data center industry news added",
        ],
        decisions: [
          "AI Daily Brief format confirmed: 5-7 bullets, no hype, most important story first, sign off as Wally 🧙",
        ],
      },
    ],
  },
  {
    id: "2",
    date: "March 28, 2026",
    title: "Automation, Memory Sync & Daily Routines",
    discussions: [
      {
        title: "Daily Midnight Memory Sync",
        thingsToRemember: [
          "Cron job runs at midnight every night to sync memory and Mission Control",
          "Isolated agent turn — reads session history, updates MEMORY.md, updates all Mission Control pages, commits and pushes both repos",
          "Delivery goes to Zach via Telegram so he gets a summary in the morning",
        ],
        recommendations: [
          "Add more context to memory files as Zach shares more about Hunton Group — better input = better strategic output",
          "Consider a weekly deeper review cron to prune and distill MEMORY.md",
        ],
        decisions: [
          "Daily memory sync cron established and running (midnight, America/Chicago)",
          "Task #4 (scrub fake data) confirmed complete via git commit 4e45f45",
          "Calendar 'isToday' fixed to use dynamic date instead of hardcoded March 28",
        ],
      },
      {
        title: "Daily AI Market Brief",
        thingsToRemember: [
          "Noon cron (America/Chicago) runs every day — Wally searches for top AI news and sends a brief to Zach via Telegram",
          "5-7 bullets max, no hype, lead with what actually matters",
          "First successful run confirmed March 28, 2026",
        ],
        recommendations: [
          "Expand brief scope if Zach wants: include HVAC tech news, energy sector, or data center industry",
        ],
        decisions: [
          "Daily AI Brief cron live and confirmed working",
        ],
      },
    ],
  },
  {
    id: "1",
    date: "March 28, 2026",
    title: "Day One — Wally comes online",
    discussions: [
      {
        title: "Identity & Setup",
        thingsToRemember: [
          "Zach Hunton, 26, Houston TX, married to Blair, schnoodle Dobby",
          "Wally is the AI assistant name — strategic right-hand man",
          "Strong opinions, brevity, humor, directness are the vibe",
        ],
        recommendations: [
          "Keep SOUL.md updated as preferences evolve",
        ],
        decisions: [
          "Established Wally identity, rewrote SOUL.md with Zach's personality rules",
        ],
      },
      {
        title: "The Hunton Group",
        thingsToRemember: [
          "4 companies: HT, HD, HS, CVZ — all HVAC Houston",
          "Zach in accelerated dev program at HS, future CEO track",
          "Data centers now huge profit driver for HT",
          "HS is the most complex — 5 divisions, 12+ teams",
          "Brett Lutz leads Special Projects/HEP, Stephen Ingram is Director of Operations",
        ],
        recommendations: [
          "Data center work needs its own playbook tracked separately from core business",
          "HEP catalog is a strong opportunity if product selection is right",
        ],
        decisions: [
          "Saved full Hunton Group business overview to memory/hunton-group.md",
        ],
      },
      {
        title: "Mission Control",
        thingsToRemember: [
          "Live at https://mission-control-five-red.vercel.app",
          "GitHub: github.com/zhunton/mission-control",
          "Next.js 15, TypeScript, Tailwind CSS",
          "Wally is Director of Agents — spins up sub-agents on demand, stays lean",
        ],
        recommendations: [
          "Build lean — complexity should earn its keep",
          "Wally pushes tasks into Mission Control directly from conversations",
        ],
        decisions: [
          "Built Mission Control as the central hub",
          "Deployed to Vercel for access from any device",
          "Agent architecture: Wally orchestrates, sub-agents spun up on demand",
        ],
      },
    ],
  },
];

const SUBSECTION_ICONS = {
  thingsToRemember: BookOpen,
  recommendations: Lightbulb,
  decisions: CheckCircle,
};

const SUBSECTION_COLORS = {
  thingsToRemember: "#8b5cf6",
  recommendations: "#f59e0b",
  decisions: "#22c55e",
};

const SUBSECTION_LABELS = {
  thingsToRemember: "Things to Remember",
  recommendations: "Recommendations",
  decisions: "Decisions Made",
};

export default function MemoryPage() {
  const [selectedEntry, setSelectedEntry] = useState<MemoryEntry>(ENTRIES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = ENTRIES.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "32px 32px 20px", borderBottom: "1px solid #1a1a1a" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>Memory</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Shared journal — conversations, decisions, and context</p>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Panel - Entry List */}
        <div
          style={{
            width: 280,
            borderRight: "1px solid #1a1a1a",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Search */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries..."
                style={{
                  width: "100%",
                  background: "#0f0f0f",
                  border: "1px solid #222",
                  borderRadius: 8,
                  padding: "7px 12px 7px 30px",
                  fontSize: 12,
                  color: "#e5e7eb",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Entry List */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
            {filteredEntries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 12px",
                  borderRadius: 8,
                  background: selectedEntry.id === entry.id ? "#1d2433" : "transparent",
                  border: selectedEntry.id === entry.id ? "1px solid #2a3a5a" : "1px solid transparent",
                  cursor: "pointer",
                  marginBottom: 4,
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: selectedEntry.id === entry.id ? "#e5e7eb" : "#9ca3af", marginBottom: 3, lineHeight: 1.4 }}>
                  {entry.title}
                </div>
                <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 6 }}>{entry.date}</div>
                <div style={{ fontSize: 10, color: "#374151" }}>
                  {entry.discussions.length} discussion{entry.discussions.length !== 1 ? "s" : ""}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Entry Detail */}
        <div style={{ flex: 1, overflow: "auto", padding: "28px 36px" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 6 }}>{selectedEntry.date}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{selectedEntry.title}</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {selectedEntry.discussions.map((discussion, di) => (
              <div key={di}>
                {/* Discussion Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#3b82f618",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MessageSquare size={14} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 2 }}>
                      Discussion {di + 1}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e5e7eb" }}>{discussion.title}</div>
                  </div>
                </div>

                {/* Sub-sections */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingLeft: 18, borderLeft: "2px solid #1e2a3a" }}>
                  {(["thingsToRemember", "recommendations", "decisions"] as const).map((key) => {
                    const items = discussion[key];
                    if (!items.length) return null;
                    const Icon = SUBSECTION_ICONS[key];
                    const color = SUBSECTION_COLORS[key];
                    return (
                      <div key={key}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: `${color}18`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon size={12} color={color} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {SUBSECTION_LABELS[key]}
                          </span>
                        </div>
                        <div
                          style={{
                            background: "#111",
                            border: "1px solid #1e1e1e",
                            borderLeft: `3px solid ${color}40`,
                            borderRadius: 10,
                            padding: "12px 16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          {items.map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                              <div
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: "50%",
                                  background: color,
                                  marginTop: 7,
                                  flexShrink: 0,
                                  opacity: 0.7,
                                }}
                              />
                              <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>{item}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
