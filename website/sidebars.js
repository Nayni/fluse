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
        "lists",
        "scenarios",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: ["api-fluse", "api-fixture", "api-scenario"],
    },
    {
      type: "category",
      label: "Plugins",
      items: [
        "plugins-introduction",
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
