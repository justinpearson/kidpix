#!/bin/zsh
set -euo pipefail


# Write a short zsh script to run on MacOS >15.6, that git clones my web app's
# source code (from git@github.com:justinpearson/kidpix.git), installs the
# dependencies via yarn install, and starts the development server with `yarn
# run vite dev`. We are doing this at a zsh terminal, on a base install of
# MacOS >15.6, that is not yet configured for software / web development. So
# you'll need to install at least git, node, and yarn. For git, not sure
# whether it's best to install git via brew or via xcode-select, do whatever
# is current best-practice. For node, I'm not sure what the best way to
# install it, but if you decide to use brew, you'll have to also install brew
# first. Only install the tools if they are not already installed.


###############################################################################
# Notes on overall setup:
# - Installs Homebrew if missing.
# - Installs Git and Node via Homebrew if missing.
# - Uses Corepack to enable Yarn (preferred modern way).
# - Clones the repo and runs the dev server with `yarn run vite dev`.
# - Idempotent: re-running won't reinstall tools; it will `git pull` if repo exists.
# - Uses SSH URL: make sure GitHub SSH keys are configured, or change to HTTPS if needed.
###############################################################################


###############################################################################
# Why install git via Homebrew instead of xcode-select
#
# xcode-select --install
#   - Installs Apple's Command Line Tools, which include Git.
#   - Git version lags behind upstream and only updates when macOS or CLT is updated.
#   - Good for one-off use, but harder to keep current.
#
# brew install git
#   - Installs the latest stable Git from Homebrew’s formulae.
#   - Easy to upgrade with `brew upgrade git`.
#   - Fits well with other Homebrew-managed tools like Node.
#   - Keeps Git self-contained in /usr/local or /opt/homebrew.
#
# Practical consequences of choosing Homebrew:
#   - Default `git` points to Homebrew’s newer binary.
#   - You upgrade it alongside other brew packages.
#   - If Xcode is installed later, its Git stays available but
#     Homebrew’s takes precedence in PATH unless reordered.
#
# For a modern JS/Vite/Yarn project, Homebrew is the more
# maintainable choice.
###############################################################################


have() { command -v "$1" >/dev/null 2>&1; }

# --- Ensure Homebrew ---
if ! have brew; then
  echo "[+] Installing Homebrew…"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Put brew on PATH for this shell (supports Apple Silicon & Intel)
if [[ -x /opt/homebrew/bin/brew ]]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
elif [[ -x /usr/local/bin/brew ]]; then
  eval "$(/usr/local/bin/brew shellenv)"
fi

# --- Git (via Homebrew) ---
if ! have git; then
  echo "[+] Installing git…"
  brew install git
fi

# --- Node.js (brings Corepack) ---
if ! have node; then
  echo "[+] Installing Node.js…"
  brew install node
fi

# --- Yarn via Corepack (best practice; avoids global Yarn installs) ---
echo "[+] Enabling Corepack (Yarn)…"
corepack enable || true
if ! have yarn; then
  corepack prepare yarn@stable --activate
fi

# --- Clone or update the repo ---
REPO_SSH="git@github.com:justinpearson/kidpix.git"
DEST_DIR="${HOME}/kidpix"

if [[ -d "$DEST_DIR/.git" ]]; then
  echo "[+] Repo exists; pulling latest…"
  git -C "$DEST_DIR" pull --ff-only
else
  echo "[+] Cloning repo… ($REPO_SSH → $DEST_DIR)"
  git clone "$REPO_SSH" "$DEST_DIR"
fi

# --- Install deps & start dev server ---
cd "$DEST_DIR"

echo "[+] Installing dependencies with Yarn…"
yarn install

echo "[+] Starting Vite dev server…"
exec yarn run vite dev
