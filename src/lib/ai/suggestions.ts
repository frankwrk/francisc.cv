import type { AssistantRouteContext } from "@/lib/ai/types";

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
      return [
        "What kind of roles is Francisc aiming for?",
        "How does his work connect AI adoption with operations?",
        "Which projects best show product judgment?",
        "What does this site suggest about how he handles ambiguity?",
      ];
    case "about":
      return [
        "How does Francisc describe the way he works?",
        "What evidence supports his positioning across product and systems work?",
        "Which parts of his background are most relevant for platform-heavy roles?",
      ];
    case "now":
      return [
        "What is Francisc focused on right now?",
        "How does his current direction connect to AI adoption work?",
        "What is he actively trying to improve in his process?",
      ];
    case "resume":
      return [
        "Which parts of Francisc’s experience fit a TPM role best?",
        "How does his engineering background influence his product work?",
        "What does the resume suggest about his strengths in ambiguous environments?",
      ];
    case "work-index":
      return [
        "Which case study best demonstrates cross-functional judgment?",
        "What themes connect these projects?",
        "Which project is most relevant for workflow-heavy product roles?",
      ];
    case "work-detail":
      return [
        `What problem was this project solving?`,
        `What does this project show about Francisc’s working style?`,
        `How does this case study support his positioning for product and systems work?`,
      ];
    case "thinking-index":
      return [
        "What themes show up most often in Francisc’s writing?",
        "Which article best explains how he thinks about systems work?",
        "How does the writing support his portfolio positioning?",
      ];
    case "thinking-detail":
      return [
        "What is the core argument of this piece?",
        "How does this article connect to Francisc’s project work?",
        "What does this piece reveal about how he frames trade-offs?",
      ];
    default:
      return [
        "What kind of work is Francisc trying to be hired for?",
        "Which portfolio pieces best demonstrate evidence-backed judgment?",
        "How should I read this portfolio if I’m evaluating for fit?",
      ];
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
