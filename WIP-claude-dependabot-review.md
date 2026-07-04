# WIP: Automated Dependabot review by Claude + Dependabot grouping

Status doc for an in-progress initiative. Created so the work can be resumed
cold in a future Claude Code session.

## Goal

When Dependabot opens a PR, have a GitHub Action automatically run Claude to
assess whether the bump is safe (reads changelog, flags semver/breaking
changes/CVEs, notes CI status), and post a single review comment with a
recommendation. The human still reviews and merges. Also: configure
Dependabot grouping so related minor/patch bumps come as one PR instead of
many.

Motivation: the user's worry about AI-assisted supply-chain attacks, and the
manual pain of batching 7 separate Dependabot PRs (which we did by hand on
2026-05-10 — see PR #88).

## Decisions already locked in

1. **Approach A** (Claude posts a review comment on the existing Dependabot
   PR), not B (Claude opens a separate batched PR). Simpler and lower-risk.
2. **Dependabot grouping** at the source: group minor + patch into one
   weekly PR; majors stay individual. Reduces the volume that needs review.
3. **Claude does not approve or merge.** It only comments. Human-in-the-loop
   is the whole point.
4. **Event trigger: `pull_request_target`.** Required because Dependabot's
   default `GITHUB_TOKEN` under `pull_request` is read-only, so a workflow
   triggered by `pull_request` can't post comments. `pull_request_target`
   runs the workflow from the *base* branch with full token perms — safe as
   long as we never check out and execute PR-head code (we don't).

## Concrete configs (sketches — not yet committed)

### `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      minor-and-patch:
        update-types:
          - "minor"
          - "patch"
```

### `.github/workflows/claude-dependabot-review.yml`

```yaml
name: Claude Dependabot Review

on:
  pull_request_target:
    types: [opened, reopened, synchronize]

jobs:
  claude-review:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      id-token: write
    steps:
      - name: Checkout base
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # VERIFY: input name. May be `direct_prompt`, `prompt`, or other.
          direct_prompt: |
            You are reviewing a Dependabot pull request
            (#${{ github.event.pull_request.number }}) in this repo. Post
            exactly ONE review comment with the following sections, then stop.

            1. **What's bumped**: package, from-version → to-version, semver
               jump (patch/minor/major).
            2. **Direct vs transitive**: does the diff touch package.json,
               or is it lockfile-only?
            3. **Changelog scan**: fetch the upstream's release notes between
               those versions. Flag any of:
               - "BREAKING" or "breaking change"
               - security advisories / CVEs
               - deprecations of APIs or behavior changes
               Quote the exact line if you find one.
            4. **CI signal**: note whether the "Comprehensive Testing" check
               on this PR is green / pending / failed.
            5. **Recommendation** — exactly one bucket:
               - ✅ Safe to merge — patch/minor, clean changelog, CI green.
               - ⚠️ Human review recommended — minor scope but worth eyes.
               - 🛑 Do not auto-merge — major bump, CVE, or breaking change.

            Do NOT approve the PR. Do NOT merge. Comment only.
```

## Open verifications (must do before merging the configs)

1. **Action input name.** Check `anthropics/claude-code-action@beta`'s
   README for the correct input. The existing `.github/workflows/claude.yml`
   uses only `anthropic_api_key`, no prompt input — so the official action
   may only support `@claude`-mention triggers. If that's the case, the
   workflow above won't work as written and we'll need either:
   - a different action that supports non-interactive prompts (e.g. running
     Claude via the Anthropic SDK in a script step), or
   - leave the `@claude` mention pattern intact and have a tiny first step
     that posts `@claude review this dependabot PR ...` as a comment, which
     then triggers the existing claude.yml. Two-hop, but works with the
     stock action.
2. **Repo settings.** In Settings → Code security: confirm "Dependabot can
   use secrets in workflows" is enabled, otherwise `ANTHROPIC_API_KEY`
   won't be available to the workflow on Dependabot PRs.
3. **Workflow permissions.** Settings → Actions → General → Workflow
   permissions should be at least "Read repository contents and packages".
   The explicit `permissions:` block in the workflow handles the rest.
4. **`claude.yml` state.** Currently `disabled_manually` (per
   `gh api repos/justinpearson/kidpix/actions/workflows`). Re-enable if we
   end up using the @claude-mention two-hop pattern.

## Reference: what was already done in this initiative on 2026-05-10

Context for understanding why we're here:

- **PR #85** (`ci: re-enable test workflow on pull requests`, merged
  807d873): re-enabled `test.yml` so PRs to main get gated by vitest +
  Playwright. Also flipped its `disabled_manually` flag via the API. CLAUDE.md
  was updated to reflect the change.
- **Issue #84**: tracks the 28 pre-existing skipped E2E tests (categorized:
  tool-persistence blocked on #52; tool-selection-highlighting needs
  de-duping).
- **PR #88** (`build(deps): batch 7 dependabot bumps`, merged 8f0abb8):
  manually batched 7 open Dependabot PRs (#74, #75, #76, #77, #78, #79, #86)
  into a single branch via sequential `git merge`, then superseded and
  closed the originals. This is the manual process the new automation
  should replace going forward.

## Resuming this work

The next session should:

1. Read this file plus the **Open verifications** section.
2. Verify the `claude-code-action@beta` input name (likely needs a search
   of the action's repo / README on GitHub).
3. If the action doesn't support a non-interactive prompt, switch to the
   two-hop pattern (or use a different action).
4. Commit the two configs (and any pattern adjustment) as a single PR.
5. Wait for the next real Dependabot PR to validate — or open a test PR by
   bumping a dev dep manually.

There is no time pressure on this; it's an enhancement, not a fix.
