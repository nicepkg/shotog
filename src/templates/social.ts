import type { OGImageParams } from "../types";

/**
 * Social template — vibrant card for social media posts
 * Good for: Twitter/X cards, social media announcements, community posts
 */
export function socialTemplate(params: OGImageParams) {
  const bgColor = params.bgColor || "#1a1a2e";
  const accentColor = params.accentColor || "#e94560";
  const textColor = params.textColor || "#ffffff";

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "1200px",
        height: "630px",
        background: bgColor,
        fontFamily: "Inter",
        color: textColor,
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Decorative circles
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: `${accentColor}22`,
            },
            children: [],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              position: "absolute",
              bottom: "-80px",
              left: "-80px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: `${accentColor}15`,
            },
            children: [],
          },
        },
        // Content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "70px 80px",
              flex: 1,
              zIndex: 1,
            },
            children: [
              params.eyebrow
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "24px",
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              width: "40px",
                              height: "4px",
                              background: accentColor,
                              marginRight: "12px",
                            },
                            children: [],
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "18px",
                              fontWeight: 600,
                              color: accentColor,
                              textTransform: "uppercase",
                              letterSpacing: "2px",
                            },
                            children: params.eyebrow,
                          },
                        },
                      ],
                    },
                  }
                : null,
              {
                type: "div",
                props: {
                  style: {
                    fontSize: params.title.length > 40 ? "48px" : "56px",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    maxWidth: "800px",
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
                        marginTop: "20px",
                        opacity: 0.7,
                        lineHeight: 1.5,
                        maxWidth: "650px",
                      },
                      children: params.subtitle,
                    },
                  }
                : null,
              // Author line
              params.author
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        marginTop: "32px",
                      },
                      children: [
                        params._avatarDataUri
                          ? {
                              type: "img",
                              props: {
                                src: params._avatarDataUri,
                                width: 36,
                                height: 36,
                                style: {
                                  borderRadius: "50%",
                                  marginRight: "12px",
                                },
                              },
                            }
                          : {
                              type: "div",
                              props: {
                                style: {
                                  display: "flex",
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: accentColor,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  marginRight: "12px",
                                },
                                children: params.author.charAt(0).toUpperCase(),
                              },
                            },
                        {
                          type: "div",
                          props: {
                            style: { fontSize: "18px", fontWeight: 600 },
                            children: params.author,
                          },
                        },
                      ],
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Bottom bar
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              height: "6px",
              background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}00 100%)`,
            },
            children: [],
          },
        },
      ],
    },
  };
}
