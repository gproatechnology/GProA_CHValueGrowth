/**
 * PostCSS Configuration for CHValueGrowth
 * 
 * This configuration processes CSS with:
 * - Tailwind CSS: Utility-first CSS framework
 * - Autoprefixer: Adds vendor prefixes automatically
 * - CSSNano (optional): Minifies CSS in production
 */

// Detect if we're in production mode (you can also use process.env.NODE_ENV)
const isProduction = process.env.NODE_ENV === 'production';

export default {
    plugins: {
        // Tailwind CSS - must come first to generate utilities
        tailwindcss: {},

        // Autoprefixer - adds vendor prefixes (e.g., -webkit-, -moz-)
        autoprefixer: {},

        // CSSNano - minify CSS for production (optional but recommended)
        // Uncomment the following block if you want minification in production
        // ...(isProduction && {
        //   cssnano: {
        //     preset: [
        //       'default',
        //       {
        //         // Preserve comments that start with "/*!" (useful for licenses)
        //         discardComments: { removeAll: !/^!/ },
        //         // Optimize z-indexes (can be disabled if causing issues)
        //         zindex: false,
        //       },
        //     ],
        //   },
        // }),
    },
};