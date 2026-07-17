import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/sanitized_policies/*.html",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dull: "var(--dull)",
        category0: "var(--category0)",
        category1: "var(--category1)",
        category2: "var(--category2)",
        category3: "var(--category3)",
        category4: "var(--category4)",
        category5: "var(--category5)",
        category6: "var(--category6)",
        category7: "var(--category7)",
        category8: "var(--category8)",
        category9: "var(--category9)",
      },
    },
  },
  plugins: [],
} satisfies Config;
