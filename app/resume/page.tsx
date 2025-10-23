import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dana Davis - Resume',
  description: 'View or download my professional resume.',
  openGraph: {
    title: 'Dana Davis - Resume',
    description: 'View or download my professional resume.',
    url: 'https://danadavis.dev/resume',
    siteName: 'Dana Davis',
    images: [
      {
        url: 'https://danadavis.dev/static/images/og-resume-image.jpg', // Replace with actual image if available
        width: 1200,
        height: 630,
        alt: 'Dana Davis Resume',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dana Davis - Resume',
    description: 'View or download my professional resume.',
    images: ['https://danadavis.dev/static/images/og-resume-image.jpg'], // Replace with actual image
  },
}

export default function ResumePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">My Resume</h1>
      <p className="mb-6">You can view or download my resume below.</p>
      <div className="flex gap-4">
        <Link
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          View Resume
        </Link>
        <Link
          href="/resume.pdf"
          download
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Download Resume
        </Link>
      </div>
    </div>
  )
}
