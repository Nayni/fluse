module.exports = {
  title: "Fluse",
  tagline: "Build composable and type-safe fixtures.",
  url: "https://nayni.github.io/fluse",
  baseUrl: "/fluse/",
  favicon: "img/favicon.ico",
  organizationName: "nayni",
  projectName: "fluse",
  themeConfig: {
    sidebarCollapsible: false,
    prism: {
      theme: require("prism-react-renderer/themes/github"),
      darkTheme: require("prism-react-renderer/themes/dracula"),
    },
    navbar: {
      title: "Fluse",
      logo: {
        alt: "Fluse Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/Nayni/fluse",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Quickstart",
              to: "docs/quickstart",
            },
            {
              label: "Introduction",
              to: "docs/introduction",
            },
          ],
        },
        {
          title: "Social",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/Nayni/fluse",
            },
          ],
        },
        {
          title: "Built with",
          items: [
            {
              label: "Docusaurus",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Rutger Hendrickx.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/Nayni/fluse/edit/master/website/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
