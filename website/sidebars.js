module.exports = {
  docs: [
    {
      type: "category",
      label: "Getting Started",
      items: ["quickstart", "introduction"],
    },
    {
      type: "category",
      label: "Fundamentals",
      items: [
        "initialize",
        "define-fixture",
        "execute",
        "supplying-arguments",
        "making-lists",
        "combining-fixtures",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: ["api-fluse", "api-fixture", "api-combine", "api-execute"],
    },
    {
      type: "category",
      label: "Plugins",
      items: [
        "plugin-introduction",
        "create-plugin",
        {
          type: "category",
          label: "Official plugins",
          items: ["plugin-faker", "plugin-typeorm", "plugin-slonik"],
        },
      ],
    },
  ],
};
