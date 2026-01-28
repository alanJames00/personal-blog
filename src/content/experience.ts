export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  description: string[];
};

export const timeline: ExperienceEntry[] = [
  {
    company: "SpeakX[dot]ai",
    role: "SDE Intern - Fullstack",
    period: "Mar 2025 - December 2025",
    description: [
      "Delivered features like model swapping and context tracking in the conversational AI, providing more control and context",
      "Migrated multiple services from Node.js to Golang, reducing infra costs by around 41%",
      "Complete ownership of admin dashboards, delivering internal features required for operations",
      "Rewritten the legacy PDF Gen worker with markdown-compilation based worker, saving 600% less memory and 4x less latency",
      "Owned and executed complex schema migrations across multiple services with zero downtime",
      "Contributed extensively to internal developer utilities and custom ORM frameworks, improving developer experience and maintainability."
    ]
  },
  {
    company: "SampurnaKart Technologies",
    role: "Founding Backend Engineer",
    period: "Oct 2023 - Feb 2025",
    description: [
      "Designed and owned the entire backend architecture from scratch",
      "Split the monolithic application into microservices, improving maintainability and scalability",
      "Engineered a FCM based large scale notification system for 10000+ users for promotional campaigns and other notifications",
      "Integrated whatsapp business API for user actions with core system and notification system",
    ]
  }
];

