/*
  All the text on the site comes from this file.
  Edit it, save, and the page updates.

  `icon` values must match a key in src/lib/icons.js.
*/

export const settings = {
  // Play the dot-to-name intro on the first visit of each browser session.
  isIntro: true,
  // Draw the particle portrait on the home screen. false = dust only.
  portrait: true,
};

export const seo = {
  title: "Alamuri Adamu | Java Developer",
  description:
    "Alamuri Adamu is a Java developer from Ongole, Andhra Pradesh. Spring Boot, Spring Security, MySQL and REST APIs, with tests and CI.",
};

export const greeting = {
  name: "Alamuri Adamu",
  // The short name shown in the intro and the top bar.
  displayName: "Adamu",
  // The intro draws this word first, then morphs it into `heroWord`.
  // If it contains an "I", the dot lands there; otherwise the dot becomes an underline.
  introWord: "ADAMU",
  heroWord: "PORTFOLIO",
  roleBold: "Java",
  roleItalic: "Developer",
  resumeLink: "/Alamuri_Adamu_Resume.pdf",
};

export const nav = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Play", id: "play" },
  { label: "Contact", id: "contact" },
];

export const about = {
  title: "Intro",
  text: "I'm a Java developer from Ongole, Andhra Pradesh. I build REST APIs with Spring Boot and MySQL, secure them with Spring Security and JWT, and cover them with tests. I benchmarked TypeQuest's live API and cut one endpoint from about 2.2 s to 0.3 s. I finished a B.Tech in Computer Science with a CGPA of 8.03, and I'm looking for my first Java developer role.",
};

export const path = [
  {
    when: "2023 – 2026",
    title: "B.Tech in Computer Science and Engineering",
    where: "University College of Engineering Narasaraopet (JNTUK)",
    note: "CGPA 8.03 / 10. Class Representative in the 3-1 semester.",
  },
  {
    when: "Jul 2022 – Jan 2023",
    title: "Front-End Developer Intern",
    where: "KKCC Info Systems, Ongole",
    note: "Diploma industrial training: HTML, CSS, Bootstrap, basic JavaScript, static websites.",
  },
  {
    when: "2020 – 2023",
    title: "Diploma in Computer Engineering",
    where: "SBTET Board",
    note: "Scored 92.42%.",
  },
  {
    when: "2020",
    title: "Class X (SSC)",
    where: "BSEAP",
    note: "Scored 99.5%.",
  },
];

export const pathExtras = [
  { term: "Certification", detail: "Databases for Developers: Foundations, Oracle Dev Gym" },
  { term: "Languages", detail: "Telugu, English, Hindi" },
  { term: "Sports", detail: "Gold medal in shot put at the college annual day" },
];

/* Skills: the numbered list. */
export const skillsSection = { title: "What I can do" };

export const skills = [
  {
    title: "REST APIs with Spring Boot",
    detail:
      "Layered Spring Boot services with Spring Data JPA and Hibernate, on top of solid Core Java: OOP, collections, exception handling, File I/O and serialization.",
    tools: [
      { name: "Java", icon: "openjdk" },
      { name: "Spring Boot", icon: "springboot" },
      { name: "Spring", icon: "spring" },
      { name: "Hibernate", icon: "hibernate" },
      { name: "Maven", icon: "apachemaven" },
    ],
  },
  {
    title: "Authentication and security",
    detail:
      "Spring Security with JWT, BCrypt, refresh-token rotation and role-based access. On TypeQuest that includes lockout after 5 failed logins and per-IP rate limiting.",
    tools: [
      { name: "Spring Security", icon: "spring" },
      { name: "JWT", icon: "springboot" },
    ],
  },
  {
    title: "MySQL design and query tuning",
    detail:
      "Schema design with JPA and Flyway migrations, indexes, and EXPLAIN-based tuning. I cut one live endpoint from about 2.2 s to 0.3 s.",
    tools: [{ name: "MySQL", icon: "mysql" }],
  },
  {
    title: "Testing and CI",
    detail:
      "223 automated tests across two projects with JUnit 5, Mockito and Vitest. GitHub Actions runs them on every push, and Docker images ship the build.",
    tools: [
      { name: "JUnit 5", icon: "junit5" },
      { name: "Vitest", icon: "vitest" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Docker", icon: "docker" },
    ],
  },
  {
    title: "React front ends and deployment",
    detail:
      "React, React Router, Vite and Bootstrap for the front ends of my projects. Deployed on Vercel, Render and Aiven.",
    tools: [
      { name: "React", icon: "react" },
      { name: "Vite", icon: "vite" },
      { name: "Bootstrap", icon: "bootstrap" },
      { name: "JavaScript", icon: "javascript" },
    ],
  },
];

/* The tilted word ticker above the skills list. */
export const tickerWords = [
  ["Java", "Spring Boot", "Spring Security", "JWT", "Hibernate", "JPA", "Maven", "REST APIs", "BCrypt", "Core Java", "OOP"],
  ["MySQL", "Flyway", "Indexing", "EXPLAIN", "Schema design", "JUnit 5", "Mockito", "Vitest", "Spring Boot Test"],
  ["React", "React Router", "Vite", "Bootstrap", "HTML5", "CSS3", "JavaScript", "Git", "GitHub Actions", "Docker", "IntelliJ IDEA", "Vercel", "Render", "Aiven"],
];

export const projectsSection = { title: "Selected work" };

/*
  `image` is optional. Put a screenshot in public/projects/ and set
  image: "/projects/typequest.png" to show it on the laptop screen.
  Without it the screen shows the project's numbers.
*/
export const projects = [
  {
    id: "typequest",
    title: "TypeQuest",
    italic: "Typing tutor",
    note: "Full-stack, secured, deployed",
    description:
      "A typing tutor with 26 lessons, five games, XP and a leaderboard. The API is stateless and secured with Spring Security and JWT: refresh-token rotation, lockout after 5 failed logins and per-IP rate limiting. I benchmarked the live API and moved one endpoint from about 2.2 s to 0.3 s.",
    metrics: [
      { value: "110", label: "automated tests" },
      { value: "2.2 → 0.3 s", label: "latency on /api/lessons" },
    ],
    tools: [
      { name: "Java", icon: "openjdk" },
      { name: "Spring Boot", icon: "springboot" },
      { name: "MySQL", icon: "mysql" },
      { name: "React", icon: "react" },
      { name: "Docker", icon: "docker" },
      { name: "GitHub Actions", icon: "githubactions" },
    ],
    links: [
      { label: "Live demo", href: "https://typequest-adam.vercel.app/", primary: true },
      { label: "Source", href: "https://github.com/Adam-104/typequest", icon: "github" },
    ],
  },
  {
    id: "mysql-query-debugger",
    title: "MySQL",
    italic: "Query Debugger",
    note: "EXPLAIN-based, sandboxed",
    description:
      "Explains how MySQL runs a query without executing it: a visual plan, findings and CREATE INDEX suggestions. A before and after index comparison runs in temporary sandbox schemas that are dropped after every request, and unsafe input is blocked.",
    metrics: [
      { value: "58", label: "JUnit tests" },
      { value: "55", label: "Vitest tests" },
    ],
    tools: [
      { name: "Java", icon: "openjdk" },
      { name: "Spring Boot", icon: "springboot" },
      { name: "MySQL", icon: "mysql" },
      { name: "React", icon: "react" },
      { name: "Docker", icon: "docker" },
      { name: "GitHub Actions", icon: "githubactions" },
    ],
    links: [
      { label: "Live demo", href: "https://my-sql-debugger.vercel.app/", primary: true },
      { label: "Source", href: "https://github.com/Adam-104/MySQL-debugger", icon: "github" },
    ],
  },
  {
    id: "banking-management-system",
    title: "Banking",
    italic: "Management System",
    note: "Core Java, layered",
    description:
      "A layered console banking app with customer and admin roles, deposits, withdrawals, transfers, transaction history and report export. Built with abstraction, inheritance, interfaces and custom checked exceptions, and saved with Java serialization.",
    metrics: [
      { value: "3", label: "failed PIN attempts lock the account" },
      { value: "2", label: "roles: customer and admin" },
    ],
    tools: [
      { name: "Core Java", icon: "openjdk" },
      { name: "Maven", icon: "apachemaven" },
    ],
    links: [
      {
        label: "Source",
        href: "https://github.com/Adam-104/Banking-Management-System-CoreJava",
        icon: "github",
        primary: true,
      },
    ],
  },
];

export const play = {
  title: "Break it if you can",
  hint: "Move your mouse, drag, or use the arrow keys. Click or press space to launch the ball.",
  lines: ["JAVA THAT", "SHIPS"],
};

export const contact = {
  titleStart: "Let's build",
  titleItalic: "reliable",
  titleEnd: "backends.",
  intro:
    "If you have a Java developer opening, write to me. Email is the fastest way to reach me.",
  email: "alamuriadam300@gmail.com",
  phone: "+91 84990 88513",
  phoneHref: "tel:+918499088513",
  location: "Ongole, Andhra Pradesh, India",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Ongole,Andhra+Pradesh",
  links: [
    { name: "GitHub", value: "Adam-104", href: "https://github.com/Adam-104", icon: "github" },
    {
      name: "LinkedIn",
      value: "alamuriadam",
      href: "https://www.linkedin.com/in/alamuriadam",
      icon: "linkedin",
    },
  ],
};
