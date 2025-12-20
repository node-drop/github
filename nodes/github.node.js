/**
 * GitHub Node
 * 
 * Interact with GitHub repositories, issues, pull requests, and more.
 * Supports creating issues, managing PRs, creating releases, and repository operations.
 * 
 * Features:
 * - Create, update, and close issues
 * - Create, update, and merge pull requests
 * - Create releases and tags
 * - List repositories, issues, and PRs
 * - Add comments and reactions
 * - Manage repository settings
 * - Template expressions for dynamic content
 * - Automatic retry logic for rate limits
 * - Rich error handling
 */

const axios = require("axios");

const GitHubNode = {
  identifier: "github",
  nodeCategory: "action",
  displayName: "GitHub",
  name: "github",
  group: ["communication", "github", "development"],
  version: 1,
  description: "Interact with GitHub repositories, issues, PRs, and releases",
  icon: "file:icon.svg",
  color: "#eee",
  defaults: {
    name: "GitHub",
    operation: "createIssue",
  },
  inputs: ["main"],
  outputs: ["main"],
  
  credentials: [
    {
      name: "github",
      displayName: "GitHub",
      required: true,
    },
  ],
  
  properties: [
    {
      displayName: "Authentication",
      name: "authentication",
      type: "credential",
      required: true,
      default: "",
      description: "Select GitHub credentials",
      placeholder: "Select credentials...",
      allowedTypes: ["github"],
    },
    {
      displayName: "Operation",
      name: "operation",
      type: "options",
      required: true,
      default: "createIssue",
      description: "Operation to perform",
      options: [
        {
          name: "Create Issue",
          value: "createIssue",
          description: "Create a new issue",
        },
        {
          name: "Update Issue",
          value: "updateIssue",
          description: "Update an existing issue",
        },
        {
          name: "Close Issue",
          value: "closeIssue",
          description: "Close an issue",
        },
        {
          name: "Create Pull Request",
          value: "createPR",
          description: "Create a new pull request",
        },
        {
          name: "Update Pull Request",
          value: "updatePR",
          description: "Update a pull request",
        },
        {
          name: "Merge Pull Request",
          value: "mergePR",
          description: "Merge a pull request",
        },
        {
          name: "Create Release",
          value: "createRelease",
          description: "Create a new release",
        },
        {
          name: "List Issues",
          value: "listIssues",
          description: "List issues in a repository",
        },
        {
          name: "List Pull Requests",
          value: "listPRs",
          description: "List pull requests in a repository",
        },
        {
          name: "Add Comment",
          value: "addComment",
          description: "Add a comment to an issue or PR",
        },
        {
          name: "Get Repository",
          value: "getRepository",
          description: "Get repository information",
        },
      ],
    },
    
    // Common fields
    {
      displayName: "Repository Owner",
      name: "owner",
      type: "expression",
      required: true,
      default: "",
      placeholder: "username or {{json.owner}}",
      description: "GitHub username or organization name",
      displayOptions: {
        show: {
          operation: [
            "createIssue", "updateIssue", "closeIssue",
            "createPR", "updatePR", "mergePR",
            "createRelease", "listIssues", "listPRs",
            "addComment", "getRepository"
          ],
        },
      },
    },
    {
      displayName: "Repository Name",
      name: "repo",
      type: "expression",
      required: true,
      default: "",
      placeholder: "repo-name or {{json.repo}}",
      description: "Repository name",
      displayOptions: {
        show: {
          operation: [
            "createIssue", "updateIssue", "closeIssue",
            "createPR", "updatePR", "mergePR",
            "createRelease", "listIssues", "listPRs",
            "addComment", "getRepository"
          ],
        },
      },
    },
    
    // Create Issue fields
    {
      displayName: "Title",
      name: "title",
      type: "expression",
      required: true,
      default: "",
      placeholder: "Issue title or {{json.title}}",
      description: "Issue title",
      displayOptions: {
        show: {
          operation: ["createIssue"],
        },
      },
    },
    {
      displayName: "Body",
      name: "body",
      type: "expression",
      default: "",
      placeholder: "Issue description or {{json.body}}",
      description: "Issue description (supports Markdown)",
      displayOptions: {
        show: {
          operation: ["createIssue"],
        },
      },
    },
    {
      displayName: "Labels",
      name: "labels",
      type: "expression",
      default: "",
      placeholder: "bug,enhancement or {{json.labels}}",
      description: "Comma-separated list of labels",
      displayOptions: {
        show: {
          operation: ["createIssue"],
        },
      },
    },
    {
      displayName: "Assignees",
      name: "assignees",
      type: "expression",
      default: "",
      placeholder: "username1,username2 or {{json.assignees}}",
      description: "Comma-separated list of GitHub usernames",
      displayOptions: {
        show: {
          operation: ["createIssue"],
        },
      },
    },
    
    // Update Issue fields
    {
      displayName: "Issue Number",
      name: "issueNumber",
      type: "expression",
      required: true,
      default: "",
      placeholder: "123 or {{json.issueNumber}}",
      description: "Issue number",
      displayOptions: {
        show: {
          operation: ["updateIssue", "closeIssue", "addComment"],
        },
      },
    },
    {
      displayName: "New Title",
      name: "newTitle",
      type: "expression",
      default: "",
      placeholder: "Updated title or {{json.title}}",
      description: "New issue title",
      displayOptions: {
        show: {
          operation: ["updateIssue"],
        },
      },
    },
    {
      displayName: "New Body",
      name: "newBody",
      type: "expression",
      default: "",
      placeholder: "Updated description or {{json.body}}",
      description: "New issue description",
      displayOptions: {
        show: {
          operation: ["updateIssue"],
        },
      },
    },
    {
      displayName: "State",
      name: "state",
      type: "options",
      default: "open",
      description: "Issue state",
      options: [
        {
          name: "Open",
          value: "open",
        },
        {
          name: "Closed",
          value: "closed",
        },
      ],
      displayOptions: {
        show: {
          operation: ["updateIssue"],
        },
      },
    },
    
    // Pull Request fields
    {
      displayName: "PR Title",
      name: "prTitle",
      type: "expression",
      required: true,
      default: "",
      placeholder: "PR title or {{json.title}}",
      description: "Pull request title",
      displayOptions: {
        show: {
          operation: ["createPR"],
        },
      },
    },
    {
      displayName: "PR Body",
      name: "prBody",
      type: "expression",
      default: "",
      placeholder: "PR description or {{json.body}}",
      description: "Pull request description",
      displayOptions: {
        show: {
          operation: ["createPR"],
        },
      },
    },
    {
      displayName: "Head Branch",
      name: "headBranch",
      type: "expression",
      required: true,
      default: "",
      placeholder: "feature-branch or {{json.branch}}",
      description: "Source branch name",
      displayOptions: {
        show: {
          operation: ["createPR"],
        },
      },
    },
    {
      displayName: "Base Branch",
      name: "baseBranch",
      type: "expression",
      required: true,
      default: "main",
      placeholder: "main or {{json.baseBranch}}",
      description: "Target branch name",
      displayOptions: {
        show: {
          operation: ["createPR"],
        },
      },
    },
    {
      displayName: "PR Number",
      name: "prNumber",
      type: "expression",
      required: true,
      default: "",
      placeholder: "456 or {{json.prNumber}}",
      description: "Pull request number",
      displayOptions: {
        show: {
          operation: ["updatePR", "mergePR"],
        },
      },
    },
    {
      displayName: "Merge Method",
      name: "mergeMethod",
      type: "options",
      default: "merge",
      description: "How to merge the PR",
      options: [
        {
          name: "Create a Merge Commit",
          value: "merge",
        },
        {
          name: "Squash and Merge",
          value: "squash",
        },
        {
          name: "Rebase and Merge",
          value: "rebase",
        },
      ],
      displayOptions: {
        show: {
          operation: ["mergePR"],
        },
      },
    },
    
    // Release fields
    {
      displayName: "Tag Name",
      name: "tagName",
      type: "expression",
      required: true,
      default: "",
      placeholder: "v1.0.0 or {{json.version}}",
      description: "Release tag name",
      displayOptions: {
        show: {
          operation: ["createRelease"],
        },
      },
    },
    {
      displayName: "Release Name",
      name: "releaseName",
      type: "expression",
      default: "",
      placeholder: "Version 1.0.0 or {{json.name}}",
      description: "Release name (optional)",
      displayOptions: {
        show: {
          operation: ["createRelease"],
        },
      },
    },
    {
      displayName: "Release Notes",
      name: "releaseNotes",
      type: "expression",
      default: "",
      placeholder: "Release notes or {{json.notes}}",
      description: "Release notes (supports Markdown)",
      displayOptions: {
        show: {
          operation: ["createRelease"],
        },
      },
    },
    {
      displayName: "Is Draft",
      name: "isDraft",
      type: "boolean",
      default: false,
      description: "Mark release as draft",
      displayOptions: {
        show: {
          operation: ["createRelease"],
        },
      },
    },
    {
      displayName: "Is Prerelease",
      name: "isPrerelease",
      type: "boolean",
      default: false,
      description: "Mark release as prerelease",
      displayOptions: {
        show: {
          operation: ["createRelease"],
        },
      },
    },
    
    // Comment fields
    {
      displayName: "Comment Body",
      name: "commentBody",
      type: "expression",
      required: true,
      default: "",
      placeholder: "Comment text or {{json.comment}}",
      description: "Comment text (supports Markdown)",
      displayOptions: {
        show: {
          operation: ["addComment"],
        },
      },
    },
    
    // List fields
    {
      displayName: "State Filter",
      name: "stateFilter",
      type: "options",
      default: "open",
      description: "Filter by state",
      options: [
        {
          name: "Open",
          value: "open",
        },
        {
          name: "Closed",
          value: "closed",
        },
        {
          name: "All",
          value: "all",
        },
      ],
      displayOptions: {
        show: {
          operation: ["listIssues", "listPRs"],
        },
      },
    },
    {
      displayName: "Limit",
      name: "limit",
      type: "number",
      default: 30,
      description: "Maximum number of results to return",
      displayOptions: {
        show: {
          operation: ["listIssues", "listPRs"],
        },
      },
    },
    
    // Options
    {
      displayName: "Options",
      name: "options",
      type: "collection",
      default: {},
      placeholder: "Add Option",
      description: "Additional configuration options",
      options: [
        {
          displayName: "Timeout (ms)",
          name: "timeout",
          type: "number",
          default: 30000,
          description: "Request timeout in milliseconds",
        },
        {
          displayName: "Max Retries",
          name: "maxRetries",
          type: "number",
          default: 3,
          description: "Number of retry attempts for rate limits",
        },
        {
          displayName: "Retry Delay (ms)",
          name: "retryDelay",
          type: "number",
          default: 1000,
          description: "Initial delay between retries (exponential backoff)",
        },
      ],
    },
  ],

  async execute(inputData) {
    const items = inputData.main?.[0] || [];
    const results = [];
    const operation = this.getNodeParameter("operation");
    const options = this.getNodeParameter("options", {});

    try {
      const credentials = await this.getCredentials("github");
      if (!credentials || !credentials.accessToken) {
        throw new Error("GitHub credentials are required. Please configure GitHub credentials.");
      }

      const maxRetries = options.maxRetries !== undefined ? options.maxRetries : 3;
      const retryDelay = options.retryDelay || 1000;
      const timeout = options.timeout || 30000;

      const itemsToProcess = items.length > 0 ? items : [{ json: {} }];

      for (const item of itemsToProcess) {
        try {
          let result;

          switch (operation) {
            case "createIssue":
              result = await this.createIssue(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "updateIssue":
              result = await this.updateIssue(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "closeIssue":
              result = await this.closeIssue(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "createPR":
              result = await this.createPR(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "updatePR":
              result = await this.updatePR(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "mergePR":
              result = await this.mergePR(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "createRelease":
              result = await this.createRelease(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "listIssues":
              result = await this.listIssues(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "listPRs":
              result = await this.listPRs(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "addComment":
              result = await this.addComment(item, credentials, timeout, maxRetries, retryDelay);
              break;
            case "getRepository":
              result = await this.getRepository(item, credentials, timeout, maxRetries, retryDelay);
              break;
            default:
              throw new Error(`Unknown operation: ${operation}`);
          }

          results.push({ json: result });
        } catch (error) {
          if (this.settings?.continueOnFail) {
            results.push({
              json: {
                success: false,
                error: error.message,
                operation,
              },
            });
          } else {
            throw error;
          }
        }
      }

      return [{ main: results }];
    } catch (error) {
      this.logger.error("GitHub Node Error:", {
        operation,
        error: error.message,
      });
      throw error;
    }
  },

  async createIssue(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const title = this.resolveValue(this.getNodeParameter("title"), item.json);
    const body = this.resolveValue(this.getNodeParameter("body", ""), item.json);
    const labels = this.resolveValue(this.getNodeParameter("labels", ""), item.json);
    const assignees = this.resolveValue(this.getNodeParameter("assignees", ""), item.json);

    if (!owner || !repo || !title) {
      throw new Error("Owner, repository, and title are required");
    }

    const payload = {
      title,
      body: body || undefined,
      labels: labels ? labels.split(",").map(l => l.trim()) : undefined,
      assignees: assignees ? assignees.split(",").map(a => a.trim()) : undefined,
    };

    // Remove undefined fields
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    this.logger.info("Creating GitHub issue", { owner, repo, title });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      payload,
      credentials,
      "POST",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      issueNumber: response.number,
      title: response.title,
      url: response.html_url,
      state: response.state,
    };
  },

  async updateIssue(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const issueNumber = this.resolveValue(this.getNodeParameter("issueNumber"), item.json);
    const newTitle = this.resolveValue(this.getNodeParameter("newTitle", ""), item.json);
    const newBody = this.resolveValue(this.getNodeParameter("newBody", ""), item.json);
    const state = this.getNodeParameter("state", "open");

    if (!owner || !repo || !issueNumber) {
      throw new Error("Owner, repository, and issue number are required");
    }

    const payload = {};
    if (newTitle) payload.title = newTitle;
    if (newBody) payload.body = newBody;
    if (state) payload.state = state;

    this.logger.info("Updating GitHub issue", { owner, repo, issueNumber });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      payload,
      credentials,
      "PATCH",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      issueNumber: response.number,
      title: response.title,
      state: response.state,
      url: response.html_url,
    };
  },

  async closeIssue(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const issueNumber = this.resolveValue(this.getNodeParameter("issueNumber"), item.json);

    if (!owner || !repo || !issueNumber) {
      throw new Error("Owner, repository, and issue number are required");
    }

    this.logger.info("Closing GitHub issue", { owner, repo, issueNumber });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      { state: "closed" },
      credentials,
      "PATCH",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      issueNumber: response.number,
      state: response.state,
      url: response.html_url,
    };
  },

  async createPR(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const title = this.resolveValue(this.getNodeParameter("prTitle"), item.json);
    const body = this.resolveValue(this.getNodeParameter("prBody", ""), item.json);
    const head = this.resolveValue(this.getNodeParameter("headBranch"), item.json);
    const base = this.resolveValue(this.getNodeParameter("baseBranch", "main"), item.json);

    if (!owner || !repo || !title || !head || !base) {
      throw new Error("Owner, repository, title, head branch, and base branch are required");
    }

    const payload = {
      title,
      head,
      base,
      body: body || undefined,
    };

    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    this.logger.info("Creating GitHub PR", { owner, repo, title, head, base });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      payload,
      credentials,
      "POST",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      prNumber: response.number,
      title: response.title,
      url: response.html_url,
      state: response.state,
    };
  },

  async updatePR(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const prNumber = this.resolveValue(this.getNodeParameter("prNumber"), item.json);
    const newTitle = this.resolveValue(this.getNodeParameter("newTitle", ""), item.json);
    const newBody = this.resolveValue(this.getNodeParameter("newBody", ""), item.json);

    if (!owner || !repo || !prNumber) {
      throw new Error("Owner, repository, and PR number are required");
    }

    const payload = {};
    if (newTitle) payload.title = newTitle;
    if (newBody) payload.body = newBody;

    this.logger.info("Updating GitHub PR", { owner, repo, prNumber });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      payload,
      credentials,
      "PATCH",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      prNumber: response.number,
      title: response.title,
      state: response.state,
      url: response.html_url,
    };
  },

  async mergePR(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const prNumber = this.resolveValue(this.getNodeParameter("prNumber"), item.json);
    const mergeMethod = this.getNodeParameter("mergeMethod", "merge");

    if (!owner || !repo || !prNumber) {
      throw new Error("Owner, repository, and PR number are required");
    }

    const payload = {
      merge_method: mergeMethod,
    };

    this.logger.info("Merging GitHub PR", { owner, repo, prNumber, mergeMethod });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/merge`,
      payload,
      credentials,
      "PUT",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      merged: response.merged,
      message: response.message,
      sha: response.sha,
    };
  },

  async createRelease(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const tagName = this.resolveValue(this.getNodeParameter("tagName"), item.json);
    const releaseName = this.resolveValue(this.getNodeParameter("releaseName", ""), item.json);
    const releaseNotes = this.resolveValue(this.getNodeParameter("releaseNotes", ""), item.json);
    const isDraft = this.getNodeParameter("isDraft", false);
    const isPrerelease = this.getNodeParameter("isPrerelease", false);

    if (!owner || !repo || !tagName) {
      throw new Error("Owner, repository, and tag name are required");
    }

    const payload = {
      tag_name: tagName,
      name: releaseName || tagName,
      body: releaseNotes || undefined,
      draft: isDraft,
      prerelease: isPrerelease,
    };

    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    this.logger.info("Creating GitHub release", { owner, repo, tagName });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      payload,
      credentials,
      "POST",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      releaseId: response.id,
      tagName: response.tag_name,
      name: response.name,
      url: response.html_url,
      draft: response.draft,
      prerelease: response.prerelease,
    };
  },

  async listIssues(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const state = this.getNodeParameter("stateFilter", "open");
    const limit = this.getNodeParameter("limit", 30);

    if (!owner || !repo) {
      throw new Error("Owner and repository are required");
    }

    this.logger.info("Listing GitHub issues", { owner, repo, state, limit });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&per_page=${limit}`,
      null,
      credentials,
      "GET",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      count: response.length,
      issues: response.map(issue => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        url: issue.html_url,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
      })),
    };
  },

  async listPRs(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const state = this.getNodeParameter("stateFilter", "open");
    const limit = this.getNodeParameter("limit", 30);

    if (!owner || !repo) {
      throw new Error("Owner and repository are required");
    }

    this.logger.info("Listing GitHub PRs", { owner, repo, state, limit });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=${limit}`,
      null,
      credentials,
      "GET",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      count: response.length,
      pullRequests: response.map(pr => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        url: pr.html_url,
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
      })),
    };
  },

  async addComment(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);
    const issueNumber = this.resolveValue(this.getNodeParameter("issueNumber"), item.json);
    const body = this.resolveValue(this.getNodeParameter("commentBody"), item.json);

    if (!owner || !repo || !issueNumber || !body) {
      throw new Error("Owner, repository, issue number, and comment body are required");
    }

    const payload = { body };

    this.logger.info("Adding comment to GitHub issue", { owner, repo, issueNumber });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      payload,
      credentials,
      "POST",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      commentId: response.id,
      url: response.html_url,
      body: response.body,
      createdAt: response.created_at,
    };
  },

  async getRepository(item, credentials, timeout, maxRetries, retryDelay) {
    const owner = this.resolveValue(this.getNodeParameter("owner"), item.json);
    const repo = this.resolveValue(this.getNodeParameter("repo"), item.json);

    if (!owner || !repo) {
      throw new Error("Owner and repository are required");
    }

    this.logger.info("Getting GitHub repository info", { owner, repo });

    const response = await this.makeGitHubRequest(
      `https://api.github.com/repos/${owner}/${repo}`,
      null,
      credentials,
      "GET",
      timeout,
      maxRetries,
      retryDelay
    );

    return {
      success: true,
      name: response.name,
      fullName: response.full_name,
      description: response.description,
      url: response.html_url,
      stars: response.stargazers_count,
      forks: response.forks_count,
      openIssues: response.open_issues_count,
      language: response.language,
      isPrivate: response.private,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
    };
  },

  async makeGitHubRequest(url, payload, credentials, method = "POST", timeout, maxRetries, retryDelay) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const config = {
          headers: {
            Authorization: `token ${credentials.accessToken}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          timeout,
        };

        let response;
        if (method === "GET") {
          response = await axios.get(url, config);
        } else if (method === "POST") {
          response = await axios.post(url, payload, config);
        } else if (method === "PATCH") {
          response = await axios.patch(url, payload, config);
        } else if (method === "PUT") {
          response = await axios.put(url, payload, config);
        }

        return response.data;
      } catch (error) {
        lastError = error;

        // Check for rate limit
        if (error.response?.status === 403 && error.response?.headers["x-ratelimit-remaining"] === "0") {
          if (attempt < maxRetries) {
            const resetTime = parseInt(error.response.headers["x-ratelimit-reset"]) * 1000;
            const delay = Math.max(retryDelay * Math.pow(2, attempt), resetTime - Date.now());
            this.logger.warn(`Rate limited, retrying in ${delay}ms`);
            await this.sleep(delay);
            continue;
          }
        }

        // Don't retry on auth errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error(`GitHub API error: ${error.response.data?.message || error.message}`);
        }

        // Retry on network errors or 5xx
        if (attempt < maxRetries && (!error.response || error.response.status >= 500)) {
          const delay = retryDelay * Math.pow(2, attempt);
          this.logger.warn(`Request failed, retrying in ${delay}ms: ${error.message}`);
          await this.sleep(delay);
          continue;
        }
      }
    }

    throw lastError;
  },

  resolveValue(value, data) {
    if (typeof value !== "string") {
      return value;
    }

    return value.replace(/\{\{json\.([^}]+)\}\}/g, (match, path) => {
      const keys = path.split(".");
      let result = data;
      
      for (const key of keys) {
        if (result && typeof result === "object" && key in result) {
          result = result[key];
        } else {
          return match;
        }
      }
      
      return result !== undefined ? result : match;
    });
  },

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};

module.exports = GitHubNode;
