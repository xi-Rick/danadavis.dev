'use client'

import { AdminNavigation } from '@/components/admin/admin-navigation'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { useEffect, useState } from 'react'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { PageHeader } from '~/components/ui/page-header'
import { RadiantCard } from '~/components/ui/radiant-card'

interface SiteSettings {
  id: string
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  locale: string
  siteUrl: string
  siteRepo: string
  siteLogo: string
  socialBanner: string
  faviconPath: string
  email: string
  github: string
  x: string
  youtube: string
  linkedin: string
  threads: string
  instagram: string
  buyMeACoffee: string
  paypal: string | null
  kofi: string
  goodreadsBookshelf: string | null
  imdbRatingsList: string | null
  umamiWebsiteId: string | null
  umamiShareUrl: string | null
  disqusShortname: string | null
}

export default function SiteSettingsPage() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings()
    }
  }, [isAuthenticated])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/site-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        setMessage({ type: 'error', text: 'Failed to load settings' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error loading settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!settings) return

    try {
      setSaving(true)
      setMessage(null)

      // Upload favicon if selected
      if (faviconFile) {
        const formData = new FormData()
        formData.append('file', faviconFile)

        const uploadResponse = await fetch('/api/upload-favicon', {
          method: 'POST',
          body: formData,
        })

        if (uploadResponse.ok) {
          const { path } = await uploadResponse.json()
          settings.faviconPath = path
        } else {
          throw new Error('Failed to upload favicon')
        }
      }

      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
        setFaviconFile(null)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch {
      setMessage({ type: 'error', text: 'Error saving settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof SiteSettings, value: string) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  if (isLoading)
    return (
      <Container className="pt-4 lg:pt-12 pb-12">
        <div className="text-center" />
      </Container>
    )

  if (!isAuthenticated) {
    return (
      <Container className="pt-4 lg:pt-12 pb-12">
        <div className="text-center">
          <PageHeader
            title="Admin Access Required"
            description="You need to be logged in to access the admin area."
            className="border-b border-gray-200 dark:border-gray-700"
          />
          <div className="mt-8">
            <LoginLink className="inline-block px-8 py-3 accent-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Login to Admin
            </LoginLink>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="pt-4 lg:pt-12 pb-12">
      <AdminNavigation currentPage="Site Settings" />

      <PageHeader
        title="Site Settings"
        description="Configure your site metadata, social links, and integrations."
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            Loading settings...
          </div>
        ) : settings ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                General Settings
              </h3>
              <RadiantCard>
                <div className="space-y-4 p-6">
                  <div>
                    <label htmlFor="title" className="themed-label">
                      Site Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={settings.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="themed-input"
                      placeholder="Enter site title"
                    />
                  </div>

                  <div>
                    <label htmlFor="headerTitle" className="themed-label">
                      Header Title
                    </label>
                    <input
                      id="headerTitle"
                      type="text"
                      value={settings.headerTitle}
                      onChange={(e) =>
                        handleChange('headerTitle', e.target.value)
                      }
                      className="themed-input"
                      placeholder="Enter header title"
                    />
                  </div>

                  <div>
                    <label htmlFor="author" className="themed-label">
                      Author Name
                    </label>
                    <input
                      id="author"
                      type="text"
                      value={settings.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="themed-input"
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="themed-label">
                      Site Description
                    </label>
                    <textarea
                      id="description"
                      value={settings.description}
                      onChange={(e) =>
                        handleChange('description', e.target.value)
                      }
                      rows={3}
                      className="themed-textarea"
                      placeholder="Brief description of your site"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="siteUrl" className="themed-label">
                        Site URL
                      </label>
                      <input
                        id="siteUrl"
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) =>
                          handleChange('siteUrl', e.target.value)
                        }
                        className="themed-input"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="themed-label">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="themed-input"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
              </RadiantCard>
            </div>

            <div className="space-y-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Branding
              </h3>
              <RadiantCard>
                <div className="space-y-4 p-6">
                  <div>
                    <label htmlFor="favicon" className="themed-label">
                      Favicon
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={settings.faviconPath}
                        alt="Current favicon"
                        className="w-8 h-8"
                      />
                      <input
                        id="favicon"
                        type="file"
                        accept="image/x-icon,image/png"
                        onChange={(e) =>
                          setFaviconFile(e.target.files?.[0] || null)
                        }
                        className="text-sm text-gray-600 dark:text-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Upload a .ico or .png file (recommended: 32x32 or 16x16)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="siteLogo" className="themed-label">
                      Site Logo Path
                    </label>
                    <input
                      id="siteLogo"
                      type="text"
                      value={settings.siteLogo}
                      onChange={(e) => handleChange('siteLogo', e.target.value)}
                      className="themed-input"
                      placeholder="/static/images/logo.png"
                    />
                  </div>

                  <div>
                    <label htmlFor="socialBanner" className="themed-label">
                      Social Banner Path
                    </label>
                    <input
                      id="socialBanner"
                      type="text"
                      value={settings.socialBanner}
                      onChange={(e) =>
                        handleChange('socialBanner', e.target.value)
                      }
                      className="themed-input"
                      placeholder="/static/images/twitter-card.jpeg"
                    />
                  </div>
                </div>
              </RadiantCard>
            </div>

            <div className="space-y-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Social Links
              </h3>
              <RadiantCard>
                <div className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="github" className="themed-label">
                        GitHub
                      </label>
                      <input
                        id="github"
                        type="url"
                        value={settings.github}
                        onChange={(e) => handleChange('github', e.target.value)}
                        className="themed-input"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label htmlFor="x" className="themed-label">
                        X (Twitter)
                      </label>
                      <input
                        id="x"
                        type="url"
                        value={settings.x}
                        onChange={(e) => handleChange('x', e.target.value)}
                        className="themed-input"
                        placeholder="https://twitter.com/username"
                      />
                    </div>

                    <div>
                      <label htmlFor="linkedin" className="themed-label">
                        LinkedIn
                      </label>
                      <input
                        id="linkedin"
                        type="url"
                        value={settings.linkedin}
                        onChange={(e) =>
                          handleChange('linkedin', e.target.value)
                        }
                        className="themed-input"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label htmlFor="youtube" className="themed-label">
                        YouTube
                      </label>
                      <input
                        id="youtube"
                        type="url"
                        value={settings.youtube}
                        onChange={(e) =>
                          handleChange('youtube', e.target.value)
                        }
                        className="themed-input"
                        placeholder="https://youtube.com/@username"
                      />
                    </div>

                    <div>
                      <label htmlFor="instagram" className="themed-label">
                        Instagram
                      </label>
                      <input
                        id="instagram"
                        type="url"
                        value={settings.instagram}
                        onChange={(e) =>
                          handleChange('instagram', e.target.value)
                        }
                        className="themed-input"
                        placeholder="https://instagram.com/username"
                      />
                    </div>

                    <div>
                      <label htmlFor="threads" className="themed-label">
                        Threads
                      </label>
                      <input
                        id="threads"
                        type="url"
                        value={settings.threads}
                        onChange={(e) =>
                          handleChange('threads', e.target.value)
                        }
                        className="themed-input"
                        placeholder="https://threads.net/username"
                      />
                    </div>
                  </div>
                </div>
              </RadiantCard>
            </div>

            <div className="space-y-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Support Links
              </h3>
              <RadiantCard>
                <div className="space-y-4 p-6">
                  <div>
                    <label htmlFor="buyMeACoffee" className="themed-label">
                      Buy Me a Coffee
                    </label>
                    <input
                      id="buyMeACoffee"
                      type="url"
                      value={settings.buyMeACoffee}
                      onChange={(e) =>
                        handleChange('buyMeACoffee', e.target.value)
                      }
                      className="themed-input"
                      placeholder="https://buymeacoffee.com/username"
                    />
                  </div>

                  <div>
                    <label htmlFor="kofi" className="themed-label">
                      Ko-fi
                    </label>
                    <input
                      id="kofi"
                      type="url"
                      value={settings.kofi}
                      onChange={(e) => handleChange('kofi', e.target.value)}
                      className="themed-input"
                      placeholder="https://ko-fi.com/username"
                    />
                  </div>

                  <div>
                    <label htmlFor="paypal" className="themed-label">
                      PayPal (optional)
                    </label>
                    <input
                      id="paypal"
                      type="url"
                      value={settings.paypal || ''}
                      onChange={(e) => handleChange('paypal', e.target.value)}
                      className="themed-input"
                      placeholder="https://paypal.me/username"
                    />
                  </div>
                </div>
              </RadiantCard>
            </div>

            <div className="space-y-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Integrations
              </h3>
              <RadiantCard>
                <div className="space-y-4 p-6">
                  <div>
                    <label htmlFor="umamiWebsiteId" className="themed-label">
                      Umami Website ID (optional)
                    </label>
                    <input
                      id="umamiWebsiteId"
                      type="text"
                      value={settings.umamiWebsiteId || ''}
                      onChange={(e) =>
                        handleChange('umamiWebsiteId', e.target.value)
                      }
                      className="themed-input"
                      placeholder="abc123def456"
                    />
                  </div>

                  <div>
                    <label htmlFor="umamiShareUrl" className="themed-label">
                      Umami Share URL (optional)
                    </label>
                    <input
                      id="umamiShareUrl"
                      type="url"
                      value={settings.umamiShareUrl || ''}
                      onChange={(e) =>
                        handleChange('umamiShareUrl', e.target.value)
                      }
                      className="themed-input"
                      placeholder="https://cloud.umami.is/share/..."
                    />
                  </div>

                  <div>
                    <label htmlFor="disqusShortname" className="themed-label">
                      Disqus Shortname (optional)
                    </label>
                    <input
                      id="disqusShortname"
                      type="text"
                      value={settings.disqusShortname || ''}
                      onChange={(e) =>
                        handleChange('disqusShortname', e.target.value)
                      }
                      className="themed-input"
                      placeholder="your-site-shortname"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="goodreadsBookshelf"
                      className="themed-label"
                    >
                      Goodreads Bookshelf URL (optional)
                    </label>
                    <input
                      id="goodreadsBookshelf"
                      type="url"
                      value={settings.goodreadsBookshelf || ''}
                      onChange={(e) =>
                        handleChange('goodreadsBookshelf', e.target.value)
                      }
                      className="themed-input"
                      placeholder="https://www.goodreads.com/review/list/..."
                    />
                  </div>

                  <div>
                    <label htmlFor="imdbRatingsList" className="themed-label">
                      IMDB Ratings List URL (optional)
                    </label>
                    <input
                      id="imdbRatingsList"
                      type="url"
                      value={settings.imdbRatingsList || ''}
                      onChange={(e) =>
                        handleChange('imdbRatingsList', e.target.value)
                      }
                      className="themed-input"
                      placeholder="https://www.imdb.com/user/.../ratings"
                    />
                  </div>
                </div>
              </RadiantCard>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-6 sm:items-center">
              <button
                type="submit"
                disabled={saving}
                className="text-base sm:text-lg font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-current text-left"
              >
                <GrowingUnderline data-umami-event="save-site-settings">
                  {saving ? 'Saving...' : 'Save Settings'}
                </GrowingUnderline>
              </button>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                /
              </span>
              <button
                type="button"
                onClick={fetchSettings}
                disabled={saving}
                className="text-base sm:text-lg font-semibold underline-offset-4 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <GrowingUnderline data-umami-event="reset-site-settings">
                  Reset
                </GrowingUnderline>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12 text-red-600 dark:text-red-400">
            Failed to load settings
          </div>
        )}
      </div>
    </Container>
  )
}
