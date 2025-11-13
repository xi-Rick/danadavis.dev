'use client'

import {
  Archive,
  BookOpen,
  Clock,
  Code2,
  Edit2,
  EyeOff,
  FileText,
  Lightbulb,
  Loader2,
  Rocket,
  Save,
  Sparkles,
  StickyNote,
  Trash2,
  Volume2,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { AdminNavigation } from '~/components/admin/admin-navigation'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { RadiantCard } from '~/components/ui/radiant-card'
import { useToast } from '~/components/ui/use-toast'

interface LogEntry {
  id: string
  timestamp: Date
  transcription: string
  summary?: string
  contentType: string
  tags: string[]
  blogPotential: boolean
  projectPotential: boolean
  duration?: number
  isPrivate: boolean
  createdAt?: Date
  updatedAt?: Date
}

const contentTypeIcons = {
  thought: Lightbulb,
  idea: Sparkles,
  'blog-draft': BookOpen,
  'project-idea': Code2,
  note: StickyNote,
  other: Archive,
}

const contentTypeColors = {
  thought:
    'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  idea: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  'blog-draft':
    'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  'project-idea':
    'bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  note: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
  other:
    'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
}

export default function CaptainsLogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const [entry, setEntry] = useState<LogEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedEntry, setEditedEntry] = useState<Partial<LogEntry>>({})

  const router = useRouter()
  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: toast is stable from useToast
  useEffect(() => {
    const loadEntry = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/captains-log/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          let errorData: { error?: string } | undefined
          try {
            errorData = await response.json()
          } catch {
            throw new Error(`Failed to load entry (${response.status})`)
          }
          throw new Error(
            errorData?.error || `Failed to load entry (${response.status})`,
          )
        }

        const data = await response.json()

        if (!data.logEntry) {
          throw new Error('No log entry data received')
        }

        const formattedEntry = {
          ...data.logEntry,
          timestamp: new Date(data.logEntry.timestamp),
          createdAt: data.logEntry.createdAt
            ? new Date(data.logEntry.createdAt)
            : undefined,
          updatedAt: data.logEntry.updatedAt
            ? new Date(data.logEntry.updatedAt)
            : undefined,
        }

        setEntry(formattedEntry)
        setEditedEntry(formattedEntry)
      } catch (error) {
        console.error('Load error:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        toast({
          title: 'Load Error',
          description: `Failed to load log entry: ${errorMessage}`,
          variant: 'destructive',
        })
        setEntry(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntry()
  }, [id])

  const handleSave = async () => {
    if (!entry) return

    try {
      setIsSaving(true)
      const response = await fetch(`/api/captains-log/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: editedEntry.transcription,
          summary: editedEntry.summary,
          contentType: editedEntry.contentType,
          tags: editedEntry.tags,
          blogPotential: editedEntry.blogPotential,
          projectPotential: editedEntry.projectPotential,
          isPrivate: editedEntry.isPrivate,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      const data = await response.json()
      const updatedEntry = {
        ...data.logEntry,
        timestamp: new Date(data.logEntry.timestamp),
        createdAt: data.logEntry.createdAt
          ? new Date(data.logEntry.createdAt)
          : undefined,
        updatedAt: data.logEntry.updatedAt
          ? new Date(data.logEntry.updatedAt)
          : undefined,
      }

      setEntry(updatedEntry)
      setIsEditing(false)

      toast({
        title: '✅ Changes Saved',
        description: 'Your log entry has been updated successfully.',
      })
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: 'Save Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!entry) return

    if (
      !confirm(
        'Are you sure you want to delete this log entry? This action cannot be undone.',
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/captains-log/${entry.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      toast({
        title: '🗑️ Entry Deleted',
        description: 'Log entry has been removed.',
      })

      router.push('/admin/captains-log')
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: 'Delete Error',
        description: 'Failed to delete entry.',
        variant: 'destructive',
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Container className="pt-4 lg:pt-12 pb-12">
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 dark:text-green-500" />
          </div>
        </Container>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-background">
        <Container className="pt-4 lg:pt-12 pb-12">
          <AdminNavigation
            currentPage="Log Entry Not Found"
            backLink="/admin/captains-log"
            backLabel="Back to Captain's Log"
          />
          <RadiantCard className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Log entry not found.
            </p>
          </RadiantCard>
        </Container>
      </div>
    )
  }

  const Icon = contentTypeIcons[entry.contentType] || Archive

  return (
    <div className="min-h-screen bg-background">
      <Container className="pt-4 lg:pt-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <AdminNavigation
            currentPage="Log Entry Details"
            backLink="/admin/captains-log"
            backLabel="Back to Captain's Log"
          />

          <PageHeader
            title="Log Entry Details"
            description={`Recorded on ${entry.timestamp.toLocaleString()}`}
            className="border-b border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Header Card */}
          <RadiantCard className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
                    contentTypeColors[entry.contentType] ||
                    contentTypeColors.other
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {entry.contentType
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
                {entry.isPrivate && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800">
                    <EyeOff className="w-3 h-3" />
                    Private
                  </span>
                )}
                {entry.blogPotential && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                    <FileText className="w-3 h-3" />
                    Blog Potential
                  </span>
                )}
                {entry.projectPotential && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    <Rocket className="w-3 h-3" />
                    Project Potential
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setEditedEntry(entry)
                      }}
                      className="px-4 py-2 border-2 border-black dark:border-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 border-2 border-black dark:border-white bg-orange-500 dark:bg-green-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 inline mr-1" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border-2 border-black dark:border-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </RadiantCard>

          {/* Summary Section */}
          {isEditing ? (
            <RadiantCard className="p-6">
              <label className="block mb-2 text-sm font-semibold">
                Summary
              </label>
              <textarea
                value={editedEntry.summary || ''}
                onChange={(e) =>
                  setEditedEntry({ ...editedEntry, summary: e.target.value })
                }
                placeholder="Add a brief summary..."
                className="w-full themed-textarea"
                rows={3}
              />
            </RadiantCard>
          ) : (
            entry.summary && (
              <RadiantCard className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Summary
                </h3>
                <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  {entry.summary}
                </p>
              </RadiantCard>
            )
          )}

          {/* Transcription Section */}
          <RadiantCard className="p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              Transcription
            </h3>
            {isEditing ? (
              <textarea
                value={editedEntry.transcription || ''}
                onChange={(e) =>
                  setEditedEntry({
                    ...editedEntry,
                    transcription: e.target.value,
                  })
                }
                className="w-full themed-textarea"
                rows={12}
              />
            ) : (
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {entry.transcription}
              </p>
            )}
          </RadiantCard>

          {/* Tags Section */}
          <RadiantCard className="p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              Tags
            </h3>
            {isEditing ? (
              <input
                type="text"
                value={editedEntry.tags?.join(', ') || ''}
                onChange={(e) =>
                  setEditedEntry({
                    ...editedEntry,
                    tags: e.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter((tag) => tag),
                  })
                }
                placeholder="tag1, tag2, tag3"
                className="w-full themed-input"
              />
            ) : entry.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm rounded-full border-2 border-black dark:border-white bg-white dark:bg-black"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No tags added
              </p>
            )}
          </RadiantCard>

          {/* Settings Section */}
          {isEditing && (
            <RadiantCard className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                Settings
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={editedEntry.isPrivate || false}
                      onChange={(e) =>
                        setEditedEntry({
                          ...editedEntry,
                          isPrivate: e.target.checked,
                        })
                      }
                      className="themed-checkbox"
                    />
                    <span className="text-sm font-medium">Private Entry</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={editedEntry.blogPotential || false}
                      onChange={(e) =>
                        setEditedEntry({
                          ...editedEntry,
                          blogPotential: e.target.checked,
                        })
                      }
                      className="themed-checkbox"
                    />
                    <span className="text-sm font-medium">Blog Potential</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={editedEntry.projectPotential || false}
                      onChange={(e) =>
                        setEditedEntry({
                          ...editedEntry,
                          projectPotential: e.target.checked,
                        })
                      }
                      className="themed-checkbox"
                    />
                    <span className="text-sm font-medium">
                      Project Potential
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">
                    Content Type
                  </label>
                  <select
                    value={editedEntry.contentType || 'other'}
                    onChange={(e) =>
                      setEditedEntry({
                        ...editedEntry,
                        contentType: e.target.value,
                      })
                    }
                    className="w-full themed-input"
                  >
                    <option value="thought">Thought</option>
                    <option value="idea">Idea</option>
                    <option value="blog-draft">Blog Draft</option>
                    <option value="project-idea">Project Idea</option>
                    <option value="note">Note</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </RadiantCard>
          )}

          {/* Metadata Section */}
          <RadiantCard className="p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
              Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Recorded:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {entry.timestamp.toLocaleString()}
                </span>
              </div>
              {entry.duration && (
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Duration:</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatTime(entry.duration)}
                  </span>
                </div>
              )}
              {entry.createdAt && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created:</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {entry.createdAt.toLocaleString()}
                  </span>
                </div>
              )}
              {entry.updatedAt && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Last Updated:</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {entry.updatedAt.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </RadiantCard>
        </div>
      </Container>
    </div>
  )
}
