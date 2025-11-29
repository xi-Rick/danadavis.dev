import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import CoursePlayer from '~/components/courses/player'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { COURSES } from '~/data/courses'
import { SITE_METADATA } from '~/data/site-metadata'

export async function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug)
  const course = COURSES.find((c) => c.slug === slug)
  if (!course) return

  const publishedAt = course.date
    ? new Date(course.date).toISOString()
    : undefined
  const modifiedAt = course.lastmod
    ? new Date(course.lastmod).toISOString()
    : publishedAt

  const image = course.imgSrc
    ? course.imgSrc
    : course.images?.length
      ? course.images[0]
      : SITE_METADATA.socialBanner

  // Build images list like snippets do (resolve relative paths to absolute)
  const imageList = image ? [image] : [SITE_METADATA.socialBanner]
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
  }))

  return {
    title: course.title,
    description: course.summary,
    openGraph: {
      title: course.title,
      description: course.summary,
      siteName: SITE_METADATA.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: course.authors ?? [SITE_METADATA.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.summary,
      images: imageList,
    },
  }
}

export default async function CourseDetail(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const slug = decodeURI(params.slug)
  const course = COURSES.find((c) => c.slug === slug)

  if (!course) {
    notFound()
  }

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title={course?.title}
        description={course?.summary}
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            {course?.playlist ? (
              <div className="w-full aspect-video overflow-hidden rounded-lg border-2 border-black dark:border-white">
                <iframe
                  src={`https://www.youtube.com/embed/videoseries?list=${extractPlaylistId(course.playlist)}`}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="w-full h-full"
                />
              </div>
            ) : Array.isArray(course?.curriculum) &&
              course.curriculum.length > 0 ? (
              <CoursePlayer
                initialVideoId={course.curriculum[0]?.videoId ?? ''}
                curriculum={course.curriculum}
              />
            ) : course?.demo ? (
              <div className="w-full aspect-video overflow-hidden rounded-lg border-2 border-black dark:border-white">
                <iframe
                  src={course.demo.replace('watch?v=', 'embed/')}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="w-full aspect-video overflow-hidden rounded-lg border-2 border-black dark:border-white relative">
                <Image
                  src={
                    course?.imgSrc ||
                    course?.images?.[0] ||
                    '/static/images/twitter-card.jpeg'
                  }
                  alt={course?.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="prose sm:prose-base lg:prose-lg max-w-none break-words project-content">
            <div dangerouslySetInnerHTML={{ __html: course?.content ?? '' }} />
          </div>

          <div className="mt-8">
            <a
              href={course?.playlist ?? course?.demo}
              className={
                'inline-flex items-center gap-3 px-4 py-2 border-2 rounded-lg font-semibold transition-all duration-200 ' +
                'border-black bg-white text-black hover:border-orange-500 hover:bg-orange-500 hover:text-white ' +
                'dark:border-white dark:bg-black dark:text-white dark:hover:border-green-500 dark:hover:bg-green-500 dark:hover:text-white'
              }
              style={{ boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}
              target="_blank"
              rel="noreferrer"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}

function extractPlaylistId(url?: string) {
  if (!url) return ''
  const m = url.match(/[?&]list=([^&]+)/)
  return m ? m[1] : url
}
