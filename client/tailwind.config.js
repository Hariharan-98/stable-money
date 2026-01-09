/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Deep space backgrounds
                'space': {
                    950: '#020617',
                    900: '#0f172a',
                    800: '#1e293b',
                },
                // Neon accents - Enhanced with brighter variants
                'neon': {
                    cyan: '#06b6d4',
                    'cyan-light': '#22d3ee',
                    purple: '#8b5cf6',
                    'purple-light': '#a78bfa',
                    pink: '#ec4899',
                    'pink-light': '#f472b6',
                    magenta: '#d946ef',
                    amber: '#f59e0b',
                    green: '#10b981',
                    blue: '#3b82f6',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-pink-purple': 'linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #8b5cf6 100%)',
                'gradient-cyan-blue': 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
                'gradient-purple-pink': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)',
                'gradient-cyan-purple': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
                'blob': 'blob 7s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.5), 0 0 10px rgba(6, 182, 212, 0.3)' },
                    '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 30px rgba(6, 182, 212, 0.5)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                blob: {
                    '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
