/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'xs': '360px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px',
			},
		},
		extend: {
      screens: {
        'xs': '360px',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 4px)',
				sm: 'calc(var(--radius) - 8px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
        'gummy-btn-hover-sm': {
          '0%': { transform: 'scale(1)', borderRadius: '20px' },
          '40%': { transform: 'scale(1.1, 0.9)', borderRadius: '30px' },
          '60%': { transform: 'scale(0.95, 1.05)', borderRadius: '25px 15px' },
          '100%': { transform: 'scale(1)', borderRadius: '20px' },
        },
        'gummy-btn-press-sm': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.9)', borderRadius: '40px' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'gummy-btn-hover-sm': 'gummy-btn-hover-sm 0.5s linear',
        'gummy-btn-press-sm': 'gummy-btn-press-sm 0.3s linear',
        'pulse': 'pulse 4s linear infinite',
			},
      transitionTimingFunction: {
        'ease-squish': 'cubic-bezier(0.2, 1, 0.2, 1)',
      }
		},
	},
	plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/aspect-ratio'),
  ],
};