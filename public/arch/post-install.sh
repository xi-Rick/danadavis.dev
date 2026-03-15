#!/usr/bin/env bash
# =============================================================================
#
#     ░█████╗░██████╗░░█████╗░██╗░░██╗    ██╗░░░░░██╗███╗░░██╗██╗░░░██╗██╗░░██╗
#     ██╔══██╗██╔══██╗██╔══██╗██║░░██║    ██║░░░░░██║████╗░██║██║░░░██║╚██╗██╔╝
#     ███████║██████╔╝██║░░╚═╝███████║    ██║░░░░░██║██╔██╗██║██║░░░██║░╚███╔╝░
#     ██╔══██║██╔══██╗██║░░██╗██╔══██║    ██║░░░░░██║██║╚████║██║░░░██║░██╔██╗░
#     ██║░░██║██║░░██║╚█████╔╝██║░░██║    ███████╗██║██║░╚███║╚██████╔╝██╔╝╚██╗
#     ╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝    ╚══════╝╚═╝╚═╝░░╚══╝░╚═════╝░╚═╝░░╚═╝
#
#                   POST-INSTALL SCRIPT  //  danadavis.dev/arch
#
# =============================================================================

set -euo pipefail

# ── Colors ───────────────────────────────────────────────────────────────────
CYAN='\033[0;36m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}${BOLD}[=>]${RESET} $*"; }
success() { echo -e "${GREEN}${BOLD}[OK]${RESET} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[!!]${RESET} $*"; }
error()   { echo -e "${RED}${BOLD}[XX]${RESET} $*"; }
step()    { echo -e "\n${BLUE}${BOLD}━━━ $* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"; }

# ── Assets base URL ───────────────────────────────────────────────────────────
BASE_URL="https://danadavis.dev/arch"

# ── Installation summary log (associative array) ──────────────────────────────
declare -A INSTALL_STATUS=()
SUMMARY_ORDER=()

mark_ok()   { INSTALL_STATUS["$1"]="${GREEN}✓  OK${RESET}";     SUMMARY_ORDER+=("$1"); }
mark_warn() { INSTALL_STATUS["$1"]="${YELLOW}⚠  WARN${RESET}";  SUMMARY_ORDER+=("$1"); }
mark_fail() { INSTALL_STATUS["$1"]="${RED}✗  FAILED${RESET}";   SUMMARY_ORDER+=("$1"); }

# =============================================================================
# 1 ── QUICKSHELL  (must be first — DMS depends on it)
# =============================================================================
step "1/5  Installing Quickshell"

if pacman -Q quickshell &>/dev/null; then
  success "quickshell already installed — skipping"
  mark_ok "Quickshell"
else
  info "Installing quickshell via pacman..."
  if sudo pacman -S --noconfirm quickshell; then
    success "quickshell installed"
    mark_ok "Quickshell"
  else
    error "pacman failed to install quickshell."
    warn  "Attempting AUR fallback with yay..."
    if ! command -v yay &>/dev/null; then
      info "yay not found — installing yay first..."
      sudo pacman -S --noconfirm git base-devel
      git clone https://aur.archlinux.org/yay.git /tmp/yay-install
      (cd /tmp/yay-install && makepkg -si --noconfirm)
      rm -rf /tmp/yay-install
    fi
    if yay -S --noconfirm quickshell; then
      success "quickshell installed via AUR"
      mark_ok "Quickshell"
    else
      error "Could not install quickshell via AUR either."
      warn  "Continuing — DMS may complain about a missing quickshell."
      mark_fail "Quickshell"
    fi
  fi
fi

# =============================================================================
# 2 ── DMS LINUX
# =============================================================================
step "2/5  Installing DMS Linux"

info "Running DMS install script from install.danklinux.com..."
if curl -fsSL https://install.danklinux.com | sh;
  success "DMS Linux installed successfully"
  mark_ok "DMS Linux"
else
  error "DMS install script returned a non-zero exit code."
  warn  "This sometimes happens when quickshell wasn't found in PATH yet."
  warn  "Retry manually:  curl -fsSL https://install.danklinux.com | sh"
  mark_warn "DMS Linux"
fi

# =============================================================================
# 3 ── PLYMOUTH  (glow boot animation)
# =============================================================================
step "3/5  Setting up Plymouth boot animation"

info "Installing plymouth..."
sudo pacman -S --noconfirm plymouth

info "Downloading and extracting glow plymouth theme from ${BASE_URL}/arch-glow.zip..."
PLYMOUTH_THEME_DIR="/usr/share/plymouth/themes/glow"
TEMP_DIR=$(mktemp -d)

# Download the zip file
if curl -fsSL "${BASE_URL}/arch-glow.zip" -o "${TEMP_DIR}/arch-glow.zip"; then
  sudo mkdir -p "$PLYMOUTH_THEME_DIR"
  
  # Extract the zip
  if sudo unzip -o "${TEMP_DIR}/arch-glow.zip" -d "$PLYMOUTH_THEME_DIR"; then
    success "Glow theme extracted successfully"
    
    # Verify required files exist
    if [[ ! -f "${PLYMOUTH_THEME_DIR}/glow.plymouth" ]]; then
      warn "glow.plymouth not found in extracted files — checking for common paths"
      # Try to find and move files if they're in a subdirectory
      find "$PLYMOUTH_THEME_DIR" -name "*.plymouth" -exec sudo mv {} "$PLYMOUTH_THEME_DIR/" \;
      find "$PLYMOUTH_THEME_DIR" -name "*.script" -exec sudo mv {} "$PLYMOUTH_THEME_DIR/" \;
    fi
  else
    error "Failed to extract glow theme zip"
    mark_warn "Plymouth (glow)"
    rm -rf "$TEMP_DIR"
    # Skip to next section
    goto_grub=1
  fi
  rm -rf "$TEMP_DIR"
else
  error "Failed to download glow theme zip from ${BASE_URL}/arch-glow.zip"
  mark_warn "Plymouth (glow)"
fi

if [[ -z "${goto_grub:-}" ]]; then
  info "Setting glow as the default plymouth theme..."
  sudo plymouth-set-default-theme -R glow

  info "Adding plymouth to mkinitcpio HOOKS..."
  if ! grep -q 'plymouth' /etc/mkinitcpio.conf; then
    sudo sed -i 's/\(HOOKS=.*\)udev/\1udev plymouth/' /etc/mkinitcpio.conf
  fi
  sudo mkinitcpio -P

  info "Ensuring quiet splash is set in GRUB cmdline..."
  if ! grep -q 'splash' /etc/default/grub 2>/dev/null; then
    sudo sed -i 's/^\(GRUB_CMDLINE_LINUX_DEFAULT="[^"]*\)"/\1 quiet splash"/' /etc/default/grub
  fi

  success "Plymouth glow theme configured"
  mark_ok "Plymouth (glow)"
fi

# =============================================================================
# 4 ── GRUB STAR TREK THEME  +  menu entry hardening
# =============================================================================
step "4/5  Installing Star Trek GRUB theme"

GRUB_THEME_DIR="/boot/grub/themes/startrek-blue"
TEMP_GRUB_DIR=$(mktemp -d)

# ── 4a. Download and extract theme zip ─────────────────────────────────────
info "Downloading and extracting Star Trek GRUB theme from ${BASE_URL}/startrek-blue.zip..."

if curl -fsSL "${BASE_URL}/startrek-blue.zip" -o "${TEMP_GRUB_DIR}/startrek-blue.zip"; then
  sudo mkdir -p "$GRUB_THEME_DIR"
  
  # Extract the zip
  if sudo unzip -o "${TEMP_GRUB_DIR}/startrek-blue.zip" -d "$GRUB_THEME_DIR"; then
    success "Star Trek theme extracted successfully"
    
    # Check if files are in a subdirectory and move them if needed
    if [[ -d "${GRUB_THEME_DIR}/startrek-blue" ]]; then
      info "Moving theme files from subdirectory..."
      sudo cp -r "${GRUB_THEME_DIR}/startrek-blue"/. "$GRUB_THEME_DIR/"
      sudo rm -rf "${GRUB_THEME_DIR}/startrek-blue"
      sudo rmdir "${GRUB_THEME_DIR}/startrek-blue" 2>/dev/null || true
    fi
    
    # Verify theme.txt exists
    if [[ ! -f "${GRUB_THEME_DIR}/theme.txt" ]]; then
      warn "theme.txt not found in extracted files"
      _grub_ok=false
    else
      _grub_ok=true
    fi
  else
    error "Failed to extract Star Trek theme zip"
    _grub_ok=false
  fi
else
  error "Failed to download Star Trek theme zip from ${BASE_URL}/startrek-blue.zip"
  _grub_ok=false
fi

rm -rf "$TEMP_GRUB_DIR"

# ── 4b. Patch /etc/default/grub (targeted edits only) ────────────────────
info "Patching /etc/default/grub..."

# Set theme
if grep -q '^GRUB_THEME=' /etc/default/grub; then
  sudo sed -i "s|^GRUB_THEME=.*|GRUB_THEME=\"/boot/grub/themes/startrek-blue/theme.txt\"|" /etc/default/grub
else
  echo 'GRUB_THEME="/boot/grub/themes/startrek-blue/theme.txt"' | sudo tee -a /etc/default/grub
fi

# Ensure quiet splash in cmdline
if ! grep -q 'splash' /etc/default/grub; then
  sudo sed -i 's/^\(GRUB_CMDLINE_LINUX_DEFAULT="[^"]*\)"/\1 quiet splash"/' /etc/default/grub
fi

# Disable submenu (keeps boot menu flat)
if ! grep -q '^GRUB_DISABLE_SUBMENU' /etc/default/grub; then
  echo 'GRUB_DISABLE_SUBMENU=y' | sudo tee -a /etc/default/grub
else
  sudo sed -i 's/^#\?GRUB_DISABLE_SUBMENU=.*/GRUB_DISABLE_SUBMENU=y/' /etc/default/grub
fi

# ── 4c. Extract the real menuentry and create custom entry ─────────────────
info "Generating custom menu entry for 40_custom..."

# Temporarily enable 10_linux to generate entries, capture output.
# Keep stderr so we can diagnose failures, but don't let it pollute RAW_GRUB.
sudo chmod +x /etc/grub.d/10_linux
GRUB_MKCONFIG_STDERR=$(mktemp)
RAW_GRUB=$(sudo grub-mkconfig 2>"$GRUB_MKCONFIG_STDERR")
if [[ -s "$GRUB_MKCONFIG_STDERR" ]]; then
  warn "grub-mkconfig produced stderr output:"
  while IFS= read -r line; do warn "  $line"; done < "$GRUB_MKCONFIG_STDERR"
fi
rm -f "$GRUB_MKCONFIG_STDERR"

# Disable 10_linux and 30_uefi-firmware now that we have what we need.
sudo chmod -x /etc/grub.d/10_linux
sudo chmod -x /etc/grub.d/30_uefi-firmware 2>/dev/null || warn "30_uefi-firmware not found — skipping"

# ------------------------------------------------------------------
# Robust menuentry extractor
#
# Strategy:
#   1. Split RAW_GRUB into self-contained menuentry blocks using a
#      line-by-line brace counter that ignores braces inside single-
#      quoted strings (the most common source of miscounts).
#   2. Score each candidate block and pick the best one:
#        - penalise blocks whose title or --class flags contain
#          'recovery', 'fallback', 'memtest', 'uefi', 'firmware',
#          'windows', 'efi' (case-insensitive)
#        - prefer blocks that reference the running kernel via
#          /boot/vmlinuz* or contain 'linux' in their title
#        - among equal-score blocks, take the first one
#   3. Verify the winner actually looks like a bootable Arch entry
#      before writing it; bail out with a clear error if not.
# ------------------------------------------------------------------

extract_menuentry_blocks() {
  # Emit each menuentry block as a NUL-delimited record so multi-line
  # blocks survive the pipeline intact.
  local line block="" depth=0 in_entry=0

  while IFS= read -r line; do
    if [[ $in_entry -eq 0 ]]; then
      # Wait for a menuentry line (must start at column 0)
      [[ "$line" =~ ^menuentry[[:space:]] ]] || continue
      in_entry=1
      depth=0
      block="$line"$'\n'
    else
      block+="$line"$'\n'
    fi

    # Count unquoted braces only.
    # Strip single-quoted segments (e.g. 'quiet splash') before counting.
    local stripped="$line"
    # Remove single-quoted strings (handles the common grub quoting style)
    stripped="${stripped//\'[^\']*\'/}"
    # Now tally
    local opens="${stripped//[^{]/}"
    local closes="${stripped//[^}]/}"
    (( depth += ${#opens} - ${#closes} )) || true

    if [[ $in_entry -eq 1 && $depth -le 0 && ${#block} -gt 0 ]]; then
      # Emit the completed block NUL-terminated
      printf '%s\0' "$block"
      block=""
      depth=0
      in_entry=0
    fi
  done <<< "$1"
}

score_block() {
  # Returns an integer score — higher is better (more likely to be the
  # primary Arch boot entry we want).
  local block="$1"
  local score=0

  # Extract the menuentry title line
  local title_line
  title_line=$(head -n1 <<< "$block")

  # Penalise clearly-unwanted entries
  local lc_title="${title_line,,}"  # lowercase
  for bad in recovery fallback memtest uefi firmware windows 'efi shell'; do
    if [[ "$lc_title" == *"$bad"* ]]; then
      (( score -= 10 )) || true
    fi
  done

  # Bonus: title mentions 'arch linux' (or just 'arch')
  [[ "$lc_title" == *"arch linux"* ]] && (( score += 5 )) || true
  [[ "$lc_title" == *"arch"* ]]       && (( score += 2 )) || true

  # Bonus: block contains a linux line pointing at /boot/vmlinuz
  if grep -qE '^\s+linux\s+/boot/vmlinuz' <<< "$block"; then
    (( score += 3 )) || true
  fi

  # Bonus: block contains an initrd line (rules out stubs / chainloaders)
  if grep -qE '^\s+initrd\s' <<< "$block"; then
    (( score += 2 )) || true
  fi

  echo "$score"
}

# Collect all blocks into an array
mapfile -d '' BLOCKS < <(extract_menuentry_blocks "$RAW_GRUB")

if [[ ${#BLOCKS[@]} -eq 0 ]]; then
  error "grub-mkconfig produced no menuentry blocks at all."
  warn  "40_custom will be left as-is. Edit it manually if needed."
  _grub_ok=false
else
  info "Found ${#BLOCKS[@]} menuentry block(s) — scoring candidates..."

  best_score=-999
  best_idx=0
  for i in "${!BLOCKS[@]}"; do
    s=$(score_block "${BLOCKS[$i]}")
    title=$(head -n1 <<< "${BLOCKS[$i]}")
    info "  [${i}] score=${s}  ${title:0:72}"
    if (( s > best_score )); then
      best_score=$s
      best_idx=$i
    fi
  done

  MENUENTRY="${BLOCKS[$best_idx]}"
  info "Selected block [$best_idx] (score=${best_score})"

  # Sanity-check: must have at least a linux + initrd line
  if ! grep -qE '^\s+linux\s' <<< "$MENUENTRY" || \
     ! grep -qE '^\s+initrd\s' <<< "$MENUENTRY"; then
    error "Selected menuentry does not contain 'linux' and 'initrd' lines."
    error "It may be a chainloader or stub — refusing to write it."
    warn  "Raw block:"
    while IFS= read -r line; do warn "  $line"; done <<< "$MENUENTRY"
    warn  "Edit /etc/grub.d/40_custom manually if needed."
    _grub_ok=false
    MENUENTRY=""
  fi
fi

if [[ -n "${MENUENTRY:-}" ]]; then
  # Rename the entry title and silence the progress echo lines
  MENUENTRY=$(
    sed "s/^menuentry '[^']*'/menuentry 'just one...Arch Linux'/" <<< "$MENUENTRY" \
    | sed "s/^menuentry \"[^\"]*\"/menuentry 'just one...Arch Linux'/" \
    | sed 's/^\([[:space:]]*\)echo[[:space:]]/\1#echo /'
  )

  info "Writing /etc/grub.d/40_custom..."
  {
    printf '#!/bin/sh\n'
    printf 'exec tail -n +3 $0\n'
    printf '# This file provides an easy way to add custom menu entries.  Simply type the\n'
    printf '# menu entries you want to add after this comment.  Be careful not to change\n'
    printf "# the 'exec tail' line above.\n"
    printf '%s\n' "$MENUENTRY"
  } | sudo tee /etc/grub.d/40_custom > /dev/null
  sudo chmod +x /etc/grub.d/40_custom
  success "40_custom written with live-extracted menuentry (score=${best_score})"
fi

# ── 4d. Final grub-mkconfig with 10_linux disabled ──────────────────
info "Regenerating /boot/grub/grub.cfg..."
sudo grub-mkconfig -o /boot/grub/grub.cfg

if $_grub_ok; then
  success "Star Trek GRUB theme applied — single 'just one...Arch Linux' entry set"
  mark_ok "GRUB (Star Trek)"
else
  warn "GRUB config written but some theme assets were missing — check ${GRUB_THEME_DIR}"
  mark_warn "GRUB (Star Trek)"
fi

# =============================================================================
# 5 ── SDDM  +  SilentSDDM theme
# =============================================================================
step "5/5  Installing SDDM + SilentSDDM theme"

info "Installing sddm and dependencies..."
sudo pacman -S --noconfirm sddm qt6-declarative

info "Enabling sddm service..."
sudo systemctl enable sddm

info "Cloning SilentSDDM theme..."
SILENT_TMP=$(mktemp -d)
git clone -b main --depth=1 https://github.com/uiriansan/SilentSDDM "$SILENT_TMP/SilentSDDM"
(cd "$SILENT_TMP/SilentSDDM" && sudo ./install.sh)
rm -rf "$SILENT_TMP"

success "SilentSDDM installed"
mark_ok "SilentSDDM"

# =============================================================================
# EXTRA PACKAGES  ── interactive prompt  (pacman + yay)
# =============================================================================
step "Extra Package Installer"

# Ensure yay is available before we start taking input
if ! command -v yay &>/dev/null; then
  info "yay not found — installing it now so AUR packages work..."
  sudo pacman -S --noconfirm git base-devel
  git clone https://aur.archlinux.org/yay.git /tmp/yay-install
  (cd /tmp/yay-install && makepkg -si --noconfirm)
  rm -rf /tmp/yay-install
  success "yay installed"
fi

# Queues: packages confirmed in pacman repos, packages to try via yay (AUR + repos), failures
PACMAN_PKGS=()
YAY_PKGS=()
EXTRA_FAILED=()

echo -e "${MAGENTA}${BOLD}"
cat <<'BANNER'
  ╔──────────────────────────────────────────────────────────────────────╗
  │                                                                      │
  │   Install anything else? Both pacman (official) and yay (AUR)       │
  │   are supported.                                                     │
  │                                                                      │
  │   Syntax:                                                            │
  │     packagename          → auto-detect (pacman first, yay fallback) │
  │     aur:packagename      → force yay / AUR                          │
  │                                                                      │
  │   • Space-separate multiple packages per line                        │
  │   • Press Enter on a blank line when you're done                     │
  │                                                                      │
  │   Examples:                                                          │
  │     firefox neovim btop mpv discord                                  │
  │     aur:spotify aur:visual-studio-code-bin zen-browser               │
  │                                                                      │
  ╚──────────────────────────────────────────────────────────────────────╝
BANNER
echo -e "${RESET}"

while true; do
  echo -ne "${MAGENTA}${BOLD}  packages> ${RESET}"
  read -r -e pkg_input

  [[ -z "$pkg_input" ]] && break

  read -ra pkg_words <<< "$pkg_input"

  for token in "${pkg_words[@]}"; do
    # aur: prefix → force yay
    if [[ "$token" == aur:* ]]; then
      pkg="${token#aur:}"
      YAY_PKGS+=("$pkg")
      echo -e "    ${CYAN}A${RESET} ${BOLD}${pkg}${RESET}  ${DIM}queued via yay (AUR)${RESET}"

    # check pacman official repos first
    elif pacman -Si "$token" &>/dev/null; then
      PACMAN_PKGS+=("$token")
      echo -e "    ${GREEN}P${RESET} ${BOLD}${token}${RESET}  ${DIM}queued via pacman${RESET}"

    # not in official repos — try yay (covers AUR + official)
    elif yay -Si "$token" &>/dev/null 2>&1; then
      YAY_PKGS+=("$token")
      echo -e "    ${CYAN}A${RESET} ${BOLD}${token}${RESET}  ${DIM}not in official repos — queued via yay${RESET}"

    else
      echo -e "    ${RED}✗${RESET} ${BOLD}${token}${RESET}  ${DIM}not found in pacman or AUR — skipping${RESET}"
    fi
  done

  echo ""
  [[ ${#PACMAN_PKGS[@]} -gt 0 ]] && echo -e "  ${DIM}pacman queue : ${PACMAN_PKGS[*]}${RESET}"
  [[ ${#YAY_PKGS[@]}   -gt 0 ]] && echo -e "  ${DIM}yay queue    : ${YAY_PKGS[*]}${RESET}"
  echo -e "  ${DIM}Add more, or press Enter to install now.${RESET}"
  echo ""
done

_total=$(( ${#PACMAN_PKGS[@]} + ${#YAY_PKGS[@]} ))

if [[ $_total -eq 0 ]]; then
  info "No extra packages queued — skipping."
  mark_ok "Extra packages  (none)"
else
  # ── pacman installs ──────────────────────────────────────────────────────
  if [[ ${#PACMAN_PKGS[@]} -gt 0 ]]; then
    echo ""
    echo -e "${BLUE}${BOLD}  [pacman] Installing ${#PACMAN_PKGS[@]} package(s): ${PACMAN_PKGS[*]}${RESET}"
    echo ""
    for pkg in "${PACMAN_PKGS[@]}"; do
      if sudo pacman -S --noconfirm "$pkg"; then
        success "pacman: $pkg"
      else
        error   "pacman failed: $pkg"
        EXTRA_FAILED+=("$pkg")
      fi
    done
  fi

  # ── yay installs ─────────────────────────────────────────────────────────
  if [[ ${#YAY_PKGS[@]} -gt 0 ]]; then
    echo ""
    echo -e "${BLUE}${BOLD}  [yay]    Installing ${#YAY_PKGS[@]} package(s): ${YAY_PKGS[*]}${RESET}"
    echo ""
    for pkg in "${YAY_PKGS[@]}"; do
      if yay -S --noconfirm "$pkg"; then
        success "yay: $pkg"
      else
        error   "yay failed: $pkg"
        EXTRA_FAILED+=("$pkg")
      fi
    done
  fi

  # ── result ────────────────────────────────────────────────────────────────
  if [[ ${#EXTRA_FAILED[@]} -eq 0 ]]; then
    success "All $_total extra package(s) installed successfully."
    mark_ok "Extra packages  ($_total installed)"
  else
    warn "Failed packages: ${EXTRA_FAILED[*]}"
    warn "Retry pacman:  sudo pacman -S <pkg>"
    warn "Retry yay:     yay -S <pkg>"
    mark_warn "Extra packages  (${#EXTRA_FAILED[@]} failed)"
  fi
fi

# =============================================================================
# FINAL SUMMARY
# =============================================================================
echo ""
echo -e "${BLUE}${BOLD}"
echo "  ╔══════════════════════════════════════════════════════════════════╗"
echo "  ║                    INSTALLATION SUMMARY                         ║"
echo "  ╠══════════════════════════════════════════════════════════════════╣"
for component in "${SUMMARY_ORDER[@]}"; do
  status="${INSTALL_STATUS[$component]}"
  label=$(printf "%-36s" "$component")
  echo -e "  ║  ${RESET}${BOLD}${label}${RESET}  $(echo -e "$status")${BLUE}${BOLD}"
done
echo "  ╠══════════════════════════════════════════════════════════════════╣"
echo "  ║                                                                  ║"
echo -e "  ║   ${GREEN}${BOLD}All done.  sudo reboot  and enjoy your setup.${BLUE}${BOLD}              ║"
echo "  ║                                                                  ║"
echo "  ╚══════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"
