# Feature Workflow Process

This rule defines the process to follow when implementing a new feature in this project.

- The list of current feature requests is in the `prompts-TODO/` directory.
- Read the most-recent feature-request file and implement it under a new git branch.
- Organize commits logically
- Before each commit, ensure the projects has no build errors or linter errors.
- Once the user confirms the feature works, offer to submit a PR
  - Use the GitHub CLI (`gh`) to create a PR
  - Write PR description to `pr-body.txt` and use `--body-file` option when creating PR to avoid newline issues.
- After the PR has been merged, move the feature-request file to `prompts-DONE/`.
