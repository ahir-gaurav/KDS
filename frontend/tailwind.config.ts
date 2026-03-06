import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                olive: '#2F3B2F',
                cream: '#F4F1EA',
                burgundy: '#6A1F2B',
                mustard: '#D9A441',
                black: '#111111',
            },
            fontFamily: {
                clash: ['Clash Display', 'sans-serif'],
                bebas: ['Bebas Neue', 'cursive'],
                anton: ['Anton', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 12s linear infinite',
                'marquee': 'marquee 30s linear infinite',
                'marquee2': 'marquee2 30s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                marquee2: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
            },
        },
    },
    plugins: [],
}
export default config
