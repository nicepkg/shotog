import type { OGImageParams } from "../types";

/**
 * Blog template — article-style with author info
 * Good for: blog posts, articles, documentation
 */
export function blogTemplate(params: OGImageParams) {
  const bgColor = params.bgColor || "#0f172a";
  const textColor = params.textColor || "#f8fafc";
  const accentColor = params.accentColor || "#3b82f6";

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "1200px",
        height: "630px",
        background: bgColor,
        fontFamily: "Inter",
        color: textColor,
        padding: "60px 70px",
      },
      children: [
        // Top: Eyebrow / category
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    background: accentColor,
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#ffffff",
                  },
                  children: params.eyebrow || "Blog",
                },
              },
            ],
          },
        },
        // Middle: Title + Subtitle
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              maxWidth: "900px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: params.title.length > 50 ? "42px" : "52px",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                  },
                  children: params.title,
                },
              },
              params.subtitle
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "24px",
                        marginTop: "16px",
                        opacity: 0.7,
                        lineHeight: 1.4,
                      },
                      children: params.subtitle,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Bottom: Author + domain
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            },
            children: [
              // Author
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                  },
                  children: [
                    params._avatarDataUri
                      ? {
                          type: "img",
                          props: {
                            src: params._avatarDataUri,
                            width: 40,
                            height: 40,
                            style: {
                              borderRadius: "50%",
                              marginRight: "12px",
                            },
                          },
                        }
                      : null,
                    params.author
                      ? {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "20px",
                              fontWeight: 600,
                            },
                            children: params.author,
                          },
                        }
                      : null,
                  ].filter(Boolean),
                },
              },
              // Domain
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: "18px",
                    opacity: 0.5,
                  },
                  children: params.domain || "shotog.com",
                },
              },
            ],
          },
        },
      ],
    },
  };
}
