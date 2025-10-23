import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

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
  redirect('/resume.pdf')
}
