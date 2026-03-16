import { genPageMetadata } from '~/app/seo'
import { Container } from '~/components/ui/container'
import { GradientBorder } from '~/components/ui/gradient-border'
import { Image } from '~/components/ui/image'
import { PageHeader } from '~/components/ui/page-header'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'

export const metadata = genPageMetadata({
  title: 'Arch Linux',
  description: "Dana's Arch Linux setup, dotfiles, and configuration notes.",
})

interface ArchSection {
  readonly title: string
  readonly icon: string
  readonly items: readonly string[]
}

const ARCH_SECTIONS: readonly ArchSection[] = [
  {
    title: 'Window Manager',
    icon: '',
    items: [
      'Niri (Tiling Manager)',
      'Waybar (status bar)',
      'Wofi (app launcher)',
      'Mako (notifications)',
    ],
  },
  {
    title: 'Terminal & Shell',
    icon: '',
    items: [
      'Ghostty (terminal emulator)',
      'Zsh + Starship prompt',
      'tmux (terminal multiplexer)',
      'fzf (fuzzy finder)',
    ],
  },
  {
    title: 'Editor',
    icon: '',
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
  'Always read the Arch Wiki before installing anything',
  'Use `reflector` to keep mirrorlist up to date',
  'Archinstall is great but format the drive first and use Ventoy',
  'Use `timeshift` or `snapper` for BTRFS snapshots',
  "DE's can be heavy; I prefer a minimal tiling WM setup",
]

/** Placeholder image paths — replace with real screenshots when available */
const SCREENSHOTS: readonly { src: string; alt: string }[] = []

// Enhanced ASCII art with better styling
const ASCII_LOGO: readonly string[] = [
  '       █████╗ ██████╗  ██████╗██╗  ██╗',
  '      ██╔══██╗██╔══██╗██╔════╝██║  ██║',
  '      ███████║██████╔╝██║     ███████║',
  '      ██╔══██║██╔══██╗██║     ██╔══██║',
  '      ██║  ██║██║  ██║╚██████╗██║  ██║',
  '      ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝',
]

// Alternative retro ASCII if you prefer the original style
const RETRO_ASCII: readonly string[] = [
  '      /\\',
  '     /  \\',
  '    /\\   \\',
  '   /  __  \\',
  '  /  (  )  \\',
  ' / __|  |__ \\',
  '/`          `\\',
]

interface SysInfoItem {
  readonly label: string
  readonly value: string
  readonly color?: string
}

const SYS_INFO: readonly SysInfoItem[] = [
  { label: 'OS', value: 'Arch Linux x86_64', color: 'text-cyan-400' },
  { label: 'Kernel', value: '6.18.3-arch1-1', color: 'text-pink-400' },
  { label: 'WM', value: 'Niri (Wayland)', color: 'text-yellow-400' },
  { label: 'Shell', value: 'zsh', color: 'text-green-400' },
  { label: 'Terminal', value: 'Ghostty', color: 'text-blue-400' },
  { label: 'Editor', value: 'Neovim', color: 'text-purple-400' },
  { label: 'Theme', value: 'Catppuccin Mocha', color: 'text-red-400' },
  { label: 'Font', value: 'JetBrains Mono NF', color: 'text-indigo-400' },
  { label: 'CPU', value: 'AMD Ryzen 5 5600X', color: 'text-orange-400' },
  { label: 'GPU', value: 'AMD Radeon RX 6800 XT', color: 'text-emerald-400' },
  { label: 'Memory', value: '32GB DDR4 @ 3600MHz', color: 'text-teal-400' },
  { label: 'Uptime', value: '3 days, 14 hours', color: 'text-amber-400' },
]

const COLOR_BLOCKS = [
  { bg: 'bg-red-500' },
  { bg: 'bg-green-500' },
  { bg: 'bg-yellow-500' },
  { bg: 'bg-blue-500' },
  { bg: 'bg-magenta-500' },
  { bg: 'bg-cyan-500' },
  { bg: 'bg-white' },
  { bg: 'bg-gray-500' },
]

export default function ArchPage() {
  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Arch Linux"
        description={
          <p>
            My daily driver. Minimal, fast, and exactly the way I want it.
            Here&apos;s a breakdown of my setup, tools, and hard-won
            configuration notes.
          </p>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-3 pt-2">
          <a
            href="https://github.com/xi-Rick/danadavis.dev/tree/main/public/arch"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-5 py-2.5 font-mono text-sm font-semibold text-black dark:text-white overflow-hidden rounded-md"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600" />
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 dark:from-green-600 dark:to-green-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
              <span className="text-lg"></span>
              <span>dotfiles</span>
            </span>
          </a>
          <a
            href="https://wiki.archlinux.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-5 py-2.5 font-mono text-sm font-semibold overflow-hidden rounded-md border-2 border-orange-500 dark:border-green-500 hover:bg-orange-500 dark:hover:bg-green-500 hover:text-black dark:hover:text-black transition-all"
          >
            <span className="relative flex items-center gap-2">
              <span className="text-lg">󰈙</span>
              <span>arch wiki</span>
            </span>
          </a>
        </div>
      </PageHeader>

      <div className="py-8 md:py-12 space-y-16">
        {/* Screenshots */}
        {SCREENSHOTS.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-orange-500 dark:text-green-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 font-mono">
              <span className="text-2xl">󰋩</span>
              <span>screenshots/</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SCREENSHOTS.map(({ src, alt }) => (
                <GradientBorder
                  key={src}
                  className="rounded-xl overflow-hidden dark:bg-white/5"
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={1200}
                    height={675}
                    className="h-56 w-full object-cover"
                  />
                </GradientBorder>
              ))}
            </div>
          </section>
        )}

        {/* Enhanced Fastfetch-style info card */}
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-orange-500 dark:text-green-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 font-mono">
            <span className="text-2xl animate-pulse">󰍹</span>
            <span>system information/</span>
            <span className="text-sm text-gray-400 dark:text-gray-500 font-normal ml-auto">
              fastfetch
            </span>
          </h2>
          <GradientBorder className="rounded-xl bg-gray-900/5 dark:bg-gray-900/50 backdrop-blur-sm">
            <TiltedGridBackground className="inset-0 z-[-1] rounded-xl opacity-50" />
            <div className="relative p-6 overflow-x-auto font-mono">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-400">dana@archlinux ~</span>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* ASCII art with gradient */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent dark:from-green-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                  <pre className="relative text-orange-500 dark:text-green-400 select-none text-xs sm:text-sm leading-5 font-bold">
                    {ASCII_LOGO.join('\n')}
                  </pre>
                </div>

                {/* System info with better formatting */}
                <div className="flex-1 min-w-0 space-y-4">
                  {/* User@host with path */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">dana@archlinux</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300">fastfetch</span>
                  </div>

                  {/* Main system info with colored values */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {SYS_INFO.map(
                      ({ label, value, color = 'text-gray-300' }) => (
                        <div key={label} className="flex items-baseline group">
                          <span className="text-orange-500 dark:text-green-400 w-20 shrink-0 text-sm">
                            {label.toLowerCase()}:
                          </span>
                          <span
                            className={`${color} text-sm truncate group-hover:text-white transition-colors`}
                          >
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Color palette */}
                  <div className="flex gap-1 pt-2">
                    {COLOR_BLOCKS.map((block, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 ${block.bg} rounded-sm first:rounded-l-md last:rounded-r-md`}
                      />
                    ))}
                  </div>

                  {/* Bottom prompt */}
                  <div className="flex items-center gap-2 text-sm pt-2 text-gray-500">
                    <span>──</span>
                    <span className="animate-pulse">●</span>
                    <span>──</span>
                    <span className="text-orange-500 dark:text-green-400">
                      󰍹
                    </span>
                    <span>──</span>
                    <span>packages: 1423 (pacman)</span>
                    <span>──</span>
                    <span>shell: zsh 5.9</span>
                    <span>──</span>
                    <span className="text-gray-400">dana</span>
                  </div>
                </div>
              </div>
            </div>
          </GradientBorder>
        </section>

        {/* Component sections with better grid layout */}
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-orange-500 dark:text-green-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 font-mono">
            <span className="text-2xl">󰊴</span>
            <span>components/</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ARCH_SECTIONS.map(({ title, icon, items }) => (
              <GradientBorder
                key={title}
                className="rounded-xl bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-sm"
              >
                <TiltedGridBackground className="inset-0 z-[-1] rounded-xl opacity-30" />
                <div className="relative p-5">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700/30">
                    <span className="text-xl text-orange-500 dark:text-green-400">
                      {icon}
                    </span>
                    <h3 className="font-mono font-semibold text-gray-700 dark:text-gray-300">
                      {title}
                    </h3>
                    <span className="ml-auto text-xs text-gray-500"></span>
                  </div>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500 dark:text-green-400 mt-1 text-xs">
                          󰄲
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GradientBorder>
            ))}
          </div>
        </section>

        {/* Install Notes with better styling */}
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-orange-500 dark:text-green-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 font-mono">
            <span className="text-2xl">󰃃</span>
            <span>install notes/</span>
            <span className="text-sm text-gray-400 dark:text-gray-500 font-normal ml-auto">
              arch-chroot
            </span>
          </h2>
          <div className="space-y-3">
            {INSTALL_NOTES.map((note, index) => (
              <GradientBorder
                key={index}
                className="rounded-xl bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-sm group hover:bg-gray-900/30 transition-colors"
              >
                <TiltedGridBackground className="inset-0 z-[-1] rounded-xl opacity-30" />
                <div className="relative flex items-start gap-4 px-5 py-4">
                  <div className="relative">
                    <span className="absolute -inset-1 bg-orange-500/20 dark:bg-green-500/20 rounded-full blur-sm group-hover:blur-md transition-all" />
                    <span className="relative text-orange-500 dark:text-green-400 font-mono text-sm font-bold">
                      [{String(index + 1).padStart(2, ' ')}]
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1">
                    {note}
                  </p>
                  <span className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    󰁔
                  </span>
                </div>
              </GradientBorder>
            ))}
          </div>
        </section>

        {/* Footer with Arch charm */}
        <div className="relative pt-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 dark:via-green-500/50 to-transparent" />
          <p className="text-center font-mono text-sm">
            <span className="text-gray-500">$</span>
            <span className="text-gray-400 mx-2">echo</span>
            <span className="text-orange-500 dark:text-green-400">
              &quot;btw, I use Arch&quot;
            </span>
            <span className="text-gray-500 ml-2">󰘧</span>
          </p>
          <p className="text-center text-xs text-gray-500 dark:text-gray-600 mt-2">
            ── system information fetched in 0.042s ──
          </p>
        </div>
      </div>
    </Container>
  )
}
