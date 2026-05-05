import { genPageMetadata } from '~/app/seo'
import { Container } from '~/components/ui/container'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GradientDivider } from '~/components/ui/gradient-divider'
import { GritBackground } from '~/components/ui/grit-background'
import { RadiantCard } from '~/components/ui/radiant-card'

export const metadata = genPageMetadata({
  title: 'Arch Linux',
  description: "Dana's Arch Linux setup, dotfiles, and configuration notes.",
})

interface ArchSection {
  readonly title: string
  readonly icon: string
  readonly items: readonly string[]
}

interface SysInfoItem {
  readonly label: string
  readonly value: string
}

interface SpecChip {
  readonly label: string
  readonly value: string
  readonly accent?: boolean
}

const ARCH_SECTIONS: readonly ArchSection[] = [
  {
    title: 'Window Manager',
    icon: '',
    items: [
      'Niri (Tiling Manager)',
      'Waybar (status bar)',
      'Wofi (app launcher)',
      'Mako (notifications)',
    ],
  },
  {
    title: 'Terminal & Shell',
    icon: '',
    items: [
      'Ghostty (terminal emulator)',
      'Zsh + Starship prompt',
      'tmux (terminal multiplexer)',
      'fzf (fuzzy finder)',
    ],
  },
  {
    title: 'Editor',
    icon: '',
    items: [
      'Neovim (primary editor)',
      'LazyVim (config framework)',
      'LSP + Treesitter',
      'Telescope (fuzzy search)',
    ],
  },
  {
    title: 'System Tools',
    icon: '󰀵',
    items: [
      'yay (AUR helper)',
      'systemd',
      'NetworkManager',
      'PipeWire (audio)',
    ],
  },
  {
    title: 'Development',
    icon: '󰅨',
    items: [
      'Docker + Podman',
      'Node.js via nvm',
      'Git + lazygit',
      'GitHub CLI',
    ],
  },
  {
    title: 'Theming',
    icon: '󰜫',
    items: [
      'Catppuccin Mocha (colorscheme)',
      'JetBrains Mono Nerd Font',
      'Papirus icons',
      'GTK3/4 dark theme',
    ],
  },
]

const INSTALL_NOTES: readonly string[] = [
  'Always read the Arch Wiki before installing anything.',
  'Use reflector to keep your mirrorlist fresh and fast.',
  'Archinstall is great — but format the drive first and boot via Ventoy.',
  'Set up timeshift or snapper for BTRFS snapshots before you break anything.',
  'Desktop environments are heavy; a minimal tiling WM setup is worth the learning curve.',
]

const SYS_INFO: readonly SysInfoItem[] = [
  { label: 'os', value: 'Arch Linux x86_64' },
  { label: 'kernel', value: '6.18.3-arch1-1' },
  { label: 'wm', value: 'Niri (Wayland)' },
  { label: 'shell', value: 'zsh 5.9' },
  { label: 'terminal', value: 'Ghostty' },
  { label: 'editor', value: 'Neovim' },
  { label: 'theme', value: 'Catppuccin Mocha' },
  { label: 'font', value: 'JetBrains Mono NF' },
  { label: 'cpu', value: 'AMD Ryzen 5 5600X' },
  { label: 'gpu', value: 'AMD Radeon RX 6800 XT' },
  { label: 'memory', value: '32GB DDR4 @ 3600MHz' },
  { label: 'packages', value: '1,423 (pacman)' },
]

const SPEC_CHIPS: readonly SpecChip[] = [
  { label: 'Arch Linux', value: 'x86_64', accent: true },
  { label: 'Kernel', value: '6.18.3' },
  { label: 'Niri', value: 'Wayland' },
  { label: 'Ghostty', value: 'terminal' },
  { label: 'Neovim', value: 'editor' },
  { label: 'zsh', value: '5.9' },
  { label: '1,423', value: 'pkgs' },
  { label: '32 GB', value: 'DDR4' },
]

export default function ArchPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-black">
        <GritBackground className="inset-0 opacity-60" />

        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 dark:via-green-400 to-transparent" />

        <Container className="relative py-16 sm:py-24">
          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
            {/* ASCII logo block */}
            <div className="shrink-0 scale-75 sm:scale-90 md:scale-100 origin-center sm:origin-left self-center sm:self-start">
              <pre className="font-mono font-black leading-tight text-orange-500 dark:text-green-400 text-xs sm:text-sm md:text-base select-none whitespace-pre">
                {[
                  '                  A',
                  '                 /#\\',
                  '                /###\\',
                  '               /#####\\',
                  '              /#######\\',
                  '             _ "=######\\',
                  '            /##=,_\\#####\\',
                  '           /#############\\',
                  '          /###############\\',
                  '         /#################\\',
                  '        /###################\\',
                  '       /########*"""*########\\',
                  '      /#######/       \\#######\\',
                  '     /########         ########\\',
                  '    /#########         ######m=,_',
                  '   /##########         ##########\\',
                  '  /######***             ***######\\',
                  ' /###**                       **###\\',
                  '/**                               **\\',
                ].join('\n')}
              </pre>
            </div>

            {/* Hero text */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-gray-500">
                <span className="text-orange-500 dark:text-green-400">
                  dana@archlinux
                </span>
                <span>~</span>
                <span className="text-gray-500 dark:text-gray-600">$</span>
                <span className="text-gray-500 dark:text-gray-400">
                  cat README.md
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                Arch Linux
              </h1>
              <p className="max-w-md text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                My daily driver. Minimal, fast, and exactly the way I want it. A
                breakdown of the current setup, dotfiles, and everything in
                between.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://github.com/xi-Rick/danadavis.dev/tree/main/public/arch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-orange-500 dark:bg-green-400 px-4 py-2 text-sm font-semibold text-black hover:brightness-110 transition-all"
                >
                  Dotfiles
                </a>
                <a
                  href="https://wiki.archlinux.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-white/20 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                >
                  󰈙 Arch Wiki
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
