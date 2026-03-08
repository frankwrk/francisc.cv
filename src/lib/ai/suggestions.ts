import type { AssistantRouteContext } from "@/lib/ai/types";

const STATELESS_PROMPT_CHIPS = [
  "How do I approach my work?",
  "What evidence supports my positioning?",
  "Why am I a fit for platform-heavy roles?",
  "What kind of roles am I aiming for?",
  "Which projects best reflect how I think?",
] as const;

function getSlug(pathname: string) {
  return pathname.split("/").filter(Boolean)[1];
}

export function resolveAssistantRouteContext(
  pathname: string,
  title?: string,
): AssistantRouteContext {
  if (pathname === "/") {
    return { pathname, title, routeType: "home" };
  }

  if (pathname === "/about") {
    return { pathname, title, routeType: "about" };
  }

  if (pathname === "/now") {
    return { pathname, title, routeType: "now" };
  }

  if (pathname === "/resume") {
    return { pathname, title, routeType: "resume" };
  }

  if (pathname === "/work") {
    return { pathname, title, routeType: "work-index" };
  }

  if (pathname.startsWith("/work/")) {
    return {
      pathname,
      title,
      routeType: "work-detail",
      slug: getSlug(pathname),
    };
  }

  if (pathname === "/thinking") {
    return { pathname, title, routeType: "thinking-index" };
  }

  if (pathname.startsWith("/thinking/")) {
    return {
      pathname,
      title,
      routeType: "thinking-detail",
      slug: getSlug(pathname),
    };
  }

  return { pathname, title, routeType: "other" };
}

export function getSuggestedQuestions(context: AssistantRouteContext) {
  switch (context.routeType) {
    case "home":
      return [...STATELESS_PROMPT_CHIPS];
    case "about":
      return [...STATELESS_PROMPT_CHIPS];
    case "now":
      return [...STATELESS_PROMPT_CHIPS];
    case "resume":
      return [...STATELESS_PROMPT_CHIPS];
    case "work-index":
      return [...STATELESS_PROMPT_CHIPS];
    case "work-detail":
      return [...STATELESS_PROMPT_CHIPS];
    case "thinking-index":
      return [...STATELESS_PROMPT_CHIPS];
    case "thinking-detail":
      return [...STATELESS_PROMPT_CHIPS];
    default:
      return [...STATELESS_PROMPT_CHIPS];
  }
}

export function buildRouteHint(context: AssistantRouteContext) {
  switch (context.routeType) {
    case "resume":
      return "The visitor is on the resume page. Favor recruiter-readable synthesis and role-fit framing.";
    case "work-detail":
      return `The visitor is on a work detail page${context.slug ? ` for ${context.slug}` : ""}. When relevant, start from that project before broadening out.`;
    case "work-index":
      return "The visitor is browsing the work index. Favor case-study comparisons and evidence of delivery judgment.";
    case "thinking-detail":
      return `The visitor is on a thinking article${context.slug ? ` for ${context.slug}` : ""}. Favor idea-level synthesis anchored to the current article.`;
    case "thinking-index":
      return "The visitor is browsing the thinking index. Favor themes, patterns, and how the writing supports professional fit.";
    case "about":
      return "The visitor is on the about page. Favor background, method, and scope of work.";
    case "now":
      return "The visitor is on the now page. Favor current direction and active priorities.";
    default:
      return "The visitor is on a general portfolio page. Favor broad orientation and portfolio-level synthesis.";
  }
}
