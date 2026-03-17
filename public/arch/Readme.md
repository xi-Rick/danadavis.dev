# Arch Linux Post-Install Script

```
 █████╗ ██████╗  ██████╗██╗  ██╗    ██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗
██╔══██╗██╔══██╗██╔════╝██║  ██║    ██║     ██║████╗  ██║██║   ██║╚██╗██╔╝
███████║██████╔╝██║     ███████║    ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝
██╔══██║██╔══██╗██║     ██╔══██║    ██║     ██║██║╚████║██║   ██║ ██╔██╗
██║  ██║██║  ██║╚██████╗██║  ██║    ███████╗██║██║ ╚███║╚██████╔╝██╔╝╚██╗
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝╚═╝╚═╝  ╚══╝ ╚═════╝ ╚═╝  ╚═╝
```

> Post-install configurator for Arch Linux — opinionated, interactive, and idempotent.  
> Hosted at **[danadavis.dev/arch](https://danadavis.dev/arch)**

---

## Quick Start

Run the script directly from the web with a single command:

```bash
bash <(curl -fsSL https://danadavis.dev/arch/post-install.sh)
```

> **Do not run as root.** The script will prompt for `sudo` only when necessary.

---

## Overview

This script automates the most tedious parts of setting up an Arch Linux system after a fresh install. It uses [gum](https://github.com/charmbracelet/gum) for a polished, interactive TUI experience and handles everything from installing an AUR helper to configuring your bootloader theme.

All actions are logged, all critical steps are verified, and the script is safe to re-run — already-installed components are detected and skipped.

---

## What It Installs

### 1. Quickshell (AUR)

[Quickshell](https://quickshell.outfoxxed.me/) is a highly configurable Qt-based shell component toolkit. Installed via `yay` from the AUR.

```
Package: quickshell-git
Source:  AUR
```

---

### 2. DMS Linux

[DMS Linux](https://danklinux.com) is a curated dotfile and configuration suite. Fetched and piped directly from the official installer:

```
Source: https://install.danklinux.com
```

![DankLinux DankMaterialShell Desktop](https://danklinux.com/img/desktop.png)

---

### 3. Plymouth Boot Animation

Sets up a smooth animated splash screen shown during boot. Installs the custom **arch-glow** theme:

| Step | Action |
|------|--------|
| Install | `plymouth` via `pacman` |
| Theme | `arch-glow` from `danadavis.dev/arch/arch-glow.zip` |
| Hook | Injects `plymouth` after `udev` **or** `systemd` in `/etc/mkinitcpio.conf` |
| Rebuild | Runs `mkinitcpio -P` to apply the new initramfs |

The theme is automatically detected and set as default via `plymouth-set-default-theme -R`.

The script detects whether your preset uses the `udev` or `systemd` initramfs hook and injects `plymouth` in the correct position. If neither hook is found the step fails with a clear error rather than silently doing nothing.

![arch-glow Plymouth Boot Animation](https://raw.githubusercontent.com/Skrepysh/arch-glow-plymouth/main/preview.gif)

---

### 4. GRUB Star Trek Theme

Installs the **startrek-blue** GRUB theme and writes a clean, single-entry GRUB configuration.

| Setting | Value |
|---------|-------|
| Theme path | `/boot/grub/themes/startrek-blue/` |
| Theme source | `danadavis.dev/arch/startrek-blue.zip` |
| Submenus | Disabled (`GRUB_DISABLE_SUBMENU=y`) |
| OS Prober | Disabled (`GRUB_DISABLE_OS_PROBER=true`) |
| Splash | `quiet splash` added to kernel cmdline |

**Partition and kernel detection are fully automatic.** The script uses `findmnt` and `blkid` to detect:

- Your root partition UUID (`root=UUID=…` — stable across hardware changes)
- Your `/boot` partition UUID for the GRUB `search` command
- Your btrfs subvolume `rootflags`, if applicable
- Your microcode image (`amd-ucode.img` or `intel-ucode.img`)
- Your installed kernel by scanning `/boot/vmlinuz-*` at runtime

Kernel detection supports any kernel package — `linux`, `linux-lts`, `linux-zen`, `linux-hardened`, or any custom kernel. If multiple kernels are found you will be prompted to choose one. The matching `initramfs-<kernel>.img` is verified to exist before the GRUB entry is written.

It then writes a clean `/etc/grub.d/40_custom` entry and disables the auto-generated `10_linux` and `30_os-prober` scripts so only your named entry appears in the menu.

You will be prompted to name the menu entry (defaults to `Arch Linux`).

> Existing `/etc/default/grub` and `/etc/grub.d/40_custom` are backed up to `.bak` before any changes are made.

![Star Trek GRUB Theme Preview](https://images.pling.com/img/00/00/83/71/16/2318849/preview.png)

---

### 5. SDDM Display Manager

Installs and enables [SDDM](https://github.com/sddm/sddm) as the system display manager, and applies the [SilentSDDM](https://github.com/uiriansan/SilentSDDM) theme.

| Step | Action |
|------|--------|
| Install | `sddm`, `qt6-declarative` via `pacman` |
| Enable | `systemctl enable sddm` |
| Theme | Cloned from `uiriansan/SilentSDDM` |
| Fallback | If theme install fails, SDDM is still enabled with the default theme |

![SilentSDDM Lockscreen Theme Preview](https://github.com/uiriansan/SilentSDDM/blob/main/backgrounds/default.jpg?raw=true)

---

### 6. Extra Packages (Interactive)

After the main installation steps, you will be given the option to install any additional packages. Enter package names one per line.

**Smart routing:**

- Packages found in the official repositories → installed via `pacman`
- Unknown packages or those prefixed with `aur:` → installed via `yay`

```bash
# Example input
firefox
neovim
aur:zen-browser-bin
```

---

## Pre-flight Checks

Before installing anything, the script runs a series of automatic checks:

| Check | Requirement |
|-------|-------------|
| User | Must not be run as root |
| Commands | `curl`, `unzip`, `git`, `findmnt`, `blkid` — auto-installed if missing |
| Internet | Must be reachable (`curl` to `archlinux.org`) |
| Disk space | At least **5 GB** free on `/` |
| System | Arch or Arch-based (Manjaro, EndeavourOS, Garuda, CachyOS, Artix) |
| TUI tools | `gum` and `fzf` — auto-installed via `pacman` if missing |
| AUR helper | `yay` — auto-built and installed from AUR if missing |

---

## Configuration

You can override default settings by creating a config file at:

```
~/.config/arch-post-install.conf
```

**Available overrides:**

```bash
# Example: point to a local or alternate mirror
BASE_URL="https://mirror.example.com/arch"
```

This file is sourced automatically at startup if it exists.

---

## Logging

Every action is written to a timestamped log file:

```
/tmp/arch-post-install-YYYYMMDD-HHMMSS.log
```

The log persists after the script finishes. Temporary working directories are cleaned up automatically on exit.

If any step fails, the log location is printed to the console so you can inspect what went wrong.

---

## Safety Features

- **Re-entrant** — already-installed packages are detected and skipped gracefully
- **Automatic backups** — GRUB config files get `.bak` copies before modification
- **`set -euo pipefail`** — the script exits immediately on any unexpected error
- **`trap cleanup EXIT`** — temp files are cleaned up even if the script is interrupted
- **No root execution** — the script refuses to run as root; `sudo` is invoked only for specific commands

---

## Compatibility

| Distro | Status |
|--------|--------|
| Arch Linux | ✅ Fully supported |
| EndeavourOS | ✅ Supported |
| Manjaro | ✅ Supported |
| Garuda Linux | ✅ Supported |
| CachyOS | ✅ Supported |
| Artix Linux | ✅ Supported |
| Other Arch-based | ⚠️ Should work, not tested |

---

## Files in This Directory

| File | Description |
|------|-------------|
| `post-install.sh` | The main post-install script |
| `arch-glow.zip` | Plymouth boot splash theme |
| `startrek-blue.zip` | GRUB bootloader theme |

---

## License

This script is part of the [danadavis.dev](https://danadavis.dev) project and is provided as-is for personal use.
