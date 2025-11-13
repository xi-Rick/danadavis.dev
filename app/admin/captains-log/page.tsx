import { AdminNavigation } from '@/components/admin/admin-navigation'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { CaptainsLog } from './captains-log'

export default function CaptainsLogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Container className="pt-4 lg:pt-12 pb-12">
        <AdminNavigation currentPage="Captain's Log" />

        <PageHeader
          title="Captain's Log"
          description="Voice-to-text notes with AI analysis. Record your thoughts, ideas, and potential blog/project concepts."
          className="border-b border-gray-200 dark:border-gray-700"
        />

        <CaptainsLog />
      </Container>
    </div>
  )
}
