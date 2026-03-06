/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                olive: '#2F3B2F',
                cream: '#F4F1EA',
                burgundy: '#6A1F2B',
                mustard: '#D9A441',
            },
        },
    },
    plugins: [],
}
