import type { Config } from "tailwindcss";

import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {},
  plugins: [require("tailwindcss-bg-patterns")],
};
