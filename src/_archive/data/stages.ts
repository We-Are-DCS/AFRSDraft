import type { Stage } from './types';

export const stagesData: Record<string, Stage[]> = {
  james: [
    {
      id: 1, name: 'Attract', shortName: 'Attract', phase: 1,
      phaseLabel: 'Phase 1: Attract & Engage',
      description: 'CDH NBA Designer fires lookalike audience match for the TikTok creative (rural NW Eng / 18-25 / male/trades). Adaptive model returns 82% REME propensity.',
      pegaCapabilities: [
        { name: 'CDH NBA Designer', detail: 'Strategy ARMY_REME_ATTRACT — lookalike audience arbitration' },
        { name: 'Adaptive Models', detail: 'Propensity model: 73% → 94% over 2 days' },
        { name: 'Channel Orchestration', detail: 'TikTok channel selected; pVal £1,820 winner' },
      ],
      candidateSees: 'Watches REME TikTok ad in his feed; taps profile link. Lands on Army.mod.uk — personalised hero "REME — engineer the Army." Takes REME skills quiz and scores 9/10.',
      nbaDecisions: [
        { action: 'Serve REME peer-testimonial creative', channel: 'TikTok', propensity: 82, treatment: 'army-reme-tt-005', auditRef: 'ATRS-2026-001' },
        { action: 'Fire AFCO physical visit invitation', channel: 'SMS', propensity: 94, treatment: 'army-afco-sms-carlisle', auditRef: 'ATRS-2026-002' },
      ],
      status: 'done', dayRange: 'Day 1', outcome: 'Match · 82%',
    },
    {
      id: 2, name: 'Inform & Engage', shortName: 'Engage', phase: 1,
      phaseLabel: 'Phase 1: Attract & Engage',
      description: 'Real-Time Container activates in <200ms on click-through. Cookie binds to candidate profile. Personalised hero content served. Skills quiz streams each answer as CDH signal.',
      pegaCapabilities: [
        { name: 'Real-Time Container', detail: '<200ms activation; cookie → candidate profile bind' },
        { name: 'Treatment Library', detail: 'REME hero content; salary calculator widget; role match badge' },
        { name: 'Engagement Policies', detail: 'Eligible · Consented · No fatigue · PASS' },
        { name: 'Pega Engagement Widget', detail: 'Native skills quiz — each answer streams to CDH adaptive model' },
      ],
      candidateSees: 'Personalised hero: "REME — engineer the Army." Role match badge 82%. Salary calculator (Year 1: £19k → Year 3: £25k+). 10-question REME skills quiz. Scores 9/10 — top 12%.',
      nbaDecisions: [
        { action: 'Serve personalised hero content', channel: 'Web', propensity: 87, treatment: 'reme-hero-v3-trades', auditRef: 'ATRS-2026-003' },
        { action: 'Surface AFCO Carlisle booking CTA', channel: 'Web', propensity: 94, treatment: 'afco-book-carlisle-cta', auditRef: 'ATRS-2026-004' },
      ],
      status: 'done', dayRange: 'Days 1–2', outcome: 'Propensity · 94%',
    },
    {
      id: 3, name: 'Apply', shortName: 'Apply', phase: 2,
      phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'Single application initiated at AFCO Carlisle on the recruiter\'s Pega NBA Advisor desktop. James\'s full prior context (TikTok → quiz → salary search) is pre-loaded. Service routing: Army (REME). Merit ranking: 7 of 32.',
      pegaCapabilities: [
        { name: 'Pega Application', detail: 'Single profile across candidate portal and advisor desktop' },
        { name: 'Single Profile', detail: 'TikTok engagement · web behaviour · quiz 9/10 · salary search — all pre-loaded at AFCO' },
        { name: 'Service Routing', detail: 'Army set from quiz; REME Vehicle Mech preference confirmed' },
        { name: 'NBA Advisor Desktop', detail: 'Recruiter sees same profile; merit ranking 7/32 in cohort' },
      ],
      candidateSees: 'Books AFCO Carlisle — Tue 13 May · 09:30. Single application — Step 1 of 7. Document checklist: photo ID, proof of address, NI number, GCSE certs. "Your next best step: Start fitness prep."',
      nbaDecisions: [
        { action: 'Pre-load recruiter advisor with candidate context', channel: 'Advisor Desktop', propensity: 96, treatment: 'advisor-context-preload', auditRef: 'ATRS-2026-005' },
        { action: 'Surface fitness-prep NBA card', channel: 'Portal', propensity: 91, treatment: 'fitness-prep-nudge-d7', auditRef: 'ATRS-2026-006' },
      ],
      status: 'done', dayRange: 'Day 7', outcome: 'App started',
    },
    {
      id: 4, name: 'Medical Q.', shortName: 'Med Q', phase: 2,
      phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'CDH personalises medical-history Q-order based on cohort outcome data — the ordering that produces highest first-time completion given James\'s profile. 28 questions. Auto-flag: cleared.',
      pegaCapabilities: [
        { name: 'Pega Forms', detail: 'Save-as-you-go; 23 of 28 questions auto-saved on exit' },
        { name: 'Personalised Q-order', detail: 'CDH cohort model sets optimal question sequence' },
        { name: 'Re-engage on Abandon', detail: 'SMS re-engagement queued if 24h silence detected' },
      ],
      candidateSees: 'Medical history — Step 4 of 7. "Personalised for you — 9 in 10 candidates find this order helpful." Adaptive Q-order. Saves as you go — 23 of 28 questions answered.',
      nbaDecisions: [
        { action: 'Apply personalised Q-order for trades cohort', channel: 'Portal Form', propensity: 88, treatment: 'med-q-order-trades-rural', auditRef: 'ATRS-2026-007' },
        { action: 'Queue re-engage SMS if 24h no activity', channel: 'SMS standby', propensity: 72, treatment: 'med-abandon-reengagement', auditRef: 'ATRS-2026-008' },
      ],
      status: 'done', dayRange: 'Day 7', outcome: 'Submitted',
    },
    {
      id: 5, name: 'Pre-rec Interview', shortName: 'Pre-rec', phase: 2,
      phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'Pre-recorded behavioural interview captured natively in Pega — secure, async, reviewable. 5 scenarios captured. FairAI scoring: 0.93 (PASS). ATRS-recorded for transparency.',
      pegaCapabilities: [
        { name: 'Video Capture Flow', detail: '5 behavioural scenarios; 2 min per question, 2 takes allowed' },
        { name: 'Async Assessment', detail: 'Avg response 1m 48s; awaiting assessor review (24h SLA)' },
        { name: 'AI Scoring (FairAI)', detail: 'Constellation FairAI add-on; disparity ratio 0.91 PASS' },
      ],
      candidateSees: 'Pre-recorded interview — Step 5 of 7. Question 3 of 5: "Tell us about a time when you fixed a problem under time pressure." Camera preview live. 2 minutes · up to 2 takes.',
      nbaDecisions: [
        { action: 'Score with FairAI — explainable assessment', channel: 'AI Engine', propensity: 93, treatment: 'fair-ai-score-trades-cohort', auditRef: 'ATRS-2026-009' },
        { action: 'Notify assessor: 24h SLA review queue', channel: 'Caseworker Task', propensity: 100, treatment: 'assessor-queue-trigger', auditRef: 'ATRS-2026-010' },
      ],
      status: 'done', dayRange: 'Day 8', outcome: 'Submitted',
    },
    {
      id: 6, name: 'Medical Assess.', shortName: 'Med Assess', phase: 3,
      phaseLabel: 'Phase 3: Vetting & Medical',
      description: 'Optima Health tri-Service medical assessment. Pega Case Mgmt routes James to nearest Optima clinic (Newcastle) based on postcode. Travel reimbursement auto-arranged (sub-£100 rule).',
      pegaCapabilities: [
        { name: 'Optima Health API', detail: 'Booking, prep checklist, results integration' },
        { name: 'Pega Case Mgmt', detail: 'Routes to Optima Newcastle; 50-min drive from Carlisle CA1' },
        { name: 'Tri-Service Routing', detail: 'Army standard; eyesight test prep video from Pega Knowledge' },
        { name: 'Travel Automation', detail: 'Train pre-booked; mileage 92mi @ £0.45 — sub-£100 auto-approved' },
      ],
      candidateSees: 'Optima Health — Mon 19 May · 10:00 · Optima Newcastle. Prep checklist: photo ID, light breakfast only, no alcohol 24h, eyesight test prep video. Travel: train pre-booked Carlisle → Newcastle.',
      nbaDecisions: [
        { action: 'Route to Optima Newcastle (nearest to CA1)', channel: 'Case Routing', propensity: 100, treatment: 'optima-routing-postcode', auditRef: 'ATRS-2026-011' },
        { action: 'Send eyesight test prep video nudge', channel: 'Push', propensity: 71, treatment: 'med-prep-video-push', auditRef: 'ATRS-2026-012' },
      ],
      status: 'done', dayRange: 'Day 12', outcome: 'Cleared',
    },
    {
      id: 7, name: 'Vetting', shortName: 'Vetting', phase: 3,
      phaseLabel: 'Phase 3: Vetting & Medical',
      description: 'BPSS clearance workflow. Runs in parallel with Stage 6. Candidate sees transparency-of-process status timeline without exposing personal-data flows. Reference check 1 in progress.',
      pegaCapabilities: [
        { name: 'BPSS/SC Workflow', detail: 'Sub-cases for document upload, identity verify, reference checks' },
        { name: 'Pega Case Mgmt', detail: 'Parallel track with Stage 6; both must close before Stage 8' },
        { name: 'Status Timeline', detail: 'Public-style progress; stage shown without exposing back-office logic' },
      ],
      candidateSees: 'Vetting status — BPSS clearance · Stage 3 of 5. ✓ Documents uploaded. ✓ Identity verified. Reference check 1 In progress. Reference check 2 Pending. BPSS issued Pending.',
      nbaDecisions: [
        { action: 'Chase second referee at Day 17 (3-day auto)', channel: 'Caseworker Task', propensity: 100, treatment: 'vetting-ref-chase-d17', auditRef: 'ATRS-2026-013' },
        { action: 'Fitness-prep nudge to candidate (keep warm)', channel: 'Push', propensity: 68, treatment: 'vetting-wait-fitness-nudge', auditRef: 'ATRS-2026-014' },
      ],
      status: 'active', dayRange: 'Day 14', outcome: 'In flight',
    },
    {
      id: 8, name: 'Fitness Prep', shortName: 'Fitness', phase: 4,
      phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'MPCT fitness app integrated via API. Workout completion data and personal bests flow back into the Pega case — recruiter sees same data. CDH sends push nudges based on progress vs REME standard.',
      pegaCapabilities: [
        { name: 'MPCT Integration', detail: 'API: workouts · completion · personal bests → Pega case' },
        { name: 'Push Notifications', detail: 'CDH-triggered daily nudges based on fitness trajectory' },
        { name: 'Outcome Tracking', detail: 'Fitness data feeds AC pass-rate prediction model in CDH' },
      ],
      candidateSees: 'Fitness prep — Day 5 of 14 · Army REME standard. Today: 3km steady run + core circuit · 35 min. Progress this week: M T W T F. Personal best: 2km in 9m 04s — REME standard -16s. "Keep going — on track for AC!"',
      nbaDecisions: [
        { action: 'Send daily MPCT workout nudge (on-plan)', channel: 'Push', propensity: 79, treatment: 'fitness-daily-push-onplan', auditRef: 'ATRS-2026-015' },
        { action: 'Update AC pass prediction model with fitness signal', channel: 'CDH Model', propensity: 85, treatment: 'fitness-model-signal', auditRef: 'ATRS-2026-016' },
      ],
      status: 'active', dayRange: 'Days 14–21', outcome: 'On plan',
    },
    {
      id: 9, name: 'Assess. Prep', shortName: 'AC Prep', phase: 4,
      phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'AC prep delivered through Pega Knowledge. CDH NBA decides which prep card to surface today based on what James has watched, what he has not, and where cohort drop-off is. Travel logistics auto-arranged.',
      pegaCapabilities: [
        { name: 'Pega Knowledge', detail: 'Video briefings · practice exercises · aptitude warm-ups' },
        { name: 'NBA Prep Nudges', detail: 'CDH surfaces next-priority prep card; watches → signals → retrains' },
        { name: 'AC Scheduler', detail: 'Travel auto-arranged; train + pickup + kit list from Service config' },
      ],
      candidateSees: 'AC briefing — Pirbright · Mon 26 May. ✓ Watch AC overview video (8 min) Done. ✓ Practice teamwork exercise Done. Take REME aptitude practice Active. Pack kit list Pending. Train: Carlisle 06:14 → Pirbright 11:48.',
      nbaDecisions: [
        { action: 'Surface REME aptitude practice next (cohort drop-off signal)', channel: 'Portal', propensity: 83, treatment: 'ac-prep-reme-aptitude-cta', auditRef: 'ATRS-2026-017' },
        { action: 'Arrange train booking Carlisle → Pirbright', channel: 'Case Automation', propensity: 100, treatment: 'travel-auto-book-d24', auditRef: 'ATRS-2026-018' },
      ],
      status: 'pending', dayRange: 'Day 21', outcome: 'Ready',
    },
    {
      id: 10, name: 'Assessment Ctr', shortName: 'Assess Ctr', phase: 4,
      phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'Army AC at Pirbright — 1-day format. AC scheduler with Constellation Advisor on recruiter desktop. Outcome captured back into CDH for cohort funnel and model retraining.',
      pegaCapabilities: [
        { name: 'AC Scheduler', detail: 'Pirbright 26 May; station pickup arranged; sub-£100 accommodation auto-approved' },
        { name: 'Constellation Advisor', detail: 'Recruiter sees candidate scores real-time during AC day' },
        { name: 'Outcome Capture', detail: 'Pass/fail → CDH; feeds REME cohort funnel model' },
      ],
      candidateSees: 'AC outcome — Pirbright · 26 May. PASS. Recommended for REME role. Specialist tests passed. Next: Conditional offer issued by Wed 28 May · SLA 10-day commitment ✓. Feedback: Strong on practical tasks · Effective in team activities.',
      nbaDecisions: [
        { action: 'Capture AC outcome to cohort pass-rate model', channel: 'CDH Model', propensity: 100, treatment: 'ac-outcome-capture', auditRef: 'ATRS-2026-019' },
        { action: 'Trigger offer-letter workflow immediately on PASS', channel: 'Case Auto', propensity: 100, treatment: 'offer-trigger-ac-pass', auditRef: 'ATRS-2026-020' },
      ],
      status: 'pending', dayRange: 'Day 24', outcome: 'Pass',
    },
    {
      id: 11, name: 'Specialist Assess.', shortName: 'Specialist', phase: 4,
      phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'REME-specific aptitude tests at AC. Specialist test API for trade-specific routing. Pass/refer logic. REME aptitude in top quartile — 92nd percentile.',
      pegaCapabilities: [
        { name: 'Specialist Test API', detail: 'REME Vehicle Mech trade aptitude; results via API to Pega case' },
        { name: 'Service-level Routing', detail: 'Trade-specific test set selected from Service config' },
        { name: 'Pass/Refer Logic', detail: '92nd percentile — PASS; cohort benchmark updated' },
      ],
      candidateSees: 'Takes REME-specific aptitude tests at AC. Mechanical comprehension · fault diagnosis · spatial reasoning. REME aptitude in top quartile. Pass confirmed.',
      nbaDecisions: [
        { action: 'Route REME aptitude result to offer workflow', channel: 'Case Routing', propensity: 100, treatment: 'specialist-pass-offer-route', auditRef: 'ATRS-2026-021' },
        { action: 'Update D&I disparity model with cohort result', channel: 'CDH Model', propensity: 100, treatment: 'di-model-update-cohort', auditRef: 'ATRS-2026-022' },
      ],
      status: 'pending', dayRange: 'Day 25', outcome: 'Pass',
    },
    {
      id: 12, name: 'Offer of Service', shortName: 'Offer', phase: 5,
      phaseLabel: 'Phase 5: Offer & Onboarding',
      description: 'Conditional → confirmed offer. James accepts in 30 seconds via e-signature in Pega portal. Case auto-routes to JPA and DBS. AFRP 10-day commitment target hit.',
      pegaCapabilities: [
        { name: 'Pega Application', detail: 'Offer letter generated; e-signature capture in portal' },
        { name: 'Offer Letter Mgmt', detail: 'REME Vehicle Mech · Year 1 salary · apprentice bonus £2,500' },
        { name: 'Acceptance Tracking', detail: 'e-signed in 30s; case auto-routes to JPA/DBS handoff' },
      ],
      candidateSees: 'Conditional offer — REME Vehicle Mechanic · issued Wed 28 May. Package: Year 1 salary · free meals & healthcare · subsidised accommodation · apprentice bonus £2,500. Accept offer — e-signed in 30 seconds. "Questions? Chat with your AFCO advisor."',
      nbaDecisions: [
        { action: 'Auto-route case to JPA/DBS on acceptance', channel: 'Case Auto', propensity: 100, treatment: 'offer-accept-jpa-route', auditRef: 'ATRS-2026-023' },
        { action: 'Send Phase 1 countdown welcome message', channel: 'Portal + Push', propensity: 97, treatment: 'phase1-countdown-welcome', auditRef: 'ATRS-2026-024' },
      ],
      status: 'pending', dayRange: 'Day 28', outcome: 'Accepted',
    },
    {
      id: 13, name: 'Onboard / Phase 1', shortName: 'Phase 1', phase: 5,
      phaseLabel: 'Phase 5: Offer & Onboarding',
      description: 'Phase 1 training starts at ATR Pirbright on Day 30. AFRP fast-track commitment hit. JPA/DBS handoff complete. 6-month retention signal closes the loop back to Attract decisioning model.',
      pegaCapabilities: [
        { name: 'Phase 1 Sync', detail: 'Pre-Phase 1 brief · kit list · final fitness check via Pega Knowledge' },
        { name: 'JPA/DBS Handoff', detail: 'Integration layer (Akkodis-built); personnel systems synced' },
        { name: 'Closed-Loop Outcomes', detail: '6-month retention signal → CDH model retraining → better Attract' },
      ],
      candidateSees: 'Welcome to the Army — Phase 1 starts Mon 28 May. 8 days until you join ATR Pirbright. Pre-Phase 1 brief (online) 21 May · Kit list confirmed 23 May · Final fitness check 25 May · Travel to Pirbright 28 May. JPA account — Activate before Phase 1.',
      nbaDecisions: [
        { action: 'Send 6-month retention survey (closed-loop signal)', channel: 'Portal + Email', propensity: 100, treatment: 'retention-survey-6m', auditRef: 'ATRS-2026-025' },
        { action: 'Retrain Attract model with Phase-1 retention outcome', channel: 'CDH Model', propensity: 100, treatment: 'attract-model-retrain-loop', auditRef: 'ATRS-2026-026' },
      ],
      status: 'pending', dayRange: 'Day 30', outcome: 'PHASE 1',
    },
  ],

  sarah: [
    {
      id: 1, name: 'Attract', shortName: 'Attract', phase: 1, phaseLabel: 'Phase 1: Attract & Engage',
      description: 'CDH identity stitching across LinkedIn organic engagement. Audience match for female STEM-grad officer pathway. AEM serves creative-rich officer content variants.',
      pegaCapabilities: [
        { name: 'CDH NBA Designer', detail: 'Identity stitching; LinkedIn organic engagement signals' },
        { name: 'AEM Content Resolver', detail: 'rn-officer-hero-female-stem-007 fragment resolved by AEM CDA' },
        { name: 'Adaptive Models', detail: 'Officer pathway propensity: 55% → 88% across engagement' },
      ],
      candidateSees: 'Likes 3 RN officer posts on LinkedIn organically. Lands on royalnavy site with AEM-served female-led Warfare Officer hero. "Officer Insight Event — Female Leaders panel."',
      nbaDecisions: [
        { action: 'Serve female-led officer hero variant', channel: 'LinkedIn + Web', propensity: 64, treatment: 'rn-officer-hero-female-stem-007', auditRef: 'ATRS-2026-101' },
        { action: 'Invite to Officer Insight Event — female STEM panel', channel: 'Email', propensity: 78, treatment: 'rn-insight-event-stem-female', auditRef: 'ATRS-2026-102' },
      ],
      aemContent: 'Fragment: rn-officer-hero-female-stem-007 | AEM CDA resolves hero image, speaker bios (Lt Cdr Emma Carter, Lt Sara Kapoor, Cdr Helena Wright), event CTA | CDH decides → AEM serves',
      status: 'done', dayRange: 'Day 1', outcome: 'Match · 64%',
    },
    {
      id: 2, name: 'Inform & Engage', shortName: 'Engage', phase: 1, phaseLabel: 'Phase 1: Attract & Engage',
      description: 'CDH decides content; AEM Content Fragments deliver creative-rich officer pathway content. High-production video, speaker bios, downloadable career packs — content velocity that Pega Content Studio alone cannot match.',
      pegaCapabilities: [
        { name: 'CDH Real-Time Container', detail: 'Decision in <200ms; output is content-fragment ID for AEM' },
        { name: 'AEM Content Fragments', detail: 'Organised by Service + audience hierarchy; InDesign → AEM pipeline' },
        { name: 'Engagement Policies', detail: 'Officer track suppressed from trades content; D&I check PASS' },
      ],
      candidateSees: 'Visits royalnavy.mod.uk — AEM-served female-led officer hero. Officer Insight Event RSVP page. Speaker portraits (Lt Cdr Emma Carter, Lt Sara Kapoor, Cdr Helena Wright). 287 confirmed attendees.',
      nbaDecisions: [
        { action: 'Personalise officer prep pack by AIB day proximity', channel: 'Web (AEM)', propensity: 88, treatment: 'rn-aib-prep-stem-d80', auditRef: 'ATRS-2026-103' },
        { action: 'Surface female-officer network webinar NBA card', channel: 'Portal', propensity: 76, treatment: 'rn-female-network-webinar', auditRef: 'ATRS-2026-104' },
      ],
      aemContent: 'Fragment: rn-officer-event-female-panel | AEM resolves: hero, 3 speaker bios with video intros, RSVP CTA, takeaway list | CDH pega-cdh-decision → aem-content-fragment-resolver',
      status: 'done', dayRange: 'Days 4–7', outcome: 'Engaged',
    },
    {
      id: 3, name: 'Apply', shortName: 'Apply', phase: 2, phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'Sarah applies after recruiter call post-Insight Event. Pega Application + AEM forms for officer-grade application. Context from LinkedIn → insight event → recruiter call pre-loaded.',
      pegaCapabilities: [
        { name: 'Pega Application', detail: 'Officer-track application; single profile across portal and advisor desktop' },
        { name: 'AEM Forms', detail: 'Officer-specific form steps with AEM-served content guidance' },
        { name: 'Service Routing', detail: 'Royal Navy; Warfare Officer; officer-grade merit ranking' },
      ],
      candidateSees: 'Applies after recruiter call. Officer-grade application — 9 steps. Full context from LinkedIn engagement + insight event attendance pre-loaded.',
      nbaDecisions: [
        { action: 'Surface officer AIB prep pack after apply', channel: 'Portal (AEM)', propensity: 88, treatment: 'rn-officer-aib-prep-post-apply', auditRef: 'ATRS-2026-105' },
      ],
      aemContent: 'AEM Content Fragment: rn-officer-application-guidance | Detailed officer-pathway guidance alongside Pega form steps | Agency creative pipeline intact',
      status: 'done', dayRange: 'Day 28', outcome: 'App in',
    },
    {
      id: 4, name: 'Medical Q.', shortName: 'Med Q', phase: 2, phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'Officer-grade medical questionnaire. CDH personalises Q-order. AEM content fragments provide detailed guidance text alongside each Pega form question.',
      pegaCapabilities: [
        { name: 'Pega Forms', detail: 'Save-as-you-go; officer-grade question set' },
        { name: 'AEM Content Fragments', detail: 'Detailed contextual guidance for each medical question' },
        { name: 'Personalised Q-order', detail: 'CDH cohort model; officer pathway completion data' },
      ],
      candidateSees: 'Officer-grade medical questionnaire with AEM-served detailed guidance per question. "We\'ve simplified the order based on what 9 in 10 candidates find helpful first."',
      nbaDecisions: [
        { action: 'Apply officer-cohort Q-order model', channel: 'Portal Form', propensity: 86, treatment: 'med-q-officer-stem-order', auditRef: 'ATRS-2026-106' },
      ],
      aemContent: 'AEM fragments: rn-medical-guidance-officer | Rich contextual help per question; "Why we ask" expandable sections | Served alongside Pega form fields',
      status: 'done', dayRange: 'Day 29', outcome: 'Submitted',
    },
    {
      id: 5, name: 'Pre-rec Interview', shortName: 'Pre-rec', phase: 2, phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'Officer-track leadership scenario pre-recorded interview. CJA-aware AI scoring. Longer scenarios than trades track.',
      pegaCapabilities: [
        { name: 'Capture Flow', detail: 'Officer leadership scenarios; 5 questions; 3 min each' },
        { name: 'CJA-aware AI Scoring', detail: 'Criminal Justice Act aware; officer-pathway fairness benchmarks' },
        { name: 'Async Assessment', detail: 'Assessor review 48h SLA for officer track' },
      ],
      candidateSees: 'Pre-recorded officer interview — leadership scenarios. "Describe a time you led a team through ambiguity." 5 questions · 3 minutes each.',
      nbaDecisions: [
        { action: 'Score with CJA-aware FairAI for officer pathway', channel: 'AI Engine', propensity: 91, treatment: 'fair-ai-cja-officer-score', auditRef: 'ATRS-2026-107' },
      ],
      aemContent: 'AEM fragment: rn-prec-guidance-officer | What to expect, camera setup, sample questions — high-production guidance video served by AEM',
      status: 'done', dayRange: 'Day 32', outcome: 'Submitted',
    },
    {
      id: 6, name: 'Medical Assess.', shortName: 'Med Assess', phase: 3, phaseLabel: 'Phase 3: Vetting & Medical',
      description: 'Officer-level medical at Optima Manchester clinic. Additional officer-specific assessments beyond standard entry. Tri-Service routing with officer extras.',
      pegaCapabilities: [
        { name: 'Optima API', detail: 'Officer-level medical; Manchester clinic; extended assessment set' },
        { name: 'Tri-Service + Officer Extras', detail: 'Officer-specific colour vision, fitness (BPFA), psych screen' },
        { name: 'AEM Status Content', detail: 'AEM serves prep guidance per stage of officer medical' },
      ],
      candidateSees: 'Officer-level medical appointment at Optima Manchester — extended assessment including BPFA fitness test and additional officer-grade screens.',
      nbaDecisions: [
        { action: 'Route to Optima Manchester officer clinic', channel: 'Case Routing', propensity: 100, treatment: 'optima-routing-officer-manchester', auditRef: 'ATRS-2026-108' },
      ],
      aemContent: 'AEM fragment: rn-medical-officer-prep | Officer-specific prep guidance; what to expect at extended medical; AEM-served video walkthrough',
      status: 'active', dayRange: 'Day 45', outcome: 'Cleared',
    },
    {
      id: 7, name: 'Vetting', shortName: 'Vetting', phase: 3, phaseLabel: 'Phase 3: Vetting & Medical',
      description: 'SC (Security Check) vetting for officer pathway — longer process than BPSS. 40-day window. AEM serves stage-specific status content to keep candidate engaged during wait.',
      pegaCapabilities: [
        { name: 'SC Vetting Workflow', detail: 'Security Check; 40-day window; sub-cases per element' },
        { name: 'AEM Status Content', detail: 'Per-stage engagement content during 40-day SC wait' },
        { name: 'Status Timeline', detail: 'Transparency of process without exposing personal-data flows' },
      ],
      candidateSees: 'SC vetting status — Stage 2 of 7. Documents submitted. Identity verified. Employer reference in progress. AEM-served "What\'s happening at each stage" content.',
      nbaDecisions: [
        { action: 'Serve SC stage explanation content (AEM)', channel: 'Portal (AEM)', propensity: 89, treatment: 'sc-status-content-stage2', auditRef: 'ATRS-2026-109' },
        { action: 'Send officer network event nudge during SC wait', channel: 'Email', propensity: 65, treatment: 'sc-wait-officer-network-nudge', auditRef: 'ATRS-2026-110' },
      ],
      aemContent: 'AEM fragment: rn-sc-vetting-stage-content | Per-stage explainer articles; officer forum links; "what to expect next" from AEM CMS',
      status: 'active', dayRange: 'Days 50–90', outcome: 'In flight',
    },
    {
      id: 8, name: 'Fitness Prep', shortName: 'Fitness', phase: 4, phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'Officer-tier fitness via MPCT plus self-led prep. AEM coaching video library supplements MPCT app. CDH NBA surfaces videos from AEM based on progress signals.',
      pegaCapabilities: [
        { name: 'MPCT API', detail: 'Officer fitness standard; RN BPFA targets; daily tracking' },
        { name: 'AEM Coaching Video Library', detail: 'High-production officer fitness coaching served from AEM' },
        { name: 'CDH NBA', detail: 'Surfaces next coaching video from AEM based on MPCT signals' },
      ],
      candidateSees: 'MPCT app + AEM coaching videos. Officer fitness standard: 2.4km run, press-ups, sit-ups. AEM-served expert coaching videos. CDH suggests: "Watch swimming endurance session next."',
      nbaDecisions: [
        { action: 'Surface AEM swimming endurance video (MPCT signal)', channel: 'Portal (AEM)', propensity: 77, treatment: 'rn-fitness-swimming-aem-video', auditRef: 'ATRS-2026-111' },
      ],
      aemContent: 'AEM fragment: rn-fitness-coaching-library | 24 officer fitness coaching videos; CDP tracks views → CDH decides next | AEM content velocity exceeds Pega Content Studio',
      status: 'pending', dayRange: 'Days 60–90', outcome: 'On plan',
    },
    {
      id: 9, name: 'Assess. Prep', shortName: 'AC Prep', phase: 4, phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'Officer Insight pack from AEM. CDH NBA: "Watch the AIB activity walkthrough next" predicted to lift AC pass propensity by 9pp. Pega Knowledge + AEM CMS for content depth.',
      pegaCapabilities: [
        { name: 'Pega Knowledge', detail: 'Structured prep plan; AIB activity types; watchlist' },
        { name: 'AEM CMS', detail: 'Officer Selection 101 · AIB walkthrough · STEM-grad case studies · female officer network webinar' },
        { name: 'NBA Prep Nudges', detail: 'CDH: "AIB walkthrough next → +9pp AC pass propensity"' },
      ],
      candidateSees: 'Officer AIB Prep Pack — Day 80 of 120 · AIB on Day 90. Officer Selection 101 (12 min video). AIB activity walkthrough (interactive 24 min). STEM-grad case studies (14 pages). Female officer network webinar (Live Mon). CDH NBA: "Watch the AIB activity walkthrough next (+9pp)".',
      nbaDecisions: [
        { action: 'Surface AIB walkthrough as priority NBA (+9pp)', channel: 'Portal (AEM)', propensity: 91, treatment: 'aib-walkthrough-aem-priority', auditRef: 'ATRS-2026-112' },
        { action: 'Invite to female officer live webinar', channel: 'Email', propensity: 73, treatment: 'female-officer-webinar-invite', auditRef: 'ATRS-2026-113' },
      ],
      aemContent: 'pega-cdh-decision → aem-content-fragment-resolver | CDH returns treatment ID → AEM resolves full AIB prep pack with all sub-elements in one sub-second CDA call',
      status: 'pending', dayRange: 'Day 80', outcome: 'Ready',
    },
    {
      id: 10, name: 'AIB (Assess. Ctr)', shortName: 'AIB', phase: 4, phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'Admiralty Interview Board — 2-day format. AC scheduler with AEM-served briefing materials. Outcome captured back to CDH for officer cohort model retraining.',
      pegaCapabilities: [
        { name: 'AC Scheduler', detail: '2-day AIB; accommodation; travel from Manchester' },
        { name: 'AEM Briefing Materials', detail: 'High-production AIB day-by-day briefing pack from AEM' },
        { name: 'Constellation Advisor', detail: 'Assessor uses Pega Constellation desktop with all signals' },
      ],
      candidateSees: 'Attends 2-day Admiralty Interview Board. Pega portal shows real-time status. AEM-served "Day 2 brief: what happens in the planning exercise." Pass confirmed.',
      nbaDecisions: [
        { action: 'Serve AIB Day 2 briefing from AEM', channel: 'Portal (AEM)', propensity: 100, treatment: 'aib-day2-brief-aem', auditRef: 'ATRS-2026-114' },
        { action: 'Trigger offer workflow on AIB PASS', channel: 'Case Auto', propensity: 100, treatment: 'aib-pass-offer-trigger', auditRef: 'ATRS-2026-115' },
      ],
      aemContent: 'AEM fragment: rn-aib-briefing-day2 | Day-by-day officer briefing; map; schedule; what to wear — high-production AEM content served alongside Pega case',
      status: 'pending', dayRange: 'Day 90', outcome: 'Pass',
    },
    {
      id: 11, name: 'Specialist Assess.', shortName: 'Specialist', phase: 4, phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'Warfare Officer aptitude; naval engineering tests. AEM-led practice content. Specialist API for trade-specific results routing.',
      pegaCapabilities: [
        { name: 'Specialist Test API', detail: 'Warfare Officer aptitude + naval engineering assessments' },
        { name: 'AEM Practice Content', detail: 'High-production practice tests from AEM CMS' },
        { name: 'Pass/Refer Logic', detail: 'Officer-grade thresholds; result routed to offer' },
      ],
      candidateSees: 'Warfare Officer aptitude tests — spatial reasoning · naval engineering · leadership scenario. AEM-served practice content referenced. Pass confirmed.',
      nbaDecisions: [
        { action: 'Serve AEM naval engineering practice content', channel: 'Portal (AEM)', propensity: 84, treatment: 'rn-warfare-eng-practice-aem', auditRef: 'ATRS-2026-116' },
      ],
      aemContent: 'AEM fragment: rn-officer-specialist-practice | Naval engineering practice tests; worked examples — agency-produced content in AEM',
      status: 'pending', dayRange: 'Day 95', outcome: 'Pass',
    },
    {
      id: 12, name: 'Offer of Service', shortName: 'Offer', phase: 5, phaseLabel: 'Phase 5: Offer & Onboarding',
      description: 'Commissioned service offer. AEM-styled acceptance pack. Pega Application offer-letter management with e-signature. JPA handoff triggered.',
      pegaCapabilities: [
        { name: 'Offer Letter Mgmt', detail: 'Commissioned service offer; AEM-styled acceptance pack' },
        { name: 'AEM Acceptance Pack', detail: 'Officer commission package; high-production AEM content' },
        { name: 'Acceptance Tracking', detail: 'e-signed; case routed to JPA/DBS' },
      ],
      candidateSees: 'Commissioned Warfare Officer offer — AEM-styled acceptance pack with full commission package details, uniform allowance, overseas posting options. e-signed in the Pega portal.',
      nbaDecisions: [
        { action: 'Serve AEM officer acceptance pack on offer issue', channel: 'Portal (AEM)', propensity: 100, treatment: 'rn-officer-acceptance-pack-aem', auditRef: 'ATRS-2026-117' },
        { action: 'Auto-route to JPA/DBS on acceptance', channel: 'Case Auto', propensity: 100, treatment: 'rn-offer-accept-jpa-route', auditRef: 'ATRS-2026-118' },
      ],
      aemContent: 'AEM fragment: rn-officer-offer-acceptance | Commission package; AEM-produced officer welcome video from CNS; uniform guide — content velocity from agency pipeline',
      status: 'pending', dayRange: 'Day 100', outcome: 'Accepted',
    },
    {
      id: 13, name: 'BRNC Start', shortName: 'BRNC', phase: 5, phaseLabel: 'Phase 5: Offer & Onboarding',
      description: 'Reports to BRNC Dartmouth. JPA handoff. Closed-loop outcomes back to CDH officer cohort model. 6-month officer retention feeds Attract decisioning.',
      pegaCapabilities: [
        { name: 'JPA Handoff', detail: 'Officer personnel records; BRNC training start sync' },
        { name: 'Closed-Loop Outcomes', detail: 'BRNC retention → CDH officer cohort model retraining' },
        { name: 'AEM Onboarding Content', detail: 'Pre-BRNC prep; kit list; Dartmouth briefing from AEM' },
      ],
      candidateSees: 'Welcome to the Royal Navy — BRNC starts on Day 120. AEM-served Dartmouth onboarding guide. JPA activated. Pre-BRNC brief online. Kit list. Travel arranged.',
      nbaDecisions: [
        { action: 'Send AEM Dartmouth onboarding guide', channel: 'Portal (AEM)', propensity: 100, treatment: 'brnc-onboard-aem-guide', auditRef: 'ATRS-2026-119' },
        { action: 'Retrain officer Attract model with BRNC retention', channel: 'CDH Model', propensity: 100, treatment: 'officer-attract-retrain-loop', auditRef: 'ATRS-2026-120' },
      ],
      aemContent: 'AEM fragment: rn-brnc-onboarding-pack | Dartmouth arrival guide; officer mess etiquette; pre-BRNC reading list — high-production AEM content for officer onboarding',
      status: 'pending', dayRange: 'Day 120', outcome: 'BRNC',
    },
  ],

  george: [
    {
      id: 1, name: 'Attract', shortName: 'Attract', phase: 1, phaseLabel: 'Phase 1: Attract & Engage',
      description: 'CDH NBA decides diversity-led RAF engineering ad on Facebook. AEP activates audience in Meta — CDH decides, AEP activates. Cohort: Year 13 / London / diversity-led. Match: 73%.',
      pegaCapabilities: [
        { name: 'CDH NBA Designer', detail: 'Diversity-led RAF engineering creative; London Year-13 cohort' },
        { name: 'AEP Audience Activation', detail: 'CDH → AEP destination connector → Meta Custom Audience (30-120s)' },
        { name: 'Adaptive Models', detail: 'Propensity: 68% → 87% across engagement' },
      ],
      candidateSees: 'Sees diversity-led RAF engineering ad on Facebook. SAC Marcus Williams — "Engineer the future of flight. Apprentice Aircraft Technicians earn from year 1." Learn more.',
      nbaDecisions: [
        { action: 'Serve diversity-led RAF Aircraft Tech creative', channel: 'Facebook (via AEP)', propensity: 73, treatment: 'raf-aircraft-tech-div-fb-012', auditRef: 'ATRS-2026-201' },
        { action: 'Extend reach via AEP lookalike audience', channel: 'Meta + Google (AEP)', propensity: 71, treatment: 'raf-lookalike-london-y13', auditRef: 'ATRS-2026-202' },
      ],
      aepLayer: 'CDH fires audience-id: cdh-george-attract-london-y13 → AEP Real-Time CDP → Meta Custom Audience activated in 30-120s | Lookalike extends to similar Year-13 London candidates',
      status: 'done', dayRange: 'Day 1', outcome: 'Match · 73%',
    },
    {
      id: 2, name: 'Inform & Engage', shortName: 'Engage', phase: 1, phaseLabel: 'Phase 1: Attract & Engage',
      description: 'George lands on RAF.mod.uk. Watches Aircraft Tech video to 90% completion. CDH Real-Time Container activates. AEP enriches profile with web events. Propensity reaches 87%.',
      pegaCapabilities: [
        { name: 'CDH Real-Time Container', detail: '<200ms; cookie → profile; 87% propensity after video 90% watch' },
        { name: 'AEP Profile Enrichment', detail: 'Web events stream to AEP Real-Time CDP; profile enriched' },
        { name: 'Channel Orchestration', detail: 'RAF brand; Aircraft Tech role match 87%' },
      ],
      candidateSees: 'Lands on RAF.mod.uk — personalised: "Engineer the future of flight." Watches Aircraft Technician video to 90%. Role match badge 87%. Recommended roles list (Aircraft Tech, Avionics Tech, Weapon Tech). Starts application.',
      nbaDecisions: [
        { action: 'Surface Aircraft Tech 87% match role card', channel: 'Web', propensity: 87, treatment: 'raf-aircraft-tech-role-card-87', auditRef: 'ATRS-2026-203' },
        { action: 'AEP enriches profile with video 90% signal', channel: 'AEP → CDH', propensity: 84, treatment: 'raf-video-watch-aep-signal', auditRef: 'ATRS-2026-204' },
      ],
      aepLayer: 'Web events (page view · video 90% · role card click) stream from web SDK → AEP Real-Time CDP → profile enriched → CDH model updated | Propensity rises 68% → 87%',
      status: 'done', dayRange: 'Days 1–2', outcome: 'Propensity · 87%',
    },
    {
      id: 3, name: 'Apply', shortName: 'Apply', phase: 2, phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'George abandons the medical-history step on first attempt (Day 5). CDH detects abandon. AEP activates re-targeting segment in Meta/Instagram with peer-testimonial creative. George re-engages via FB ad on Day 6.',
      pegaCapabilities: [
        { name: 'CDH Abandon Detection', detail: 'Trigger: form-step exit at /apply/medical-history; NBA: re-arbitrate' },
        { name: 'AEP Re-targeting Segment', detail: 'audience-id: cdh-george-warm-medical (TTL 7d) pushed to Meta' },
        { name: 'Deep-link Back to Pega', detail: 'Click on re-target ad → returns George to Step 4, pre-filled, same profile' },
      ],
      candidateSees: 'Starts application. Abandons medical questionnaire (Day 5). Sees Instagram re-target: SAC Marcus Williams — "The medical bit was simpler than I thought." Clicks deep-link → returns to Step 4 pre-filled. Completes. (Day 6)',
      nbaDecisions: [
        { action: 'Push medical-FAQ peer testimonial to AEP re-target', channel: 'Instagram (AEP → Meta)', propensity: 79, treatment: 'raf-medical-peer-retarget-ig', auditRef: 'ATRS-2026-205' },
        { action: 'Deep-link: return to Step 4, pre-filled, simplified Q-order', channel: 'Deep-link → Portal', propensity: 92, treatment: 'raf-apply-deeplink-prefill', auditRef: 'ATRS-2026-206' },
      ],
      aepLayer: '1. CDH detects abandon → 2. CDH-AEP connector pushes audience (TTL 7d) → 3. Meta activates in 30-120s → 4. George clicks → 5. AEP exit → Pega entry → same profile, no re-asking | Conversion fires back: AEP → Pega → CDH retraining',
      status: 'done', dayRange: 'Day 6', outcome: 'App complete',
    },
    {
      id: 4, name: 'Medical Q.', shortName: 'Med Q', phase: 2, phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'CDH detects medical-concern signal from prior abandon. Re-orders question sequence. Inserts "A note before you start" normaliser. Pre-fills answers from prior session. "9-in-10" normaliser addresses concern signal.',
      pegaCapabilities: [
        { name: 'Pega Forms', detail: 'Pre-filled from prior session; simplified RAF Q-order; save-as-you-go' },
        { name: 'CDH Personalised Q-order', detail: 'Concern signal → reorder → normaliser text inserted → "9 in 10" framing' },
        { name: 'AEP Re-engagement', detail: 'Completion fires back AEP → Pega → CDH model (closes loop)' },
      ],
      candidateSees: 'Medical history — Step 3 of 7 (RAF · My application). "We\'ve simplified the order based on what 9 in 10 candidates find helpful first." RAF brand chrome. Pre-filled. "Why we ask" inline. "Save and continue — we save as you go."',
      nbaDecisions: [
        { action: 'Apply concern-signal Q-order with normaliser', channel: 'Portal Form', propensity: 83, treatment: 'raf-med-q-concern-normaliser', auditRef: 'ATRS-2026-207' },
        { action: 'Fire AEP conversion signal on form completion', channel: 'AEP → CDH', propensity: 100, treatment: 'raf-med-complete-aep-signal', auditRef: 'ATRS-2026-208' },
      ],
      aepLayer: 'George\'s form completion fires back through AEP → Pega → CDH model retraining | AEP audience cdh-george-warm-medical TTL expires (no re-target needed)',
      status: 'done', dayRange: 'Day 7', outcome: 'Submitted',
    },
    {
      id: 5, name: 'Pre-rec Interview', shortName: 'Pre-rec', phase: 2, phaseLabel: 'Phase 2: Apply & Initial Assessments',
      description: 'George records 4-min video interview from home. Pega capture + async AI scoring. FairAI disparity check for diversity-led cohort.',
      pegaCapabilities: [
        { name: 'Pega Capture', detail: '4-min video interview from home; secure storage; async' },
        { name: 'Async AI Scoring', detail: 'FairAI; diversity-led cohort disparity check PASS' },
        { name: 'AEP Signal', detail: 'Interview completion fires to AEP → CDH engagement model' },
      ],
      candidateSees: 'Pre-recorded interview from home. "Tell us about a time when you had to learn something quickly." 4 minutes · 2 takes. Submitted.',
      nbaDecisions: [
        { action: 'Score with FairAI diversity-cohort benchmark', channel: 'AI Engine', propensity: 89, treatment: 'fair-ai-diversity-cohort-score', auditRef: 'ATRS-2026-209' },
      ],
      aepLayer: 'Interview completion → AEP signal → CDH profile updated → engagement model retrained with completion signal',
      status: 'done', dayRange: 'Day 8', outcome: 'Submitted',
    },
    {
      id: 6, name: 'Medical Assess.', shortName: 'Med Assess', phase: 3, phaseLabel: 'Phase 3: Vetting & Medical',
      description: 'Optima Health central London clinic. Pega Case Mgmt routes to nearest clinic (London). Standard BPFA + medical. Cleared.',
      pegaCapabilities: [
        { name: 'Optima API', detail: 'Central London clinic; standard RAF entry medical' },
        { name: 'Pega Case Mgmt', detail: 'Routes to London clinic; travel auto-arranged (Zone 1 — no reimbursement needed)' },
      ],
      candidateSees: 'Optima Health appointment — central London. Monday 19 May · 10:00. Prep checklist. Walk-in from nearest tube.',
      nbaDecisions: [
        { action: 'Route to Optima London (nearest to postcode)', channel: 'Case Routing', propensity: 100, treatment: 'optima-routing-london-central', auditRef: 'ATRS-2026-210' },
      ],
      aepLayer: 'Medical booking confirmation event → AEP → CDH profile enriched with medical-stage signal | Retention model updated',
      status: 'active', dayRange: 'Day 14', outcome: 'Cleared',
    },
    {
      id: 7, name: 'Vetting', shortName: 'Vetting', phase: 3, phaseLabel: 'Phase 3: Vetting & Medical',
      description: 'BPSS vetting. AEP-driven status reminders — CDH decides which message; AEP activates via email/SMS. Keeps George engaged during the wait without fatigue-capping past tolerance.',
      pegaCapabilities: [
        { name: 'BPSS Workflow', detail: 'Standard entry clearance; document upload; references' },
        { name: 'AEP Status Reminders', detail: 'CDH NBA → AEP audience → email/SMS nudge during vetting wait' },
        { name: 'Fatigue Capping', detail: 'AEP audience attribute: fatigue-cap enforced at CDH level' },
      ],
      candidateSees: 'Vetting status — BPSS · Stage 2 of 5. Documents submitted. ✓ Identity verified. Reference check in progress. AEP-triggered SMS: "Your application is progressing — stay on track with fitness prep."',
      nbaDecisions: [
        { action: 'AEP-driven fitness nudge during vetting wait', channel: 'SMS (AEP activation)', propensity: 74, treatment: 'raf-vetting-fitness-sms-aep', auditRef: 'ATRS-2026-211' },
      ],
      aepLayer: 'CDH NBA → AEP audience: cdh-george-vetting-wait (TTL 14d) → email/SMS activated | Fatigue-cap attribute enforced | No re-targeting (organic stage)',
      status: 'active', dayRange: 'Days 18–25', outcome: 'In flight',
    },
    {
      id: 8, name: 'Fitness Prep', shortName: 'Fitness', phase: 4, phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'MPCT app prep for RAF Engineering standard. CDH outcomes fed to AEP engagement audience — candidates who are on-track get different nudges to those at risk.',
      pegaCapabilities: [
        { name: 'MPCT API', detail: 'RAF Engineering standard fitness; workout data → Pega case' },
        { name: 'CDH Outcomes → AEP', detail: 'Fitness trajectory segment → AEP → different engagement for on-track vs at-risk' },
        { name: 'Push Notifications', detail: 'CDH-timed daily nudges; fatigue-capped' },
      ],
      candidateSees: 'MPCT app — RAF Aircraft Tech standard. Day 7 of 14. Today: interval runs + press-ups circuit. Progress on track. "You\'re in the top 20% for your age group."',
      nbaDecisions: [
        { action: 'Segment on-track vs at-risk in AEP for engagement', channel: 'AEP → Push', propensity: 82, treatment: 'raf-fitness-ontrack-aep-seg', auditRef: 'ATRS-2026-212' },
      ],
      aepLayer: 'MPCT outcome → Pega → CDH → AEP audience: raf-fitness-on-track OR raf-fitness-at-risk | Different engagement treatments per segment pushed to DSPs',
      status: 'pending', dayRange: 'Days 21–28', outcome: 'On plan',
    },
    {
      id: 9, name: 'Assess. Prep', shortName: 'AC Prep', phase: 4, phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'AC briefing pack via Pega Knowledge. AEP audiences for re-engagement of non-engagers — CDH identifies who has not watched key content and AEP pushes re-engage treatment.',
      pegaCapabilities: [
        { name: 'Pega Knowledge', detail: 'OASC briefing; practical activity guides; aptitude practice' },
        { name: 'AEP Re-engagement', detail: 'CDH identifies non-engagers → AEP audience → re-engage push' },
        { name: 'CDH NBA', detail: 'Surfaces next priority prep card; cohort completion data informs order' },
      ],
      candidateSees: 'AC prep pack — OASC Cranwell · 35 days. OASC overview video · practical activity guide · Aircraft Tech aptitude practice. CDH NBA: "Complete aptitude practice next."',
      nbaDecisions: [
        { action: 'Re-engage non-engagers via AEP audience push', channel: 'Push (AEP activation)', propensity: 76, treatment: 'raf-ac-prep-nonengager-aep', auditRef: 'ATRS-2026-213' },
        { action: 'Surface aptitude practice as priority NBA', channel: 'Portal', propensity: 88, treatment: 'raf-oasc-aptitude-nba', auditRef: 'ATRS-2026-214' },
      ],
      aepLayer: 'CDH segments non-engagers → AEP audience: raf-ac-prep-nonengager → Push/email re-engage treatment | Engagement fires back to CDH profile',
      status: 'pending', dayRange: 'Day 30', outcome: 'Ready',
    },
    {
      id: 10, name: 'OASC (Assess. Ctr)', shortName: 'OASC', phase: 4, phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'RAF OASC at RAF Cranwell — 2-3 days. AC scheduler with advisor desktop. AEP audience closed after OASC confirmation — no further paid-media activation needed.',
      pegaCapabilities: [
        { name: 'AC Scheduler', detail: 'OASC Cranwell; 2-3 day format; accommodation arranged' },
        { name: 'Advisor Desktop', detail: 'Recruiter Pega Constellation desktop with all signals pre-loaded' },
        { name: 'AEP Audience Close', detail: 'On OASC confirmation, AEP audience TTL set to 0 — no further activation' },
      ],
      candidateSees: 'Attends RAF OASC at RAF Cranwell. 2-3 days. Pega portal shows "OASC Day 2 — practical exercises." PASS confirmed.',
      nbaDecisions: [
        { action: 'Close AEP re-target audience on OASC confirm', channel: 'AEP (TTL→0)', propensity: 100, treatment: 'raf-aep-audience-close-oasc', auditRef: 'ATRS-2026-215' },
        { action: 'Trigger offer workflow on OASC PASS', channel: 'Case Auto', propensity: 100, treatment: 'raf-oasc-pass-offer-trigger', auditRef: 'ATRS-2026-216' },
      ],
      aepLayer: 'OASC confirmation → CDH → AEP connector: set audience TTL to 0 | No further Meta/Google activation | AEP profile retained for retention modelling',
      status: 'pending', dayRange: 'Day 35', outcome: 'Pass',
    },
    {
      id: 11, name: 'Specialist Assess.', shortName: 'Specialist', phase: 4, phaseLabel: 'Phase 4: Prep & Assessment Centre',
      description: 'Aircraft Tech aptitude tests as part of OASC. Specialist test API. AEP audience updated with specialist-pass signal for model enrichment.',
      pegaCapabilities: [
        { name: 'Specialist Test API', detail: 'Aircraft Tech mechanical aptitude; spatial reasoning; results via API' },
        { name: 'Pass/Refer Logic', detail: 'Aircraft Tech threshold; PASS routed to offer' },
        { name: 'AEP Signal', detail: 'Specialist pass → AEP → CDH retention model update' },
      ],
      candidateSees: 'Aircraft Tech aptitude tests — part of OASC Day 2. Mechanical aptitude · spatial reasoning · practical fault-finding simulation. PASS.',
      nbaDecisions: [
        { action: 'Update AEP profile with specialist-pass signal', channel: 'AEP → CDH', propensity: 100, treatment: 'raf-specialist-pass-aep-signal', auditRef: 'ATRS-2026-217' },
      ],
      aepLayer: 'Specialist test PASS → Pega → AEP profile attribute: raf-aircraft-tech-apt-pass → CDH retention prediction model updated',
      status: 'pending', dayRange: 'Day 35', outcome: 'Pass',
    },
    {
      id: 12, name: 'Offer of Service', shortName: 'Offer', phase: 5, phaseLabel: 'Phase 5: Offer & Onboarding',
      description: 'Confirmed apprentice contract. Pega offer-letter management. AEP audience closed permanently. e-signature in portal. JPA/DBS handoff triggered.',
      pegaCapabilities: [
        { name: 'Offer Letter Mgmt', detail: 'Aircraft Tech apprentice contract; e-signature in Pega portal' },
        { name: 'Acceptance Tracking', detail: 'Accepted; case routed to JPA/DBS integration' },
        { name: 'AEP Consent Close', detail: 'On acceptance, AEP marketing consent flag closed — no further paid-media' },
      ],
      candidateSees: 'Confirmed Aircraft Technician apprentice contract. Package: Year 1 from £20k · free meals · accommodation · RAF qualification pathways. e-signed in 30 seconds.',
      nbaDecisions: [
        { action: 'Close AEP marketing audience on offer acceptance', channel: 'AEP', propensity: 100, treatment: 'raf-aep-consent-close-offer', auditRef: 'ATRS-2026-218' },
        { action: 'Send Phase 1 countdown welcome via Push', channel: 'Push', propensity: 97, treatment: 'raf-phase1-countdown-push', auditRef: 'ATRS-2026-219' },
      ],
      aepLayer: 'Acceptance event → Pega → AEP: consent-flag CLOSED for marketing activation | AEP profile retained read-only for retention analytics | No further DSP activation',
      status: 'pending', dayRange: 'Day 42', outcome: 'Accepted',
    },
    {
      id: 13, name: 'Phase 1 Start', shortName: 'Phase 1', phase: 5, phaseLabel: 'Phase 5: Offer & Onboarding',
      description: 'Joins recruit training at RAF Halton on Day 60. JPA handoff complete. AEP audience created for Phase-1 retention cohort — 6-month retention outcome feeds back to Attract decisioning.',
      pegaCapabilities: [
        { name: 'JPA Handoff', detail: 'RAF Halton training start; personnel records synced' },
        { name: 'AEP Retention Cohort', detail: 'Phase-1 cohort audience in AEP for 6-month retention model' },
        { name: 'Closed-Loop CDH', detail: 'Phase-1 retention → CDH Attract model retraining → better lookalike' },
      ],
      candidateSees: 'Welcome to the RAF — Phase 1 starts at RAF Halton on Day 60. Pre-Phase 1 brief · kit list · travel arranged. JPA account activated.',
      nbaDecisions: [
        { action: 'Create AEP Phase-1 retention cohort audience', channel: 'AEP', propensity: 100, treatment: 'raf-phase1-retention-cohort-aep', auditRef: 'ATRS-2026-220' },
        { action: 'Retrain Attract lookalike model with retention outcome', channel: 'CDH Model', propensity: 100, treatment: 'raf-attract-retrain-aep-loop', auditRef: 'ATRS-2026-221' },
      ],
      aepLayer: 'Phase-1 join → AEP retention cohort created → 6-month outcome → AEP → CDH model retrain | Lookalike audiences for next Attract cycle improved | Pattern B compounding loop closes',
      status: 'pending', dayRange: 'Day 60', outcome: 'PHASE 1',
    },
  ],
};
