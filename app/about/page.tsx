import { genPageMetadata } from 'app/seo'
import { AuthorLayout } from '~/layouts/author-layout'

export const metadata = genPageMetadata({
  title: 'About',
  description:
    'A bit of background on who I am, what I do, and why I started this blog. Nothing too serious, just a little intro to the person typing away behind the scenes.',
})

export default function AboutPage() {
  return (
    <AuthorLayout>
      {/* TODO: MDX seems to be broken on this page, so I'm back to JSX for now */}
      {/* <MDXLayoutRenderer code={author.body.code} /> */}
    </AuthorLayout>
  )
}
