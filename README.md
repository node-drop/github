# GitHub Node Package

GitHub integration for Node-Drop with comprehensive repository, issue, and pull request management.

## What's Included

### Nodes

**GitHub Node**
- Create, update, and close issues
- Create, update, and merge pull requests
- Create releases and tags
- List repositories, issues, and PRs
- Add comments to issues and PRs
- Get repository information
- Template expressions for dynamic content

### Credentials
- **GitHub API Token** - Personal Access Token (PAT) or GitHub App Token authentication

## Features

### Issue Management
- Create new issues with title, description, labels, and assignees
- Update existing issues
- Close issues
- Add comments to issues
- List issues with filtering by state

### Pull Request Management
- Create pull requests with source and target branches
- Update PR titles and descriptions
- Merge pull requests with configurable merge strategies
- List pull requests with filtering by state

### Release Management
- Create releases with tags, names, and release notes
- Mark releases as drafts or pre-releases
- Automatic tag creation

### Repository Operations
- Get repository information (stars, forks, language, etc.)
- List issues and PRs
- Add comments and reactions

### Advanced Features
- Template expressions: `{{json.field}}`
- Nested field access: `{{json.user.name}}`
- Automatic retry with exponential backoff
- Rate limit handling
- Detailed error messages
- Structured logging

## Installation

This package is included by default in Node-Drop. If installing separately:

```bash
npm install
```

## Quick Start

### 1. Create GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select scopes:
   - `repo` - Full control of private repositories
   - `public_repo` - Access public repositories
   - `workflow` - Update GitHub Actions workflows (optional)
4. Copy the token

### 2. Configure Credentials

1. In Node-Drop: Add "GitHub" credential
2. Paste your Personal Access Token
3. Select GitHub server (github.com or Enterprise)

### 3. Use in Workflow

**Create an Issue:**
```
Operation: Create Issue
Owner: username
Repository: repo-name
Title: Bug: Login page broken
Body: The login page is not loading
Labels: bug,urgent
Assignees: developer1,developer2
```

**Create a Pull Request:**
```
Operation: Create Pull Request
Owner: username
Repository: repo-name
Title: Fix: Login page styling
Head Branch: fix/login-page
Base Branch: main
Body: Fixes the login page styling issues
```

**Merge a Pull Request:**
```
Operation: Merge Pull Request
Owner: username
Repository: repo-name
PR Number: 123
Merge Method: squash
```

**Create a Release:**
```
Operation: Create Release
Owner: username
Repository: repo-name
Tag Name: v1.0.0
Release Name: Version 1.0.0
Release Notes: Initial release
Is Prerelease: false
```

**List Issues:**
```
Operation: List Issues
Owner: username
Repository: repo-name
State Filter: open
Limit: 50
```

## Common Use Cases

### Automated Issue Creation
```
Webhook (Error Alert) → GitHub (Create Issue)
                          ↓
                    Title: {{json.errorType}}
                    Body: {{json.errorMessage}}
                    Labels: bug,automated
```

### PR Workflow Automation
```
GitHub Trigger (PR Created) → Slack (Notify)
                               ↓
                          "New PR: {{json.title}}"
```

### Release Management
```
Manual Trigger → GitHub (Create Release)
                    ↓
                Tag: v{{json.version}}
                Notes: {{json.changelog}}
```

### Issue Tracking
```
Form Submission → GitHub (Create Issue)
                     ↓
                 Title: {{json.subject}}
                 Body: {{json.description}}
                 Assignees: {{json.assignee}}
```

## Operations Reference

### Create Issue
Creates a new issue in a repository.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name
- Title: Issue title

**Optional Parameters:**
- Body: Issue description (Markdown supported)
- Labels: Comma-separated list of labels
- Assignees: Comma-separated list of GitHub usernames

**Returns:**
- issueNumber: Issue number
- title: Issue title
- url: Issue URL
- state: Issue state (open/closed)

### Update Issue
Updates an existing issue.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name
- Issue Number: Issue number to update

**Optional Parameters:**
- New Title: Updated title
- New Body: Updated description
- State: open or closed

**Returns:**
- issueNumber: Issue number
- title: Updated title
- state: Issue state
- url: Issue URL

### Close Issue
Closes an issue.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name
- Issue Number: Issue number to close

**Returns:**
- issueNumber: Issue number
- state: closed
- url: Issue URL

### Create Pull Request
Creates a new pull request.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name
- Title: PR title
- Head Branch: Source branch
- Base Branch: Target branch (default: main)

**Optional Parameters:**
- Body: PR description

**Returns:**
- prNumber: PR number
- title: PR title
- url: PR URL
- state: PR state

### Update Pull Request
Updates a pull request.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name
- PR Number: PR number to update

**Optional Parameters:**
- New Title: Updated title
- New Body: Updated description

**Returns:**
- prNumber: PR number
- title: Updated title
- state: PR state
- url: PR URL

### Merge Pull Request
Merges a pull request.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name
- PR Number: PR number to merge

**Optional Parameters:**
- Merge Method: merge, squash, or rebase (default: merge)

**Returns:**
- merged: true/false
- message: Merge message
- sha: Commit SHA

### Create Release
Creates a new release.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name
- Tag Name: Release tag (e.g., v1.0.0)

**Optional Parameters:**
- Release Name: Display name for release
- Release Notes: Release notes (Markdown supported)
- Is Draft: Mark as draft
- Is Prerelease: Mark as prerelease

**Returns:**
- releaseId: Release ID
- tagName: Tag name
- name: Release name
- url: Release URL
- draft: Draft status
- prerelease: Prerelease status

### List Issues
Lists issues in a repository.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name

**Optional Parameters:**
- State Filter: open, closed, or all (default: open)
- Limit: Maximum results (default: 30)

**Returns:**
- count: Number of issues
- issues: Array of issues with number, title, state, url, dates

### List Pull Requests
Lists pull requests in a repository.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name

**Optional Parameters:**
- State Filter: open, closed, or all (default: open)
- Limit: Maximum results (default: 30)

**Returns:**
- count: Number of PRs
- pullRequests: Array of PRs with number, title, state, url, dates

### Add Comment
Adds a comment to an issue or PR.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name
- Issue Number: Issue or PR number
- Comment Body: Comment text (Markdown supported)

**Returns:**
- commentId: Comment ID
- url: Comment URL
- body: Comment text
- createdAt: Creation timestamp

### Get Repository
Gets repository information.

**Required Parameters:**
- Owner: GitHub username or organization
- Repository: Repository name

**Returns:**
- name: Repository name
- fullName: Full repository name
- description: Repository description
- url: Repository URL
- stars: Star count
- forks: Fork count
- openIssues: Open issue count
- language: Primary language
- isPrivate: Private/public status
- createdAt: Creation date
- updatedAt: Last update date

## Template Expressions

Use template expressions to dynamically populate fields:

```
{{json.field}}           - Access top-level field
{{json.user.name}}       - Access nested field
{{json.items.0}}         - Access array element
{{json.error.message}}   - Access error details
```

## Error Handling

The node provides specific error messages:

| Error | Solution |
|-------|----------|
| `Repository not found` | Check owner and repository name |
| `Invalid authentication` | Verify GitHub token is valid |
| `Rate limit exceeded` | Auto-retries enabled, wait before retrying |
| `Not Found` | Issue/PR number doesn't exist |
| `Validation Failed` | Check required parameters |
| `Unprocessable Entity` | Invalid parameter values |

## Configuration

### Retry Settings
```
Options > Max Retries: 3 (default)
Options > Retry Delay: 1000ms (default)
Options > Timeout: 30000ms (default)
```

## Architecture

```
github/
├── nodes/
│   └── github.node.js          # Main GitHub node
├── credentials/
│   └── github.credentials.js   # GitHub credentials
├── package.json                # Package manifest
├── index.js                    # Package exports
└── README.md                   # This file
```

## License

MIT
