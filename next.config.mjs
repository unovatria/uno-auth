/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;


/*
On consumer projects you have to add: (Projects that use this project as module)

/// next.config.js

const path = require('path');

module.exports = {
  transpilePackages: ['your-package-name'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'node_modules/your-package-name/dist'),
    };
    return config;
  },
};

/// next.config.mjs

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} / <-- ADD "*" in here when in use.
const nextConfig = {
  transpilePackages: ['your-package-name'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'node_modules/your-package-name/dist'),
    };
    return config;
  },
};

export default nextConfig;

*/