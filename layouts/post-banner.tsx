import type { Blog } from "contentlayer/generated";
import type { ReactNode } from "react";
import { Banner } from "~/components/blog/banner";
import { BlogMeta } from "~/components/blog/blog-meta";
import { Comments } from "~/components/blog/comments";
import { DiscussOnX } from "~/components/blog/discuss-on-x";
import { EditOnGithub } from "~/components/blog/edit-on-github";
import { PostTitle } from "~/components/blog/post-title";
import { ScrollButtons } from "~/components/blog/scroll-buttons";
import { TagsList } from "~/components/blog/tags";
import { Container } from "~/components/ui/container";
import { SITE_METADATA } from "~/data/site-metadata";
import type { StatsType } from "~/db/schema";
import type { CoreContent } from "~/types/data";

interface LayoutProps {
  content: CoreContent<Blog>;
  children: ReactNode;
  next?: { path: string; title: string };
  prev?: { path: string; title: string };
}

export function PostBanner({ content, children }: LayoutProps) {
  const {
    slug,
    type,
    title,
    images,
    date,
    lastmod,
    readingTime,
    tags,
    filePath,
  } = content;
  const postUrl = `${SITE_METADATA.siteUrl}/${type.toLowerCase()}/${slug}`;

  return (
    <Container className='pt-4 lg:pt-12'>
      <ScrollButtons />
      <article className='space-y-6 pt-6 lg:space-y-16'>
        <div className='space-y-4'>
          <TagsList tags={tags} />
          <PostTitle>{title}</PostTitle>
          <dl>
            <div>
              <dt className='sr-only'>Published on</dt>
              <BlogMeta
                date={date}
                lastmod={lastmod}
                type={type.toLowerCase() as StatsType}
                slug={slug}
                readingTime={readingTime}
              />
            </div>
          </dl>
          <div className='space-y-4 pt-4 md:pt-10'>
            <Banner
              banner={images?.[0] || SITE_METADATA.socialBanner}
              className='lg:-mx-8 xl:-mx-36 2xl:-mx-52'
            />
          </div>
        </div>
        <div className='prose prose-lg max-w-none dark:prose-invert'>
          {children}
        </div>
        <div className='space-y-8 border-t border-gray-200 pt-4 dark:border-gray-700'>
          <div className='flex justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <DiscussOnX postUrl={postUrl} />
              <span className='text-gray-500'>/</span>
              <EditOnGithub filePath={filePath} />
            </div>
            {/* <SocialShare postUrl={postUrl} title={title} /> */}
          </div>
          <Comments url={postUrl} identifier={slug} title={title} />
        </div>
      </article>
    </Container>
  );
}
