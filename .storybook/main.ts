import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/nextjs-vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(dirname, '../src');
const publicDir = path.resolve(dirname, '../public');
const stylesDir = path.resolve(dirname, '../src/styles');

/** Normalize Windows paths for Vite virtual next/image modules */
function toVitePath(p: string) {
  return p.split(path.sep).join('/');
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
  ],

  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },

  staticDirs: ['../public'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  async viteFinal(config) {
    config.resolve = config.resolve ?? {};
    const existingAlias = config.resolve.alias;
    const aliasList = Array.isArray(existingAlias)
      ? [...existingAlias]
      : existingAlias
        ? Object.entries(existingAlias).map(([find, replacement]) => ({ find, replacement }))
        : [];

    aliasList.push(
      { find: '@', replacement: toVitePath(srcDir) },
      { find: '#public', replacement: toVitePath(publicDir) },
    );
    config.resolve.alias = aliasList;

    config.css = {
      ...config.css,
      preprocessorOptions: {
        ...config.css?.preprocessorOptions,
        scss: {
          ...config.css?.preprocessorOptions?.scss,
          loadPaths: [stylesDir],
          includePaths: [stylesDir],
        },
      },
    };

    // lightningcss minify rejects some Sass-generated pseudo-element selectors
    config.build = {
      ...config.build,
      cssMinify: false,
    };

    const SVG_URL_PREFIX = '\0svg-url:';
    const normalizedPublicDir = toVitePath(publicDir);

    config.plugins = [
      ...(config.plugins ?? []),
      {
        name: 'storybook-svg-ignore-resolve',
        enforce: 'pre',
        async resolveId(id) {
          if (!id.includes('?ignore')) return null;
          const [source] = id.split('?');

          // Absolute paths: wrap in a virtual module so Vite won't
          // complain about importing from the public directory, and so
          // vite-plugin-storybook-nextjs-image cannot intercept it again
          // (which would cause a circular virtual:next-image → TDZ on `src`).
          if (path.isAbsolute(source) || source.startsWith('/')) {
            return SVG_URL_PREFIX + toVitePath(source);
          }

          // Aliased paths: expand the alias first, then wrap.
          if (source.startsWith('@') || source.startsWith('#public')) {
            const resolved = await this.resolve(source, undefined, { skipSelf: true });
            if (resolved) return SVG_URL_PREFIX + resolved.id;
            return null;
          }

          // Broken relative paths emitted by next-image on Windows: ".\public/icons/foo.svg"
          const cleaned = source.replace(/^\.\\/, '').replace(/^\.\//, '');
          if (cleaned.startsWith('public/')) {
            return SVG_URL_PREFIX + toVitePath(path.resolve(dirname, '..', cleaned));
          }

          return null;
        },
        load(id) {
          if (!id.startsWith(SVG_URL_PREFIX)) return null;
          const filePath = id.slice(SVG_URL_PREFIX.length);
          // Files under publicDir are served at their path relative to publicDir.
          const url = filePath.startsWith(normalizedPublicDir)
            ? filePath.slice(normalizedPublicDir.length)
            : filePath;
          return `export default ${JSON.stringify(url)};`;
        },
      },
    ];

    return config;
  },
};
export default config;
