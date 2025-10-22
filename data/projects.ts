import type { Project } from "~/types/data";

export const PROJECTS: Project[] = [
  {
    type: "self",
    title: "The Greek Myth API",
    description:
      "A comprehensive REST API providing detailed information about Greek mythology, including gods, titans, monsters, and heroes with 200+ entries and multiple endpoints.",
    imgSrc:
      "https://res.cloudinary.com/dfjq9qvoz/image/upload/v1749439089/egglogwfguvb4npphhu8.webp",
    repo: "https://github.com/xi-Rick/thegreekmythapi",
    builtWith: ["Node.js", "Vercel", "REST API", "JSON", "Express.js"],
  },
  {
    type: "self",
    title:
      "From Rock Bottom to React: How I Turned My Card Game Into a Web App",
    description:
      "A personal journey of turning a card game invented during a difficult time into a modern web application using Next.js, complete with animations and mobile support.",
    imgSrc:
      "https://images.unsplash.com/photo-1501003878151-d3cb87799705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxwbGF5aW5nJTIwY2FyZHxlbnwwfHx8fDE3NDc2MTg0MjV8MA&ixlib=rb-4.1.0&q=80&w=2000",
    repo: "https://github.com/xi-Rick/marginmatch",
    builtWith: [
      "Next.js 15",
      "React",
      "Framer Motion",
      "Capacitor",
      "Lucide Icons",
      "React Icons",
      "ElevenLabs",
      "Vercel",
    ],
    links: [{ title: "Demo", url: "https://marginmatch.app/" }],
  },
  {
    type: "self",
    title: "Animelist - Discord bot",
    description:
      "A Discord bot that allows users to search for Anime, Manga, Users and Characters on AniList with unique mid-sentence command functionality.",
    imgSrc:
      "https://images.unsplash.com/photo-1552308995-2baac1ad5490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEzfHxqYXZhc2NyaXB0fGVufDB8fHx8fDE3MTkxNjQ4ODF8MA&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/animelist",
    builtWith: [
      "JavaScript",
      "Discord.js",
      "AniList API",
      "Node.js",
      "fs",
      "turndown",
      "fetch",
    ],
  },
  {
    type: "self",
    title: "Citadel",
    description:
      "An AI-powered tool that generates detailed and unique backstories for characters from the TV show Rick and Morty.",
    imgSrc:
      "https://images.unsplash.com/photo-1592564630984-7410f94db184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fHJpY2slMjBhbmQlMjBtb3J0eXxlbnwwfHx8fDE2NzM2NzA5NzE&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/citadel",
    builtWith: [
      "Next.js",
      "Next UI",
      "Node.js",
      "OpenAI",
      "DALL-E",
      "Discord.js",
      "MongoDB",
    ],
    links: [{ title: "Demo", url: "https://citadel.vercel.app" }],
  },
  {
    type: "self",
    title: "VoteWise",
    description:
      "A political web application that allows users to track their local representatives' voting records and legislation using the Congress.gov API for increased civic engagement.",
    imgSrc:
      "https://images.unsplash.com/photo-1555848962-6e79363ec58f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxwb2xpdGljYWx8ZW58MHx8fHwxNzA3MzY4MzY0fDA&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-rick/votewise",
    builtWith: ["Next.js 15", "React 19", "TypeScript", "Congress.gov API"],
  },
  {
    type: "self",
    title: "Break the Wall",
    description:
      'A transparency tool that analyzes SEC filings and corporate data to expose corporate hierarchies and executive compensation, revealing the "wall" of positions designed to protect wealth rather than create value.',
    imgSrc:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDJ8fGJ1c2luZXNzfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/break-the-wall",
    builtWith: ["Next.js", "TypeScript", "SEC EDGAR API", "D3.js", "Recharts"],
  },
  {
    type: "self",
    title: "Steam Insight",
    description:
      "Steam Insight is a modern Steam game discovery platform built with Next.js and TypeScript. Explore thousands of games with intelligent search, detailed reviews, rich media, and advanced analytics.",
    imgSrc:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHx2aWRlbyUyMGdhbWVzfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/steam-insight",
    builtWith: ["Next.js", "TypeScript", "React", "Steam API"],
  },
  {
    type: "self",
    title: "Captain's Log",
    description:
      "A voice-powered Progressive Web App inspired by One Piece and Star Trek that uses OpenAI's Whisper technology to transcribe speech into text, creating a personal digital logbook with AI-powered summarization.",
    imgSrc:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHx2b2ljZSUyMHJlY29yZGluZ3xlbnwwfHx8fDE3MDczNjgzNjR8MA&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/captains-log",
    builtWith: [
      "Next.js 14",
      "React 18",
      "shadcn/ui",
      "OpenAI Whisper API",
      "MongoDB",
      "NextAuth.js",
      "Tailwind CSS",
      "react-hook-form",
      "Zod",
    ],
  },
  {
    type: "self",
    title: "ArchGaming",
    description:
      "🎮 Transform your Arch Linux system into a gaming powerhouse with intelligent hardware detection, performance optimization, and complete gaming stack installation. Supports 8+ Arch derivatives.",
    imgSrc:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxnYW1pbmd8ZW58MHx8fHwxNzA3MzY4MzY0fDA&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/archgaming",
    builtWith: ["Bash", "Linux", "Gaming", "Automation"],
  },
  {
    type: "self",
    title: "DevSetup",
    description:
      "🚀 A cross-platform development environment setup script. Transform any Linux distro into a modern web development powerhouse with Node.js, Docker, IDEs, and more. Supports Arch, Ubuntu, Fedora, openSUSE.",
    imgSrc:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxjb2RpbmclMjBkZXZlbG9wbWVudHxlbnwwfHx8fDE3MDczNjgzNjR8MA&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/devsetup",
    builtWith: ["Shell", "Linux", "Node.js", "Docker", "Automation"],
  },
  {
    type: "self",
    title: "Dock App Demo",
    description:
      "This project showcases a MacOS-inspired Dock component built with NextJS 14's App Router and Cult/UI's libraries. It integrates Progressive Web App (PWA) functionality using @ducanh2912/next-pwa.",
    imgSrc:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfG1hY29zfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/dock-app-demo",
    builtWith: ["Next.js", "TypeScript", "PWA", "UI Components"],
  },
  {
    type: "self",
    title: "My Sidebar App",
    description:
      "This starter template demonstrates how to build a functional Next.js 14 application featuring Aceternity UI's Sidebar component. It includes dark mode support and is mobile responsive.",
    imgSrc:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHVpfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/my-sidebar-app",
    builtWith: ["Next.js", "TypeScript", "Aceternity UI", "Responsive Design"],
  },
  {
    type: "self",
    title: "Next.js Ghost Frontend",
    description:
      "Transform your Ghost-powered blog into a visual masterpiece with this state-of-the-art NextJS 14 Ghost Frontend. Built with the robust capabilities of Next.js, TypeScript, and the Aceternity UI library.",
    imgSrc:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHdlYnNpdGV8ZW58MHx8fHwxNzA3MzY4MzY0fDA&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/nextjs14-ghost-frontend",
    builtWith: ["Next.js", "TypeScript", "Ghost CMS", "Aceternity UI"],
  },
  {
    type: "self",
    title: "Next.js Pages Template",
    description:
      "A robust starter template for Next.js 13 applications featuring NextUI for UI design, MongoDB for data management, and Next-PWA for Progressive Web App capabilities.",
    imgSrc:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHRlbXBsYXRlfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/nextjs-pages-template",
    builtWith: ["Next.js", "TypeScript", "MongoDB", "NextUI", "PWA"],
  },
  {
    type: "self",
    title: "What If Anime",
    description:
      '⚡ A revolutionary platform where anime enthusiasts become architects of alternative realities. Create, vote on, and discuss compelling "what if" scenarios that reimagine your favorite anime stories with different outcomes and character arcs.',
    imgSrc:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfGFuaW1lfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000",
    repo: "https://github.com/xi-Rick/anime",
    builtWith: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
    ],
  },
];
