import type { OGImageParams } from "../types";

/**
 * Basic template — clean gradient background with title/subtitle
 * Good for: general pages, landing pages, social sharing
 */
export function basicTemplate(params: OGImageParams) {
  const bgColor = params.bgColor || "#667eea";
  const accentColor = params.accentColor || "#764ba2";
  const textColor = params.textColor || "#ffffff";

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "1200px",
        height: "630px",
        background: `linear-gradient(135deg, ${bgColor} 0%, ${accentColor} 100%)`,
        fontFamily: "Inter",
        color: textColor,
        padding: "60px",
      },
      children: [
        // Main content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              maxWidth: "1000px",
            },
            children: [
              params._logoDataUri
                ? {
                    type: "img",
                    props: {
                      src: params._logoDataUri,
                      height: 48,
                      style: {
                        marginBottom: "24px",
                      },
                    },
                  }
                : null,
              params.eyebrow
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "20px",
                        fontWeight: 400,
                        opacity: 0.8,
                        textTransform: "uppercase",
                        letterSpacing: "3px",
                        marginBottom: "16px",
                      },
                      children: params.eyebrow,
                    },
                  }
                : null,
              {
                type: "div",
                props: {
                  style: {
                    fontSize: params.title.length > 40 ? "48px" : "64px",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  },
                  children: params.title,
                },
              },
              params.subtitle
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "28px",
                        marginTop: "20px",
                        opacity: 0.85,
                        lineHeight: 1.4,
                      },
                      children: params.subtitle,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Watermark
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              position: "absolute",
              bottom: "30px",
              right: "40px",
              fontSize: "16px",
              opacity: 0.5,
            },
            children: params.domain || "shotog.com",
          },
        },
      ],
    },
  };
}
