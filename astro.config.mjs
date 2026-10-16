import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFile, rm, writeFile } from 'node:fs/promises';

export default defineConfig({
  site: 'https://liuyang1520.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: page => !page.endsWith('/404/'),
      serialize: item => ({ ...item, url: item.url.replace(/\.html\/$/, '.html') }),
    }),
    {
      name: 'preserve-legacy-html-url',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          // Astro's directory format otherwise creates .html/index.html, which
          // would redirect the original Jekyll permalink to a trailing slash.
          const legacyPath = new URL('jquery-1-nothing-new.html', dir);
          const html = await readFile(new URL('jquery-1-nothing-new.html/index.html', dir));
          await rm(legacyPath, { recursive: true });
          await writeFile(legacyPath, html);
        },
      },
    },
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
