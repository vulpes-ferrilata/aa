const plugin = require('tailwindcss/plugin')

module.exports = {
    content: [
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            flex: {
                content: '0 1 content',
            },
            aspectRatio: {
                hex: '1/1.1547005',
                '2/3': '2/3',
                '5/6': '5/6',
            },
            minWidth: {
                '4': '1rem',
                '1/5': '20%',
                '1/2': '50%',
            },
            width: {
                "6/8": "75%",
                "7/8": "87.5%",
            },
            height: {
                "6/8": "75%",
                "1/8": "12.5%", 
            },
            padding: {
                "1/10": "10%",
            },
            boxShadow: {
                "inner-lg": "inset 0 2px 4px 0 rgb(0 0 0 / 0.1)",
            },
            translate: {
                "1/10": "10%",
            },
            keyframes: {
                "roll": {
                    "0%, 100%": {transform: "rotateX(0deg) rotateY(0deg)"},
                    "16.66%": {transform: "rotateX(-90deg) rotateY(0deg)"},
                    "33.33%": {transform: "rotateX(0deg) rotateY(90deg)"},
                    "50%": {transform: "rotateX(0deg) rotateY(-90deg)"},
                    "66.66%": {transform: "rotateX(90deg) rotateY(0deg)"},
                    "83.33%": {transform: "rotateX(0deg) rotateY(180deg)"},
                }
            },
            animation: {
                "roll": "roll 1s linear infinite",
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        plugin(function({ addBase, theme }) {
            addBase({
                'h1': { fontSize: theme('fontSize.2xl') },
                'h2': { fontSize: theme('fontSize.xl') },
                'h3': { fontSize: theme('fontSize.lg') },
            })
        })
    ],
}