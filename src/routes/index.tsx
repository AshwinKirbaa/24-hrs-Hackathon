import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TwinEval AI — AI Powered Answer Evaluation Platform" },
      {
        name: "description",
        content:
          "TwinEval AI evaluates handwritten and typed answer sheets using OCR, semantic analysis, rubric scoring and Bloom's taxonomy — with instant feedback and analytics.",
      },
      { property: "og:title", content: "TwinEval AI — AI Powered Answer Evaluation Platform" },
      {
        property: "og:description",
        content:
          "AI powered answer evaluation for students and teachers. OCR, semantic analysis, rubric scoring, Bloom's taxonomy and analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RedirectToLanding,
});

function RedirectToLanding() {
  useEffect(() => {
    window.location.replace("/landing.html");
  }, []);
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0e1a",
        color: "#e8ecf5",
        fontFamily: "Poppins, system-ui, sans-serif",
      }}
    >
      Loading TwinEval AI…
    </div>
  );
}
