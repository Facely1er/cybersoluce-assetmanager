import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html when ANALYZE=true
    process.env.ANALYZE === 'true' && visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // treemap, sunburst, network
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    // Inject environment variables
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react/jsx-runtime',
      '@supabase/supabase-js',
      'react-hot-toast',
      'date-fns',
      'lucide-react',
      'recharts',
      '@nivo/core',
      '@nivo/heatmap',
      '@nivo/radar'
    ],
    // Exclude heavy libraries from pre-bundling to enable better code splitting
    exclude: [
      'xlsx',
      'jspdf', 
      'html2canvas'
    ],
    // Vite 5 automatically handles deduplication of React and React-dependent libraries
    // This prevents multiple React instances which causes '__SECRET_INTERNALS' errors
    esbuildOptions: {
      // Additional esbuild options can be added here
    },
  },
  esbuild: {
    // Remove console and debugger in production (terser will handle console removal)
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
    // Optimize for production
    legalComments: process.env.NODE_ENV === 'production' ? 'none' : 'inline',
    treeShaking: true,
  },
  build: {
    // Enable source maps only in development
    sourcemap: process.env.NODE_ENV !== 'production',
    // Use esbuild minification (safer than terser, less likely to cause initialization issues)
    // If issues persist, can switch to 'terser' with very conservative settings
    minify: 'esbuild', // Changed from 'terser' to avoid "Cannot access before initialization" errors
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info'] : [],
        // Reduced aggressiveness to prevent property access issues
        passes: 1,
        // Disable unsafe options that can break property access
        unsafe: false,
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
        // Disable hoisting to prevent "Cannot access before initialization" errors
        hoist_funs: false,
        hoist_vars: false,
        // Disable dead code elimination that might cause initialization issues
        dead_code: false,
      },
      mangle: {
        // Disable ALL mangling to prevent initialization order issues
        // This is the safest option to prevent "Cannot access 'i' before initialization" errors
        reserved: ['i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        // Disable property mangling to prevent "Cannot read properties" errors
        properties: false,
        // Keep function names to prevent initialization order issues
        keep_classnames: true,
        keep_fnames: true,
        // Don't mangle top-level names to avoid circular dependency issues
        toplevel: false,
      },
      format: {
        // Preserve comments for better debugging
        comments: false,
      }
    },
    // Enhanced bundle optimization
    rollupOptions: {
      output: {
        // CRITICAL FIX: Disable manual chunking for ALL node_modules
        // This prevents React from being split into vendor chunk, which causes
        // "Cannot read properties of undefined (reading 'createContext')" errors
        // All node_modules will stay in main bundle, only our source code is split
        manualChunks: (id: string) => {
          // ONLY split our own source code - keep ALL node_modules in main bundle
          // This ensures React and all dependencies load together synchronously
          
          if (id.includes('/src/components/reports/')) {
            return 'reports';
          }
          if (id.includes('/src/components/compliance/')) {
            return 'compliance';
          }
          if (id.includes('/src/components/vulnerabilities/')) {
            return 'vulnerabilities';
          }
          if (id.includes('/src/components/organizations/')) {
            return 'organizations';
          }
          if (id.includes('/src/components/privacy/')) {
            return 'privacy';
          }
          if (id.includes('/src/components/protection/')) {
            return 'protection';
          }
          if (id.includes('/src/components/dependencies/')) {
            return 'dependencies';
          }
          
          // Keep everything else (including ALL node_modules) in main bundle
          return undefined;
        },
        // Optimize asset filenames
        assetFileNames: (assetInfo: { name?: string }) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`;
          }
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `styles/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // Optimize chunk file names
        chunkFileNames: 'js/[name]-[hash].js',
        // Optimize entry file names
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    // Reduce chunk size warning limit for better performance
    chunkSizeWarningLimit: 500,
    // Target modern browsers for smaller bundle
    target: 'esnext',
    // CSS code splitting
    cssCodeSplit: true,
    // Improve tree shaking
    modulePreload: {
      polyfill: false
    },
    // Report compressed size
    reportCompressedSize: true,
    // Copy public assets
    copyPublicDir: true,
    // Empty output directory before build
    emptyOutDir: true,
  },
  // Enhanced development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    cors: true,
    hmr: {
      overlay: false, // Disable error overlay in development
    },
    // Proxy configuration for development
    proxy: {},
  },
  preview: {
    port: 4173,
    cors: true
  },
  // CSS preprocessing
  css: {
    devSourcemap: true,
  }
});