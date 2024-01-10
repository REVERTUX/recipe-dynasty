import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { withUt } from 'uploadthing/tw';

export default withUt({
  content: [
    './src/**/*.tsx',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
    require('@tailwindcss/typography'),
  ],
}) satisfies Config;
