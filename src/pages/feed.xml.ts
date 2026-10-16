import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../posts';
import { profile } from '../data/profile';

export async function GET(context: APIContext) {
  return rss({
    title: 'Marvin Liu — Writing',
    description: profile.description,
    site: context.site!,
    items: (await getPosts()).map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: post.data.permalink,
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
