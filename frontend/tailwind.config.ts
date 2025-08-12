import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sprinkle-pink': '#FF6B9E',
        'sprinkle-teal': '#4ECDC4',
        'sprinkle-yellow': '#FFDD3D',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'sprinkle-bg': 'linear-gradient(135deg, rgba(255, 107, 158, 0.2), rgba(78, 205, 196, 0.2))',
      },
    },
  },
  plugins: [],
};
export default config;