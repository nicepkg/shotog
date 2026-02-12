import type { OGImageParams } from "../types";

/**
 * Testimonial template — quote/review style
 * Good for: customer quotes, reviews, testimonials, social proof
 */
export function testimonialTemplate(params: OGImageParams) {
  const bgColor = params.bgColor || "#fffbeb";
  const accentColor = params.accentColor || "#f59e0b";
  const textColor = params.textColor || "#1c1917";

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
        padding: "70px 80px",
        justifyContent: "space-between",
      },
      children: [
        // Big quote mark
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: "120px",
              fontWeight: 700,
              color: accentColor,
              lineHeight: 0.8,
              opacity: 0.3,
            },
            children: "\u201C",
          },
        },
        // Quote text (title = the quote)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              marginTop: "-20px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: params.title.length > 80 ? "32px" : params.title.length > 50 ? "38px" : "44px",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    maxWidth: "950px",
                    fontStyle: "italic",
                  },
                  children: params.title,
                },
              },
            ],
          },
        },
        // Author info
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
            children: [
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
                            width: 48,
                            height: 48,
                            style: {
                              borderRadius: "50%",
                              marginRight: "16px",
                            },
                          },
                        }
                      : {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              background: `linear-gradient(135deg, ${accentColor}, #d97706)`,
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#ffffff",
                              marginRight: "16px",
                            },
                            children: (params.author || "A").charAt(0).toUpperCase(),
                          },
                        },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                        },
                        children: [
                          params.author
                            ? {
                                type: "div",
                                props: {
                                  style: {
                                    fontSize: "20px",
                                    fontWeight: 700,
                                  },
                                  children: params.author,
                                },
                              }
                            : null,
                          params.subtitle
                            ? {
                                type: "div",
                                props: {
                                  style: {
                                    fontSize: "16px",
                                    opacity: 0.6,
                                    marginTop: "2px",
                                  },
                                  children: params.subtitle,
                                },
                              }
                            : null,
                        ].filter(Boolean),
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: "14px",
                    opacity: 0.3,
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
