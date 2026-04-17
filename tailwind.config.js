import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    50:  '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',   // naranja principal
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                navy: {
                    50:  '#f0f4ff',
                    100: '#dce5ff',
                    200: '#b3c4ff',
                    300: '#7a96fa',
                    400: '#4d6ef5',
                    500: '#2a4ae8',
                    600: '#1c35cc',
                    700: '#1a2ea6',
                    800: '#1a2a7f',  // azul oscuro principal
                    900: '#111b52',
                    950: '#0a1035',
                },
            },
        },
    },

    plugins: [forms],
};
