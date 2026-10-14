import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        panel: "#141414",
        line: "#262626",
        bone: "#F2F0EA",
        mute: "#9a9890",
        lime: "#C6FF00",
        // admin theme tokens (switch via .admin / .admin.light in globals.css)
        a: {
          bg: "var(--a-bg)",
          panel: "var(--a-panel)",
          raise: "var(--a-raise)",
          line: "var(--a-line)",
          text: "var(--a-text)",
          mute: "var(--a-mute)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
