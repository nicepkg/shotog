import type { OGImageParams } from "../types";

/**
 * Product template — bold left-aligned with accent bar
 * Good for: SaaS products, feature pages, launch announcements
 */
export function productTemplate(params: OGImageParams) {
  const bgColor = params.bgColor || "#ffffff";
  const textColor = params.textColor || "#0f172a";
  const accentColor = params.accentColor || "#6366f1";

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        background: bgColor,
        fontFamily: "Inter",
        color: textColor,
      },
      children: [
        // Left accent bar
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "8px",
              height: "100%",
              background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}88 100%)`,
            },
            children: [],
          },
        },
        // Content area
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px 70px",
              flex: 1,
            },
            children: [
              // Eyebrow
              params.eyebrow
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: accentColor,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        marginBottom: "20px",
                      },
                      children: params.eyebrow,
                    },
                  }
                : null,
              // Title
              {
                type: "div",
                props: {
                  style: {
                    fontSize: params.title.length > 40 ? "48px" : "60px",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.03em",
                    maxWidth: "900px",
                  },
                  children: params.title,
                },
              },
              // Subtitle
              params.subtitle
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "24px",
                        marginTop: "20px",
                        opacity: 0.6,
                        lineHeight: 1.4,
                        maxWidth: "700px",
                      },
                      children: params.subtitle,
                    },
                  }
                : null,
              // Domain watermark
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    marginTop: "auto",
                    paddingTop: "40px",
                    fontSize: "18px",
                    opacity: 0.4,
                  },
                  children: params.domain || "shotog.com",
                },
              },
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}
