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

# ── Configuration ────────────────────────────────────────────────────────────
BASE_URL="https://danadavis.dev/arch"
SCRIPT_NAME="$(basename "$0")"
LOG_FILE="/tmp/arch-post-install-$(date +%Y%m%d-%H%M%S).log"

# ── Colors (minimal, just for accents) ──────────────────────────────────────
readonly RESET='\033[0m'
readonly BOLD='\033[1m'
readonly DIM='\033[2m'
readonly CYAN='\033[0;36m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'

# ── Global state ────────────────────────────────────────────────────────────
INSTALLED=()
FAILED=()
SKIPPED=()

# ── Optional config override ─────────────────────────────────────────────────
# You can create ~/.config/arch-post-install.conf to override any defaults.
# Example: BASE_URL="https://mirror.example.com/arch"
CONFIG_FILE="${HOME}/.config/arch-post-install.conf"
if [[ -f "$CONFIG_FILE" ]]; then
    # shellcheck source=/dev/null
    source "$CONFIG_FILE"
fi

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Log to file (always) and optionally to console with formatting
log() {
    local level="$1"
    local message="$2"
    local color="$3"
    local timestamp=$(date '+%H:%M:%S')

    # Always write to log file
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"

    # Console output with color
    if [[ -t 1 ]]; then  # Only if stdout is a terminal
        echo -e "${color}${BOLD}[${level}]${RESET} ${message}"
    fi
}

log_info()    { log "INFO"    "$1" "$CYAN"; }
log_success() { log "OK"      "$1" "$GREEN"; }
log_warn()    { log "WARN"    "$1" "$YELLOW"; }
log_error()   { log "ERROR"   "$1" "$RED"; }

# Check if running with sudo
check_sudo() {
    if [[ $EUID -eq 0 ]]; then
        echo -e "${RED}${BOLD}[ERROR]${RESET} This script should NOT be run as root directly."
        echo -e "${RED}${BOLD}[ERROR]${RESET} It will ask for sudo when needed. Please run as normal user."
        exit 1
    fi
}

# Cleanup function
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        echo
        log_error "Script interrupted or failed (exit code: $exit_code)"
        log_info "Check the log file for details: $LOG_FILE"
    fi
    # Remove any temporary files (but keep the log)
    find /tmp -maxdepth 1 -name 'arch-post-*' ! -name "$(basename "$LOG_FILE")" -exec rm -rf {} + 2>/dev/null || true
}

trap cleanup EXIT

# =============================================================================
# PRE-FLIGHT CHECKS
# =============================================================================

preflight_check() {
    log_info "Running pre-flight checks..."

        # Install required system commands if missing
        local required_cmds=("curl" "unzip" "git" "findmnt" "util-linux")
        local missing_pkgs=()
        for cmd in curl unzip git findmnt blkid; do
            if ! command -v "$cmd" &>/dev/null; then
                case "$cmd" in
                    blkid|findmnt) missing_pkgs+=("util-linux") ;;
                    *) missing_pkgs+=("$cmd") ;;
                esac
            fi
        done
        # Deduplicate and install only if there are missing packages
        if [[ ${#missing_pkgs[@]} -gt 0 ]]; then
            local unique_pkgs
            mapfile -t unique_pkgs < <(printf '%s\n' "${missing_pkgs[@]}" | sort -u)
            if [[ ${#unique_pkgs[@]} -gt 0 ]]; then
                log_info "Installing missing system tools: ${unique_pkgs[*]}"
                sudo pacman -S --noconfirm --needed "${unique_pkgs[@]}" >> "$LOG_FILE" 2>&1 || {
                    log_error "Failed to install required tools: ${unique_pkgs[*]}"
                    exit 1
                }
            fi
        fi
    log_success "Required commands present"

    # Check internet connectivity (curl is more reliable than ping across firewalls)
    if ! curl -fsSL --max-time 5 --head https://archlinux.org &>/dev/null; then
        log_error "No internet connection detected. Please connect and try again."
        exit 1
    fi
    log_success "Internet connectivity confirmed"

    # Check available disk space (require at least 5GB free)
    local required_kb=5242880
    local available_kb
    available_kb=$(df / --output=avail | tail -1 | tr -d ' ')
    if (( available_kb < required_kb )); then
        log_error "Insufficient disk space. Need 5GB free, have $(( available_kb / 1024 / 1024 ))GB"
        exit 1
    fi
    log_success "Disk space OK ($(( available_kb / 1024 / 1024 ))GB free)"

    # Verify Arch-based system
    if [[ -f /etc/arch-release ]]; then
        log_success "Arch Linux detected"
    elif grep -qi "arch\|manjaro\|endeavouros\|garuda\|cachyos\|artix" /etc/os-release 2>/dev/null; then
        log_success "Arch-based system detected"
    else
        log_warn "Could not confirm Arch-based system — proceeding anyway"
    fi

    # Install required TUI deps (gum and fzf) if not already present
    local tui_pkgs=()
    command -v gum &>/dev/null || tui_pkgs+=("gum")
    command -v fzf &>/dev/null || tui_pkgs+=("fzf")
    if [[ ${#tui_pkgs[@]} -gt 0 ]]; then
        log_info "Installing required TUI tools: ${tui_pkgs[*]}"
        sudo pacman -S --noconfirm "${tui_pkgs[@]}" >> "$LOG_FILE" 2>&1 || {
            log_error "Failed to install required TUI tools: ${tui_pkgs[*]}"
            exit 1
        }
        log_success "TUI tools installed: ${tui_pkgs[*]}"
    fi

    # Install yay (AUR helper) if not already present
    if ! command -v yay &>/dev/null; then
        log_info "Installing yay (AUR helper)..."
        sudo pacman -S --noconfirm --needed git base-devel >> "$LOG_FILE" 2>&1 || {
            log_error "Failed to install git/base-devel for yay"
            exit 1
        }
        git clone https://aur.archlinux.org/yay.git /tmp/arch-post-yay >> "$LOG_FILE" 2>&1 || {
            log_error "Failed to clone yay repository"
            exit 1
        }
        (cd /tmp/arch-post-yay && makepkg -si --noconfirm) >> "$LOG_FILE" 2>&1 || {
            log_error "Failed to build/install yay"
            rm -rf /tmp/arch-post-yay
            exit 1
        }
        rm -rf /tmp/arch-post-yay
        log_success "yay installed"
    fi
}



# =============================================================================
# TUI COMPONENTS (with fallback)
# =============================================================================

show_header() {
    clear
    echo -e "${BLUE}${BOLD}"
    cat << 'EOF'
    █████╗ ██████╗  ██████╗██╗  ██╗    ██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗
   ██╔══██╗██╔══██╗██╔════╝██║  ██║    ██║     ██║████╗  ██║██║   ██║╚██╗██╔╝
   ███████║██████╔╝██║     ███████║    ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝
   ██╔══██║██╔══██╗██║     ██╔══██║    ██║     ██║██║╚████║██║   ██║ ██╔██╗
   ██║  ██║██║  ██║╚██████╗██║  ██║    ███████╗██║██║ ╚███║╚██████╔╝██╔╝╚██╗
   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝╚═╝╚═╝  ╚══╝ ╚═════╝ ╚═╝  ╚═╝
EOF
    echo -e "${RESET}"
    echo -e "${DIM}  ════════════════════════════════════════════════════════════════════${RESET}"
    echo -e "${CYAN}  ⚡ Post-install configurator | ${BOLD}danadavis.dev/arch${RESET}${CYAN} | $(date '+%Y-%m-%d')${RESET}"
    echo -e "${DIM}  ════════════════════════════════════════════════════════════════════${RESET}\n"
}

show_progress() {
    local current="$1"
    local total="$2"
    local message="$3"
    local percent=$((current * 100 / total))
    local width=50
    local filled=$((percent * width / 100))
    local empty=$((width - filled))

    printf "\r${CYAN}${BOLD}[%3d%%${RESET}${CYAN}]${RESET} " "$percent"
    printf "${BLUE}${BOLD}"
    printf "%${filled}s" | tr ' ' '━'
    printf "${RESET}${DIM}"
    printf "%${empty}s" | tr ' ' '━'
    printf "${RESET} ${message}"
}

ask_yes_no() {
    if [[ "${2:-n}" == "y" ]]; then
        gum confirm --default=true --affirmative="Yes" --negative="No" "$1" && return 0 || return 1
    else
        gum confirm --default=false --affirmative="Yes" --negative="No" "$1" && return 0 || return 1
    fi
}

select_packages() {
    local -n packages_ref=$1

    if [[ ${#packages_ref[@]} -eq 0 ]]; then
        return 1
    fi

    local tmp_file=$(mktemp)
    printf '%s\n' "${packages_ref[@]}" > "$tmp_file"

    local selected
    selected=$(gum choose --no-limit --height=15 --header="📦 Select packages to install (space to select, enter to confirm):" < "$tmp_file")
    rm -f "$tmp_file"

    if [[ -n "$selected" ]]; then
        mapfile -t packages_ref <<< "$selected"
        return 0
    else
        packages_ref=()
        return 1
    fi
}

show_border_message() {
    gum style --border double --padding "1 2" --border-foreground 36 "$1"
}

# =============================================================================
# INSTALLATION FUNCTIONS
# =============================================================================

ensure_yay() {
    if ! command -v yay &>/dev/null; then
        log_error "yay is not installed. This should have been caught in pre-flight. Aborting."
        exit 1
    fi
}

install_quickshell() {
    log_info "Installing quickshell-git (AUR)..."

    if pacman -Q quickshell-git &>/dev/null 2>&1; then
        log_success "quickshell-git already installed"
        SKIPPED+=("quickshell-git")
        return 0
    fi

    ensure_yay

    if yay -S --noconfirm quickshell-git >> "$LOG_FILE" 2>&1; then
        log_success "quickshell-git installed"
        INSTALLED+=("quickshell-git")
        return 0
    else
        log_error "Failed to install quickshell-git"
        FAILED+=("quickshell-git")
        return 1
    fi
}

install_dms() {
    log_info "Installing DMS Linux..."

    local dms_script
    if ! dms_script=$(curl -fsSL https://install.danklinux.com 2>> "$LOG_FILE"); then
        log_error "Failed to download DMS Linux installer"
        FAILED+=("DMS Linux")
        return 1
    fi

    if echo "$dms_script" | sh >> "$LOG_FILE" 2>&1; then
        log_success "DMS Linux installed"
        INSTALLED+=("DMS Linux")
        return 0
    else
        log_error "DMS Linux installation failed"
        FAILED+=("DMS Linux")
        return 1
    fi
}

install_plymouth() {
    log_info "Setting up Plymouth with glow theme..."

    # Install plymouth
    if ! pacman -Q plymouth &>/dev/null; then
        sudo pacman -S --noconfirm plymouth >> "$LOG_FILE" 2>&1 || {
            log_error "Failed to install plymouth"
            FAILED+=("Plymouth")
            return 1
        }
    fi

    # Download and setup theme
    local theme_dir="/usr/share/plymouth/themes/arch-glow"
    local temp_dir=$(mktemp -d)

    # Download theme
    if ! curl -fsSL "${BASE_URL}/arch-glow.zip" -o "${temp_dir}/arch-glow.zip"; then
        log_error "Failed to download glow theme"
        FAILED+=("Plymouth Theme")
        rm -rf "$temp_dir"
        return 1
    fi

    # Clean existing theme
    sudo rm -rf "$theme_dir"
    sudo mkdir -p "$theme_dir"

    # Extract
    if ! sudo unzip -o "${temp_dir}/arch-glow.zip" -d "$theme_dir" >> "$LOG_FILE" 2>&1; then
        log_error "Failed to extract glow theme"
        FAILED+=("Plymouth Theme")
        rm -rf "$temp_dir"
        return 1
    fi

    # Handle subdirectory if present
    if [[ -d "${theme_dir}/arch-glow" ]]; then
        sudo cp -r "${theme_dir}/arch-glow"/. "$theme_dir/"
        sudo rm -rf "${theme_dir}/arch-glow"
    fi

    # Check for theme file
    local theme_file=""
    if [[ -f "${theme_dir}/arch-glow.plymouth" ]]; then
        theme_file="arch-glow"
    elif [[ -f "${theme_dir}/glow.plymouth" ]]; then
        theme_file="glow"
    else
        log_error "No valid theme file found in extracted files"
        FAILED+=("Plymouth Theme")
        rm -rf "$temp_dir"
        return 1
    fi

    # Set theme
    sudo plymouth-set-default-theme -R "$theme_file" >> "$LOG_FILE" 2>&1

    # Add to mkinitcpio if not present
    if ! grep -q 'plymouth' /etc/mkinitcpio.conf; then
        sudo sed -i 's/\(HOOKS=.*\)udev/\1udev plymouth/' /etc/mkinitcpio.conf
        sudo mkinitcpio -P >> "$LOG_FILE" 2>&1
    fi

    rm -rf "$temp_dir"
    log_success "Plymouth glow theme configured"
    INSTALLED+=("Plymouth")
    return 0
}

install_grub_theme() {
    log_info "Installing Star Trek GRUB theme..."

    local theme_dir="/boot/grub/themes/startrek-blue"
    local temp_dir=$(mktemp -d)

    # Ask the user what to call the single GRUB menu entry
    local entry_name
    entry_name=$(gum input \
        --header "GRUB menu entry name (leave blank for default):" \
        --placeholder "Arch Linux" \
        --value "Arch Linux") || entry_name="Arch Linux"
    [[ -z "$entry_name" ]] && entry_name="Arch Linux"
    log_info "GRUB entry will be named: '${entry_name}'"

    # Backup original configs
    for f in /etc/default/grub /etc/grub.d/40_custom; do
        if [[ -f "$f" && ! -f "${f}.bak" ]]; then
            sudo cp "$f" "${f}.bak"
        fi
    done

    # Download theme
    if ! curl -fsSL "${BASE_URL}/startrek-blue.zip" -o "${temp_dir}/startrek-blue.zip"; then
        log_error "Failed to download GRUB theme"
        FAILED+=("GRUB Theme")
        rm -rf "$temp_dir"
        return 1
    fi

    # Clean and extract
    sudo rm -rf "$theme_dir"
    sudo mkdir -p "$theme_dir"

    if ! sudo unzip -o "${temp_dir}/startrek-blue.zip" -d "$theme_dir" >> "$LOG_FILE" 2>&1; then
        log_error "Failed to extract GRUB theme"
        FAILED+=("GRUB Theme")
        rm -rf "$temp_dir"
        return 1
    fi

    # Handle subdirectory
    if [[ -d "${theme_dir}/startrek-blue" ]]; then
        sudo cp -r "${theme_dir}/startrek-blue"/. "$theme_dir/"
        sudo rm -rf "${theme_dir}/startrek-blue"
    fi

    # Verify theme file
    if [[ ! -f "${theme_dir}/theme.txt" ]]; then
        log_error "theme.txt not found in extracted files"
        FAILED+=("GRUB Theme")
        rm -rf "$temp_dir"
        return 1
    fi

    # ── /etc/default/grub settings ───────────────────────────────────────────

    # Set theme path
    if grep -q '^GRUB_THEME=' /etc/default/grub; then
        sudo sed -i "s|^GRUB_THEME=.*|GRUB_THEME=\"${theme_dir}/theme.txt\"|" /etc/default/grub
    else
        echo "GRUB_THEME=\"${theme_dir}/theme.txt\"" | sudo tee -a /etc/default/grub > /dev/null
    fi

    # Ensure quiet splash in kernel cmdline
    if ! grep -q 'splash' /etc/default/grub; then
        sudo sed -i 's/^\(GRUB_CMDLINE_LINUX_DEFAULT="[^"]*\)"/\1 quiet splash"/' /etc/default/grub
    fi

    # Disable submenus (keeps the single entry at the top level)
    if grep -q '^#\?GRUB_DISABLE_SUBMENU' /etc/default/grub; then
        sudo sed -i 's/^#\?GRUB_DISABLE_SUBMENU=.*/GRUB_DISABLE_SUBMENU=y/' /etc/default/grub
    else
        echo 'GRUB_DISABLE_SUBMENU=y' | sudo tee -a /etc/default/grub > /dev/null
    fi

    # Suppress os-prober so other OSes don't sneak in extra entries
    if grep -q '^#\?GRUB_DISABLE_OS_PROBER' /etc/default/grub; then
        sudo sed -i 's/^#\?GRUB_DISABLE_OS_PROBER=.*/GRUB_DISABLE_OS_PROBER=true/' /etc/default/grub
    else
        echo 'GRUB_DISABLE_OS_PROBER=true' | sudo tee -a /etc/default/grub > /dev/null
    fi

    # ── Disable auto-generated entry scripts ─────────────────────────────────
    # 10_linux produces "Arch Linux, with Linux linux" entries; we replace it
    # entirely with our own 40_custom entry, so disable both auto-generators.
    sudo chmod -x /etc/grub.d/10_linux      2>/dev/null || true
    sudo chmod -x /etc/grub.d/30_os-prober  2>/dev/null || true

    # ── Detect partition layout ───────────────────────────────────────────────
    local boot_src boot_uuid root_dev root_subvol root_dev_raw microcode_img initrd_line rootflags

    # findmnt may append a btrfs subvolume in brackets, e.g. /dev/sda1[/@]
    # Strip that suffix for blkid/kernel root= and preserve it for rootflags.
    root_dev_raw=$(findmnt -n -o SOURCE / 2>/dev/null || echo "")
    if [[ "$root_dev_raw" =~ \[([^]]+)\]$ ]]; then
        root_subvol="${BASH_REMATCH[1]}"
        root_dev="${root_dev_raw%\[*}"
    else
        root_subvol=""
        root_dev="$root_dev_raw"
    fi

    # If /boot is a separate partition, its UUID is what GRUB searches for;
    # otherwise fall back to the root partition's UUID.
    boot_src=$(findmnt -n -o SOURCE /boot 2>/dev/null || echo "")
    # Strip any subvolume suffix from boot_src as well
    boot_src="${boot_src%\[*}"
    if [[ -n "$boot_src" ]]; then
        boot_uuid=$(sudo blkid -s UUID -o value "$boot_src" 2>/dev/null || echo "")
    else
        boot_uuid=$(sudo blkid -s UUID -o value "$root_dev" 2>/dev/null || echo "")
    fi

    if [[ -z "$boot_uuid" || -z "$root_dev" ]]; then
        log_error "Could not detect required partition info (root: '${root_dev}', boot UUID: '${boot_uuid}'). Cannot write a valid GRUB entry."
        FAILED+=("GRUB Entry")
        rm -rf "$temp_dir"
        return 1
    fi

    # Build rootflags for btrfs subvolume if needed
    rootflags=""
    [[ -n "$root_subvol" ]] && rootflags=" rootflags=subvol=${root_subvol}"

    if [[ -f /boot/amd-ucode.img ]]; then
        microcode_img="/amd-ucode.img"
    elif [[ -f /boot/intel-ucode.img ]]; then
        microcode_img="/intel-ucode.img"
    else
        microcode_img=""
    fi

    local tab=$'\t'
    if [[ -n "$microcode_img" ]]; then
        initrd_line="initrd${tab}${microcode_img} /initramfs-linux.img"
    else
        initrd_line="initrd${tab}/initramfs-linux.img"
    fi

    # ── Write the single, clean GRUB entry ───────────────────────────────────
    sudo tee /etc/grub.d/40_custom > /dev/null << EOF
#!/bin/sh
exec tail -n +3 \$0
# Single GRUB entry — generated by arch-post-install
menuentry '${entry_name}' --class arch --class gnu-linux --class gnu --class os {
	load_video
	set gfxpayload=keep
	insmod gzio
	insmod part_gpt
	insmod fat
	search --no-floppy --fs-uuid --set=root ${boot_uuid}
	linux	/vmlinuz-linux root=${root_dev} rw quiet splash${rootflags}
	${initrd_line}
}
EOF
    sudo chmod +x /etc/grub.d/40_custom

    log_info "GRUB entry '${entry_name}' written (root: ${root_dev}, boot UUID: ${boot_uuid})"

    # ── Regenerate GRUB config ────────────────────────────────────────────────
    if ! sudo grub-mkconfig -o /boot/grub/grub.cfg >> "$LOG_FILE" 2>&1; then
        log_error "Failed to regenerate GRUB config"
        FAILED+=("GRUB Config")
        rm -rf "$temp_dir"
        return 1
    fi

    rm -rf "$temp_dir"
    log_success "GRUB theme installed — '${entry_name}' is the only menu entry"
    INSTALLED+=("GRUB Theme")
    return 0
}

install_sddm() {
    log_info "Setting up SDDM with SilentSDDM theme..."

    # Install SDDM
    if ! pacman -Q sddm &>/dev/null; then
        sudo pacman -S --noconfirm sddm qt6-declarative >> "$LOG_FILE" 2>&1 || {
            log_error "Failed to install SDDM"
            FAILED+=("SDDM")
            return 1
        }
    fi

    # Enable SDDM
    sudo systemctl enable sddm >> "$LOG_FILE" 2>&1

    # Install theme
    local temp_dir=$(mktemp -d)
    if git clone --depth=1 https://github.com/uiriansan/SilentSDDM "$temp_dir/SilentSDDM" >> "$LOG_FILE" 2>&1; then
        if (cd "$temp_dir/SilentSDDM" && sudo ./install.sh >> "$LOG_FILE" 2>&1); then
            log_success "SilentSDDM installed"
            INSTALLED+=("SDDM")
        else
            log_warn "SilentSDDM install.sh failed; SDDM is enabled with default theme"
            INSTALLED+=("SDDM (default theme)")
        fi
    else
        log_warn "Failed to clone SilentSDDM; SDDM is enabled with default theme"
        INSTALLED+=("SDDM (default theme)")
    fi

    rm -rf "$temp_dir"
    return 0
}

install_extra_packages() {
    echo
    log_info "Extra package installation"
    echo

    # Get list of packages
    local packages=()

    local temp_file=$(mktemp)
    gum write --placeholder="Enter package names (one per line, press Ctrl+D when done)" > "$temp_file"

    if [[ -s "$temp_file" ]]; then
        mapfile -t packages < "$temp_file"
    fi
    rm -f "$temp_file"

    if [[ ${#packages[@]} -eq 0 ]]; then
        log_info "No packages entered"
        return 0
    fi

    # Let user confirm/deselect from the entered list
    if ! select_packages packages; then
        log_info "No packages selected"
        return 0
    fi

    # Categorize packages
    local pacman_pkgs=()
    local aur_pkgs=()

    for pkg in "${packages[@]}"; do
        pkg="${pkg#"${pkg%%[![:space:]]*}"}"
        pkg="${pkg%"${pkg##*[![:space:]]}"}"  # Trim leading/trailing whitespace
        [[ -z "$pkg" ]] && continue

        if [[ "$pkg" == aur:* ]]; then
            aur_pkgs+=("${pkg#aur:}")
        elif pacman -Si "$pkg" &>/dev/null 2>&1; then
            pacman_pkgs+=("$pkg")
        else
            aur_pkgs+=("$pkg")
        fi
    done

    # Install pacman packages
    if [[ ${#pacman_pkgs[@]} -gt 0 ]]; then
        echo
        log_info "Installing official packages: ${pacman_pkgs[*]}"
        if sudo pacman -S --noconfirm "${pacman_pkgs[@]}" >> "$LOG_FILE" 2>&1; then
            log_success "Official packages installed"
            INSTALLED+=("${pacman_pkgs[@]}")
        else
            log_warn "Some official packages failed"
            FAILED+=("${pacman_pkgs[@]}")
        fi
    fi

    # Install AUR packages
    if [[ ${#aur_pkgs[@]} -gt 0 ]]; then
        ensure_yay
        echo
        log_info "Installing AUR packages: ${aur_pkgs[*]}"
        if yay -S --noconfirm "${aur_pkgs[@]}" >> "$LOG_FILE" 2>&1; then
            log_success "AUR packages installed"
            INSTALLED+=("${aur_pkgs[@]}")
        else
            log_warn "Some AUR packages failed"
            FAILED+=("${aur_pkgs[@]}")
        fi
    fi
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    check_sudo
    show_header

    # Create log file
    touch "$LOG_FILE"
    echo "=== Arch Linux Post-Install Log $(date) ===" > "$LOG_FILE"

    # Pre-flight checks
    preflight_check

    # Welcome message
    echo
    show_border_message "Welcome to the Arch Linux Post-Install Configurator!"
    echo

    # Check if we should proceed
    if ! ask_yes_no "Start installation?" "y"; then
        log_info "Installation cancelled by ${USER}"
        exit 0
    fi

    echo
    log_info "Installation will now begin"
    echo

    # Installation steps
    local steps=(
        "Quickshell (AUR)"
        "DMS Linux"
        "Plymouth Boot Animation"
        "GRUB Star Trek Theme"
        "SDDM Display Manager"
    )

    local total_steps=${#steps[@]}
    local current_step=0

    # Step 1: Quickshell
    current_step=$((current_step + 1))
    show_progress $current_step $total_steps "${steps[$((current_step-1))]}"
    install_quickshell

    # Step 2: DMS Linux
    current_step=$((current_step + 1))
    show_progress $current_step $total_steps "${steps[$((current_step-1))]}"
    install_dms

    # Step 3: Plymouth
    current_step=$((current_step + 1))
    show_progress $current_step $total_steps "${steps[$((current_step-1))]}"
    install_plymouth

    # Step 4: GRUB Theme
    current_step=$((current_step + 1))
    show_progress $current_step $total_steps "${steps[$((current_step-1))]}"
    install_grub_theme

    # Step 5: SDDM
    current_step=$((current_step + 1))
    show_progress $current_step $total_steps "${steps[$((current_step-1))]}"
    install_sddm

    echo -e "\n"

    # Extra packages (interactive)
    if ask_yes_no "Install extra packages?" "n"; then
        install_extra_packages
    fi

    # Show summary
    echo
    echo -e "${DIM}  ════════════════════════════════════════════════════════════════════${RESET}"
    echo -e "${GREEN}${BOLD}  Installation Complete${RESET}"
    echo -e "${DIM}  ════════════════════════════════════════════════════════════════════${RESET}"
    echo
    echo -e "  ${BLUE}${BOLD}✓ Installed:${RESET} ${#INSTALLED[@]} items"
    echo -e "  ${DIM}${BOLD}⊘ Skipped:${RESET}   ${#SKIPPED[@]} items"
    echo -e "  ${YELLOW}${BOLD}⚠ Failed:${RESET}    ${#FAILED[@]} items"
    echo
    echo -e "  ${CYAN}Log file:${RESET}  $LOG_FILE"
    echo -e "  ${CYAN}To reboot:${RESET} sudo reboot"
    echo
    echo -e "${DIM}  ════════════════════════════════════════════════════════════════════${RESET}"

    # Show details if any failures
    if [[ ${#FAILED[@]} -gt 0 ]]; then
        echo -e "${RED}${BOLD}Failed items:${RESET}"
        printf '  • %s\n' "${FAILED[@]}"
        echo
        echo -e "Check the log for details: ${CYAN}$LOG_FILE${RESET}"
    fi

    # Show details if any skipped
    if [[ ${#SKIPPED[@]} -gt 0 ]]; then
        echo -e "${DIM}${BOLD}Skipped (already installed):${RESET}"
        printf '  • %s\n' "${SKIPPED[@]}"
        echo
    fi

    # Ask for reboot
    echo
    if ask_yes_no "Reboot now?" "y"; then
        log_info "Rebooting..."
        sudo reboot
    else
        log_info "Remember to reboot later to apply changes"
    fi
}

# Run main
main "$@"
