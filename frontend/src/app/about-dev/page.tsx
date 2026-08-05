"use client";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, MapPin, Mail, Phone, Heart,
  Briefcase, Code, GraduationCap, FileText, Award, BookOpen, Terminal, Cpu, Globe, Database, Cloud, Layers, Share2
} from "lucide-react";

export default function AboutDevPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition font-medium px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-sm font-semibold text-slate-500">Siddhant Kumar</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
            <span className="text-3xl font-bold text-white">SK</span>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Siddhant Kumar</h1>
            <p className="text-xl text-blue-600 font-medium mt-2">Full-Stack Developer | VoIP & Telephony Engineer | AI Developer</p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-slate-600">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400" /> Bihar, India</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center"><Globe className="w-4 h-4 mr-1 text-slate-400" /> Open to Global Remote Roles (up to 40 hrs/week)</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-sm">
              <a href="mailto:stjl093@gmail.com" className="flex items-center text-slate-600 hover:text-blue-600 transition">
                <Mail className="w-4 h-4 mr-1" /> stjl093@gmail.com
              </a>
              <a href="tel:+918095875948" className="flex items-center text-slate-600 hover:text-blue-600 transition">
                <Phone className="w-4 h-4 mr-1" /> +91 8095875948
              </a>
              <a href="https://linkedin.com/in/sid-093" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-600 hover:text-blue-700 transition">
                <Share2 className="w-4 h-4 mr-1" /> LinkedIn
              </a>
              <a href="https://github.com/S-V-J" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-600 hover:text-slate-900 transition">
                <Code className="w-4 h-4 mr-1" /> GitHub
              </a>
              <a href="/donate" className="flex items-center text-red-600 hover:text-red-700 transition font-medium">
                <Heart className="w-4 h-4 mr-1" /> Sponsor
              </a>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Professional Summary
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Results-driven Software Engineer with 5+ years of experience in telecom operations and enterprise technical support, complemented by intensive full-stack, VoIP, and AI development experience delivering production-grade systems for clients in Switzerland, Germany, and India. Deep domain expertise in telephony infrastructure (TELUS Digital), Asterisk/Kamailio PBX configuration, Python/FastAPI backends, React/Next.js frontends, and LLM-powered AI pipelines. Published researcher, active open-source contributor, and available immediately for remote, full-time engagements.
          </p>
        </section>

        {/* Technical Skills */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-blue-600" /> Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Terminal className="w-4 h-4" />, title: "VoIP & Telephony", items: "Asterisk, Kamailio, SIP, ISUP, RTP/RTCP, .pcap Analysis (Wireshark)" },
              { icon: <Code className="w-4 h-4" />, title: "Languages", items: "Python (Primary), C, C++, JavaScript, TypeScript, Java, Bash Scripting" },
              { icon: <Layers className="w-4 h-4" />, title: "Backend", items: "FastAPI, Flask, Django, Node.js/Express.js, Spring Boot 3.2 (Java)" },
              { icon: <Globe className="w-4 h-4" />, title: "Frontend", items: "React 18, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS" },
              { icon: <Cpu className="w-4 h-4" />, title: "AI & LLM", items: "LLM APIs & Local Deployment, Agentic Orchestration, Model Fine-Tuning, Whisper, OpenAI API" },
              { icon: <Database className="w-4 h-4" />, title: "Databases", items: "PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch" },
              { icon: <Cloud className="w-4 h-4" />, title: "Cloud & Infrastructure", items: "AWS (EC2, S3, Lambda, VPC), Hetzner Cloud, Linux (Ubuntu/RHEL), Nginx, systemd" },
              { icon: <Award className="w-4 h-4" />, title: "DevOps & Tools", items: "Docker, Kubernetes, Terraform, Ansible, GitHub Actions, GitLab CI/CD, Git, ServiceNow" }
            ].map((skill, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0">{skill.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{skill.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{skill.items}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Professional Experience
          </h2>
          <div className="space-y-6">
            {[
              {
                title: "VoIP AI Integration Engineer",
                company: "Basal Analytics Pvt. Ltd (desible.ai)",
                date: "Dec 2025 – Present (30-day delivery contract)",
                points: [
                  "Configured Asterisk PBX with the AudioSocket module and developed a Python WebSocket client to bridge live calls to Desible AI's voice engine, enabling real-time AI handling of answered outbound calls.",
                  "Architected an end-to-end outbound AI call pipeline: partner-originated calls routed to an Asterisk endpoint, seamlessly transferred to AI upon answer.",
                  "Deployed and configured infrastructure on AWS EC2 (Linux Ubuntu), including SIP trunk setup for call origination."
                ],
                stack: "Asterisk, AudioSocket, Python, WebSocket, SIP Trunk, AWS EC2, Linux Ubuntu, Kamailio"
              },
              {
                title: "AI Backend Developer",
                company: "Raiva — Germany (raiva.io)",
                date: "Oct 2025 – Jan 2026 (4 months)",
                points: [
                  "Built a document indexing and search portal enabling users to query large repositories via text input and real-time voice, featuring semantic NLP search and conversational AI responses.",
                  "Integrated OpenAI API for NLU query processing, Whisper for voice-to-text, and real-time conversational AI for document-grounded dialogue.",
                  "Deployed REST API backend and web portal frontend on Hetzner Cloud (Linux Ubuntu)."
                ],
                stack: "Python, OpenAI API, Linux Ubuntu, Hetzner Cloud, PostgreSQL, Semantic Search, Conversational AI"
              },
              {
                title: "VoIP Engineer",
                company: "Lancelot Technology (lancelotech.com)",
                date: "Aug 2025 – Sep 2025 (45-day delivery contract)",
                points: [
                  "Configured Asterisk and Kamailio PBX across two separate Ubuntu servers, developing a custom admin panel for complete PBX management.",
                  "Designed and implemented a multilingual IVR with voice/language detection and voice prompt playback for intelligent caller routing.",
                  "Configured SIP trunks on both servers, delivering the full project within a strict 45-day timeline."
                ],
                stack: "Asterisk, Kamailio, Linux Ubuntu, SIP Trunk, IVR, Python, Bash, Custom Admin Panel"
              },
              {
                title: "VoIP & PBX Engineer",
                company: "I WALINK SA — Switzerland",
                date: "May 2025 – Jun 2025 (51-day delivery contract)",
                points: [
                  "Configured Asterisk PBX on a hosted bare-metal server from scratch, delivering softphone login, inbound/outbound calls, voicemail, IVR system, and SIP trunk integration.",
                  "Developed Bash automation scripts and Python AGI (Asterisk Gateway Interface) programs for dynamic call routing logic and IVR intelligence.",
                  "Built a web-based admin panel for ongoing PBX management, including extension control, SIP trunk status monitoring, and IVR menu editing."
                ],
                stack: "Asterisk, SIP Trunk, IVR, Python AGI, Bash, Linux Ubuntu, Web Admin Panel"
              },
              {
                title: "Network Associate",
                company: "TELUS Digital — Canada (Remote)",
                date: "Jan 2022 – Aug 2025 (3 yrs 8 months)",
                points: [
                  "Executed command-based programming, testing, and troubleshooting of telephony switches (GTD 5 and DMS 100), maintaining enterprise infrastructure for Canada's largest telecom provider.",
                  "Resolved complex SIP and ISUP call-related issues and SIP trunking service problems; performed call tracing and .pcap file analysis using IRIS, CGIS, and Wireshark.",
                  "Managed full incident lifecycle via Lynx and ServiceNow, including RCA documentation and professional B2B communication with Canadian enterprise clients."
                ],
                stack: "Telephony Switches, SIP, ISUP, Wireshark, ServiceNow, Lynx"
              },
              {
                title: "Technical Support Advisor I",
                company: "Concentrix",
                date: "Feb 2021 – Oct 2021 (9 months)",
                points: [
                  "Provided Tier 1/2 technical support for laptops and desktops, diagnosing hardware faults and software issues for consumer and enterprise customers.",
                  "Utilized remote access tools (Rescue, TeamViewer, AnyDesk) for live diagnosis and repair.",
                  "Managed case logging, escalation, and resolution documentation via SAP and MSD CRM systems."
                ],
                stack: "Remote Support Tools, SAP, MSD CRM"
              }
            ].map((job, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <p className="text-blue-600 font-medium">{job.company}</p>
                  </div>
                  <span className="text-sm text-slate-500 font-medium mt-1 sm:mt-0 bg-slate-100 px-3 py-1 rounded-full">{job.date}</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {job.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Stack</p>
                  <p className="text-sm text-slate-700">{job.stack}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Projects */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Code className="w-5 h-5 mr-2 text-blue-600" /> Personal Projects (Open Source)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "AetherAgent", link: "https://github.com/S-V-J/AetherAgent", desc: "Fully local AI agent on Linux with no context limits. Features a decoder-only transformer built from zero weights in PyTorch, LoRA fine-tuning, SSE streaming, and parallel agentic tool execution." },
              { name: "PBX-Platform", link: "https://github.com/S-V-J/PBX-Platform", desc: "Enterprise multi-tenant PBX system: Asterisk + Kamailio + Python/FastAPI + PostgreSQL. 12 microservices, 76-table schema, JWT auth, RBAC, and full admin dashboard." },
              { name: "devops", link: "https://github.com/S-V-J/devops", desc: "Spring Boot 3.2 backend + React 18 frontend platform for managing DevOps tasks, CI/CD pipelines, and infrastructure from a single UI with fine-grained RBAC." },
              { name: "CloudDevStudio", link: "https://github.com/S-V-J/CloudDevStudio", desc: "Self-hosted, web-based Linux development platform featuring a browser IDE, integrated terminal, AI coding assistance, and database tooling." },
              { name: "zero2hero", link: "https://github.com/S-V-J/zero2hero", desc: "Authoring an educational course: 'Zero to Hero in Full Stack, VoIP, and AI Engineering,' building 10 production applications from scratch." }
            ].map((project, idx) => (
              <a key={idx} href={project.link} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition group block">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">{project.name}</h3>
                  <Code className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{project.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Education & Research */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" /> Education
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900">B.E. in Electronics & Communication Engineering</h3>
                <p className="text-sm text-slate-600">Visvesvaraya Technological University (VTU), India</p>
                <p className="text-xs text-slate-500 mt-1">Completed: Jan 2023 | Second Class</p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <h3 className="font-semibold text-slate-900">12th Board (Science — PCM)</h3>
                <p className="text-sm text-slate-600">Bihar School Examination Board (BSEB)</p>
                <p className="text-xs text-slate-500 mt-1">Completed: Apr 2015 | First Class</p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <h3 className="font-semibold text-slate-900">10th Board (CBSE)</h3>
                <p className="text-sm text-slate-600">Central Board of Secondary Education (CBSE)</p>
                <p className="text-xs text-slate-500 mt-1">Completed: May 2013 | First Class</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" /> Research & Publications
            </h2>
            <div>
              <h3 className="font-semibold text-slate-900">Intelligent Line Follower Robot using MSP430G2ET for Industrial Applications</h3>
              <p className="text-sm text-slate-600 mt-1"><strong>Journal:</strong> Helix — The Scientific Explorer, Vol. 10(2): pp. 232–237, Apr 2020</p>
              <p className="text-sm text-slate-600"><strong>Authors:</strong> Sourav Sutradhar, Viswanatha V, <strong>Siddhant Kumar</strong>, Shivam Kumar</p>
              <p className="text-sm text-slate-600"><strong>Presented at:</strong> AICTE-Sponsored ISCCS 2019, Sree Vidyanikethan Engineering College, Tirupati, AP (Oct 2019)</p>
              <a href="https://doi.org/10.29042/2020-10-2-232-237" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:underline mt-2">
                View Publication (DOI: 10.29042/2020-10-2-232-237)
              </a>
            </div>
          </section>
        </div>

        {/* Certifications & Internships */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" /> Certifications
            </h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span><span><strong>Generative AI + LLM App Development</strong> | Udemy (61 hrs) - Sep 2024</span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span><span><strong>Introduction to Cybersecurity</strong> | Cisco Networking Academy - Mar 2024</span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span><span><strong>Getting Started with Cisco Packet Tracer</strong> | Cisco - 2024</span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span><span><strong>The Bits and Bytes of Computer Networking</strong> | Google (Coursera) - Jul 2020</span></li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span><span><strong>Technical Support Fundamentals</strong> | Google (Coursera) - May 2020</span></li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" /> Internships
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Renesas RL78 Microcontroller Internship</h3>
                <p className="text-xs text-slate-500">SM Electronic Technologies Pvt. Ltd, Bangalore | Jan 2020 – Apr 2020</p>
                <p className="text-sm text-slate-600 mt-1">Focused on microcontroller architecture, peripheral interfacing, and embedded system design.</p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">C Programming and Embedded Systems Internship</h3>
                <p className="text-xs text-slate-500">Acharya Institute of Technology, Bangalore | Jan 2017</p>
                <p className="text-sm text-slate-600 mt-1">Organized by the ECE Department; focused on foundational C programming and embedded systems concepts.</p>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
