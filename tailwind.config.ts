import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        dejavuSans: ["var(--font-dejavu-sans)", "sans-serif"],
        notoSansGeoSemi: [
          "var(--font-notoSansGeorigan-SemiCondensed)",
          "sans-serif",
        ],
        inder: ["var(--font-inder)", "sans-serif"],
        notoSansGeo: ["var(--font-notoSansGeorgian)", "sans-serif"],
        darkerGrotesque: ["var(--font-darkerGrotesque)", "sans-serif"],
      },
      screens: {
        sm: '768px',
        md: '1024px',
      }
    },
  },
  plugins: [],
} satisfies Config;
