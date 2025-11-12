'use client'

import { AdminNavigation } from '@/components/admin/admin-navigation'
import { motion } from 'framer-motion'
import {
  Archive,
  BookOpen,
  Clock,
  Code2,
  Edit,
  EyeOff,
  FileText,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  Rocket,
  Search,
  Sparkles,
  StickyNote,
  Trash2,
  Volume2,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { RadiantCard } from '~/components/ui/radiant-card'
import { useToast } from '~/components/ui/use-toast'

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

interface TranscriptionEntry {
  id: string
  timestamp: Date
  transcription: string
  summary?: string
  contentType: string
  tags: string[]
  blogPotential: boolean
  projectPotential: boolean
  audioBlob?: Blob
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

const voiceCommands = {
  startTransmission: [
    'computer start transmission',
    "start captain's log",
    'start transmission',
    'computer, start transmission',
    'begin transmission',
    'start recording',
  ],
  endTransmission: [
    'end transmission',
    'stop transmission',
    'end log',
    'stop log',
    'computer end',
    'computer stop',
    'log complete',
    'finish transmission',
    'end recording',
    'stop recording',
    'conclude transmission',
  ],
}

export default function CaptainsLogPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [entries, setEntries] = useState<TranscriptionEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<TranscriptionEntry[]>(
    [],
  )
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPrivate, setIsPrivate] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContentType, setSelectedContentType] = useState<string>('all')
  const [showPrivateOnly, setShowPrivateOnly] = useState(false)

  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(true)
  const [isListeningForCommands, setIsListeningForCommands] = useState(false)
  const [microphonePermission, setMicrophonePermission] = useState<
    'granted' | 'denied' | 'prompt' | 'checking'
  >('checking')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const commandRecognitionRef = useRef<SpeechRecognition | null>(null)
  const isRecordingRef = useRef<boolean>(false)
  const hasUserInteracted = useRef<boolean>(false)
  const startRecordingRef = useRef<(() => Promise<void>) | null>(null)
  const stopRecordingRef = useRef<(() => void) | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    loadEntries()
    checkMicrophonePermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkMicrophonePermission = async () => {
    try {
      // Try to query permission state, but don't rely on it
      // Firefox and some Chromium versions have issues with this API
      if (navigator.permissions?.query) {
        try {
          const result = await navigator.permissions.query({
            name: 'microphone' as PermissionName,
          })
          setMicrophonePermission(
            result.state as 'granted' | 'denied' | 'prompt',
          )

          result.onchange = () => {
            setMicrophonePermission(
              result.state as 'granted' | 'denied' | 'prompt',
            )
          }
        } catch (e) {
          // Permission query not supported, default to prompt
          console.log('Permission query not supported:', e)
          setMicrophonePermission('prompt')
        }
      } else {
        // Permissions API not available
        setMicrophonePermission('prompt')
      }
    } catch (error) {
      console.error('Permission check error:', error)
      setMicrophonePermission('prompt')
    }
  }

  useEffect(() => {
    let filtered = entries

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.transcription
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          entry.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      )
    }

    if (selectedContentType !== 'all') {
      filtered = filtered.filter(
        (entry) => entry.contentType === selectedContentType,
      )
    }

    if (showPrivateOnly) {
      filtered = filtered.filter((entry) => entry.isPrivate)
    }

    setFilteredEntries(filtered)
  }, [entries, searchTerm, selectedContentType, showPrivateOnly])

  const loadEntries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        '/api/captains-log?showPrivate=true&limit=100',
      )

      if (!response.ok) {
        throw new Error('Failed to load entries')
      }

      const data = await response.json()
      const formattedEntries = data.logEntries.map(
        (entry: TranscriptionEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
          createdAt: entry.createdAt ? new Date(entry.createdAt) : undefined,
          updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
        }),
      )

      setEntries(formattedEntries)
    } catch (error) {
      console.error('Load error:', error)
      toast({
        title: 'Load Error',
        description: 'Failed to load log entries. Please refresh the page.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceCommand = useCallback(
    (transcript: string) => {
      const normalizedTranscript = transcript
        .toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .replace(/\s+/g, ' ')
        .trim()

      const isStartCommand = voiceCommands.startTransmission.some((command) => {
        const normalizedCommand = command
          .toLowerCase()
          .replace(/[.,!?;:]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        return (
          normalizedTranscript.includes(normalizedCommand) ||
          normalizedTranscript === normalizedCommand ||
          normalizedTranscript.endsWith(normalizedCommand)
        )
      })

      const isEndCommand = voiceCommands.endTransmission.some((command) => {
        const normalizedCommand = command
          .toLowerCase()
          .replace(/[.,!?;:]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        return (
          normalizedTranscript.includes(normalizedCommand) ||
          normalizedTranscript === normalizedCommand ||
          normalizedTranscript.endsWith(normalizedCommand)
        )
      })

      if (isStartCommand && !isRecordingRef.current && !isTranscribing) {
        toast({
          title: '🎙️ Voice Command Detected',
          description: "Starting Captain's Log transmission...",
        })
        startRecordingRef.current?.()
      } else if (isEndCommand && isRecordingRef.current) {
        toast({
          title: '🤖 Voice Command Detected',
          description: 'Ending transmission and processing...',
        })
        stopRecordingRef.current?.()
      }
    },
    [toast, isTranscribing],
  )

  const startCommandListening = useCallback(() => {
    if (
      commandRecognitionRef.current &&
      voiceCommandsEnabled &&
      hasUserInteracted.current &&
      !isRecordingRef.current &&
      (microphonePermission === 'granted' || microphonePermission === 'prompt')
    ) {
      try {
        commandRecognitionRef.current.start()
        setIsListeningForCommands(true)
        console.log('Voice commands listening started')
      } catch (e) {
        const error = e as Error
        if (
          !error.message.includes('recognition already started') &&
          !error.message.includes('already started')
        ) {
          console.error('Command recognition start error:', error)
          toast({
            title: 'Voice Commands Error',
            description: `Could not start voice commands: ${error.message}`,
            variant: 'destructive',
          })
        }
      }
    }
  }, [voiceCommandsEnabled, microphonePermission, toast])

  const stopCommandListening = useCallback(() => {
    if (commandRecognitionRef.current && isListeningForCommands) {
      try {
        commandRecognitionRef.current.stop()
        setIsListeningForCommands(false)
      } catch (_e) {
        console.log('Command recognition already stopped')
      }
    }
  }, [isListeningForCommands])

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 3

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            handleVoiceCommand(transcript)
          }
        }
      }

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setMicrophonePermission('denied')
          setIsListeningForCommands(false)
          toast({
            title: 'Microphone Access Denied',
            description:
              'Please grant microphone permission to use voice commands.',
            variant: 'destructive',
          })
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.error('Speech recognition error:', event.error)
        }
      }

      recognition.onend = () => {
        setIsListeningForCommands(false)
        if (
          voiceCommandsEnabled &&
          !isRecordingRef.current &&
          hasUserInteracted.current &&
          microphonePermission === 'granted'
        ) {
          setTimeout(() => {
            try {
              recognition.start()
              setIsListeningForCommands(true)
            } catch (e) {
              console.log('Could not restart recognition:', e)
            }
          }, 1000)
        }
      }

      commandRecognitionRef.current = recognition
    }

    return () => {
      if (commandRecognitionRef.current) {
        try {
          commandRecognitionRef.current.stop()
          setIsListeningForCommands(false)
        } catch (e) {
          console.log('Cleanup error:', e)
        }
      }
    }
  }, [voiceCommandsEnabled, microphonePermission, handleVoiceCommand, toast])

  const startRecording = useCallback(async () => {
    try {
      hasUserInteracted.current = true

      // Stop any active command listening before starting recording
      if (commandRecognitionRef.current && isListeningForCommands) {
        try {
          commandRecognitionRef.current.stop()
          setIsListeningForCommands(false)
        } catch (e) {
          console.log('Stopping command recognition:', e)
        }
      }

      isRecordingRef.current = true
      setIsRecording(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      setMicrophonePermission('granted')

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        })
        transcribeAudio(audioBlob)

        for (const track of stream.getTracks()) {
          track.stop()
        }

        // Wait a bit before restarting voice commands to avoid conflicts
        if (voiceCommandsEnabled && commandRecognitionRef.current) {
          setTimeout(() => {
            if (!isRecordingRef.current) {
              startCommandListening()
            }
          }, 2000)
        }
      }

      mediaRecorder.start(1000)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      toast({
        title: "🎙️ Captain's Log Recording",
        description:
          "Recording your thoughts... Say 'End Transmission' to stop.",
      })
    } catch (error) {
      console.error('Error accessing microphone:', error)
      const err = error as Error
      isRecordingRef.current = false
      setIsRecording(false)
      setMicrophonePermission('denied')

      toast({
        title: 'Microphone Error',
        description: `Unable to access microphone: ${err.message || 'Check permissions, Captain.'}`,
        variant: 'destructive',
      })
    }
  }, [
    voiceCommandsEnabled,
    startCommandListening,
    isListeningForCommands,
    toast,
  ])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop()
      } catch (error) {
        console.error('Error stopping recording:', error)
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    isRecordingRef.current = false
    setIsRecording(false)

    toast({
      title: "🤖 Processing Captain's Log",
      description: 'AI is analyzing your thoughts...',
    })
  }, [toast])

  useEffect(() => {
    startRecordingRef.current = startRecording
    stopRecordingRef.current = stopRecording
  }, [startRecording, stopRecording])

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const data = await response.json()

      const newEntry: TranscriptionEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        transcription: data.transcription,
        summary: data.summary,
        contentType: data.contentType,
        tags: data.tags || [],
        blogPotential: data.blogPotential,
        projectPotential: data.projectPotential,
        audioBlob,
        duration: recordingTime,
        isPrivate,
      }

      setEntries((prev) => [newEntry, ...prev])

      await saveEntry(newEntry)

      toast({
        title: "✨ Captain's Log Complete",
        description: `Transcribed as: ${data.contentType}. ${data.blogPotential ? '📝 Blog potential detected!' : ''} ${data.projectPotential ? '🚀 Project potential detected!' : ''}`,
      })
    } catch (error) {
      console.error('Transcription error:', error)
      toast({
        title: 'Transcription Error',
        description:
          "The AI couldn't process your thoughts. Try again, Captain.",
        variant: 'destructive',
      })
    } finally {
      setIsTranscribing(false)
      setRecordingTime(0)
    }
  }

  const saveEntry = async (entry: TranscriptionEntry) => {
    try {
      const response = await fetch('/api/captains-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: entry.transcription,
          summary: entry.summary,
          contentType: entry.contentType,
          tags: entry.tags,
          blogPotential: entry.blogPotential,
          projectPotential: entry.projectPotential,
          duration: entry.duration,
          isPrivate: entry.isPrivate,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      const savedEntry = await response.json()

      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, id: savedEntry.logEntry.id } : e,
        ),
      )

      if (!entry.createdAt) {
        toast({
          title: '📝 Log Entry Saved',
          description: 'Your thoughts have been archived to the database.',
        })
      }
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: 'Save Error',
        description: 'Failed to archive your thoughts. Try again, Captain.',
        variant: 'destructive',
      })
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/captains-log/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      setEntries((prev) => prev.filter((entry) => entry.id !== id))
      toast({
        title: '🗑️ Entry Deleted',
        description: 'Log entry has been removed.',
      })
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

  const contentTypes = Object.keys(contentTypeIcons)

  return (
    <div className="min-h-screen bg-background">
      <Container className="pt-4 lg:pt-12 pb-12">
        <AdminNavigation currentPage="Captain's Log" />

        <PageHeader
          title="Captain's Log"
          description="Voice-to-text notes with AI analysis. Record your thoughts, ideas, and potential blog/project concepts."
          className="border-b border-gray-200 dark:border-gray-700"
        />

        {/* Recording Controls */}
        <div className="py-8 md:py-12">
          <RadiantCard className="p-6 md:p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Microphone Icon with Animation */}
              <div className="relative">
                {isRecording ? (
                  <div className="relative">
                    {/* Pulsing rings animation */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-orange-500 dark:border-green-500"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-orange-500 dark:border-green-500"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                        delay: 0.5,
                      }}
                    />
                    {/* Icon container */}
                    <motion.div
                      className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-black dark:border-white bg-white dark:bg-black"
                      animate={{
                        boxShadow: [
                          '0 0 0 0px rgba(249, 115, 22, 0.4)',
                          '0 0 0 10px rgba(249, 115, 22, 0)',
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <Mic className="w-10 h-10 md:w-12 md:h-12 accent" />
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-black dark:border-white bg-white dark:bg-black">
                    <Mic className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Recording Timer */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold accent"
                >
                  {formatTime(recordingTime)}
                </motion.div>
              )}

              {/* Main Recording Button */}
              <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing}
                  className={`w-full px-6 py-4 rounded-lg font-semibold transition-all border-2 ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 dark:border-red-500'
                      : 'border-black dark:border-white bg-white dark:bg-black hover:bg-orange-50 dark:hover:bg-green-900/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
                >
                  {isRecording ? (
                    <span className="flex items-center justify-center gap-2">
                      <MicOff className="w-5 h-5" />
                      Stop Recording
                    </span>
                  ) : isTranscribing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Mic className="w-5 h-5" />
                      Start Recording
                    </span>
                  )}
                </button>

                {/* Error/Status Messages */}
                {microphonePermission === 'denied' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Microphone access denied
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Click the 🔒 icon in your browser&apos;s address bar to
                      grant permission
                    </p>
                  </motion.div>
                )}
                {microphonePermission === 'checking' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Checking microphone permissions...
                  </p>
                )}
              </div>

              {/* Settings */}
              <div className="flex flex-col items-center gap-4 w-full max-w-md border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="themed-checkbox"
                    />
                    <span className="text-sm font-medium">Private Entry</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50">
                    <input
                      type="checkbox"
                      checked={voiceCommandsEnabled}
                      onChange={(e) => {
                        const enabled = e.target.checked
                        setVoiceCommandsEnabled(enabled)
                        if (
                          enabled &&
                          hasUserInteracted.current &&
                          (microphonePermission === 'granted' ||
                            microphonePermission === 'prompt')
                        ) {
                          startCommandListening()
                        } else {
                          stopCommandListening()
                        }
                      }}
                      className="themed-checkbox"
                      disabled={
                        !hasUserInteracted.current ||
                        microphonePermission === 'denied'
                      }
                    />
                    <span className="text-sm font-medium">
                      Voice Commands
                      {isListeningForCommands && ' 🎤'}
                    </span>
                  </label>
                </div>
                {voiceCommandsEnabled && !isRecording && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 px-4">
                      {microphonePermission === 'denied'
                        ? 'Microphone access denied. Check browser settings.'
                        : !hasUserInteracted.current
                          ? 'Start a recording first to enable voice commands.'
                          : isListeningForCommands
                            ? '🎤 Listening for "Start Transmission" or "End Transmission"'
                            : 'Voice commands ready. Toggle to activate.'}
                    </p>
                    {hasUserInteracted.current &&
                      microphonePermission !== 'denied' &&
                      !isListeningForCommands && (
                        <button
                          type="button"
                          onClick={startCommandListening}
                          className="text-xs px-3 py-1 rounded-lg border-2 border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          Test Voice Commands
                        </button>
                      )}
                  </motion.div>
                )}
              </div>
            </div>
          </RadiantCard>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <RadiantCard className="p-4 md:p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search entries by content, summary, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-4 py-3 text-base themed-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <select
                    value={selectedContentType}
                    onChange={(e) => setSelectedContentType(e.target.value)}
                    className="w-full themed-input py-3"
                  >
                    <option value="all">All Types</option>
                    {contentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type
                          .split('-')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer px-4 py-3 border-2 border-black dark:border-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showPrivateOnly}
                    onChange={(e) => setShowPrivateOnly(e.target.checked)}
                    className="themed-checkbox"
                  />
                  <span className="text-sm font-medium">Private Only</span>
                </label>
              </div>

              {/* Results Count */}
              {(searchTerm ||
                selectedContentType !== 'all' ||
                showPrivateOnly) && (
                <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  Showing {filteredEntries.length} of {entries.length} entries
                  {searchTerm && ` matching "${searchTerm}"`}
                </div>
              )}
            </div>
          </RadiantCard>
        </div>

        {/* Entries List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500 dark:text-green-500" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <RadiantCard className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No entries found. Start recording to create your first log
                entry!
              </p>
            </RadiantCard>
          ) : (
            filteredEntries.map((entry) => {
              const Icon = contentTypeIcons[entry.contentType] || Archive
              return (
                <RadiantCard key={entry.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
                            contentTypeColors[entry.contentType] ||
                            contentTypeColors.other
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {entry.contentType}
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
                            Blog
                          </span>
                        )}
                        {entry.projectPotential && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                            <Rocket className="w-3 h-3" />
                            Project
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/captains-log/${entry.id}`}
                          className="p-2 rounded border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          title="View and edit entry"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteEntry(entry.id)}
                          className="p-2 rounded border-2 border-transparent hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {entry.summary && (
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {entry.summary}
                      </p>
                    )}

                    <p className="text-gray-700 dark:text-gray-300">
                      {entry.transcription}
                    </p>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                      {entry.duration && (
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-4 h-4" />
                          {formatTime(entry.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                </RadiantCard>
              )
            })
          )}
        </div>
      </Container>
    </div>
  )
}
