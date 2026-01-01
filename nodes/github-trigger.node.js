/**
 * GitHub Trigger Node
 * 
 * Triggers workflows when GitHub events occur.
 * Supports multiple event types including push, pull requests, issues, releases, and more.
 * 
 * Features:
 * - Multiple event types (push, PR, issues, releases, etc.)
 * - Repository filtering
 * - Branch filtering
 * - Action filtering
 * - Rich event data output
 * - Webhook signature verification
 * 
 * Note: Requires GitHub webhook configuration
 */

const GitHubTriggerNode = {
  identifier: "github-trigger",
  nodeCategory: "trigger",
  executionCapability: "trigger",
  displayName: "GitHub Trigger",
  name: "github-trigger",
  group: ["trigger", "github"],
  triggerType: "webhook",
  version: 1,
  description: "Trigger workflows from GitHub events (push, PRs, issues, releases, etc.)",
  ai: {
    description: "Trigger workflows from GitHub events (push, PRs, issues, releases, etc.)",
    useCases: [
      "Autodeploy on push to main",
      "Notify Slack on new issue"
    ],
    tags: ["github", "trigger", "webhook", "ci/cd"],
    rules: [
      "Configure Webhook Secret for security",
      "Select specific events to minimize traffic"
    ],
    complexityScore: 2
  },
  icon: "file:icon.svg",
  color: "#eee",
  defaults: {
    name: "GitHub Trigger",
    eventType: "push",
  },
  inputs: [],
  outputs: ["main"],
  
  credentials: [
    {
      name: "github",
      displayName: "GitHub",
      required: false,
    },
  ],
  
  properties: [
    {
      displayName: "Webhook URL",
      name: "webhookUrl",
      type: "custom",
      required: false,
      default: "",
      description: "Copy this URL and add it to your GitHub repository's webhook settings",
      component: "UrlGenerator",
      componentProps: {
        mode: "test",
      },
    },
    {
      displayName: "Event Type",
      name: "eventType",
      type: "options",
      required: true,
      default: "push",
      description: "Type of GitHub event to listen for",
      options: [
        {
          name: "Push",
          value: "push",
          description: "When code is pushed to a branch",
        },
        {
          name: "Pull Request",
          value: "pull_request",
          description: "When a pull request is created, updated, or closed",
        },
        {
          name: "Pull Request Review",
          value: "pull_request_review",
          description: "When a pull request review is submitted",
        },
        {
          name: "Pull Request Review Comment",
          value: "pull_request_review_comment",
          description: "When a comment is added to a pull request review",
        },
        {
          name: "Issues",
          value: "issues",
          description: "When an issue is opened, edited, or closed",
        },
        {
          name: "Issue Comment",
          value: "issue_comment",
          description: "When a comment is added to an issue",
        },
        {
          name: "Release",
          value: "release",
          description: "When a release is published or created",
        },
        {
          name: "Create",
          value: "create",
          description: "When a branch or tag is created",
        },
        {
          name: "Delete",
          value: "delete",
          description: "When a branch or tag is deleted",
        },
        {
          name: "Fork",
          value: "fork",
          description: "When the repository is forked",
        },
        {
          name: "Star",
          value: "watch",
          description: "When the repository is starred",
        },
        {
          name: "Repository",
          value: "repository",
          description: "When the repository is created, deleted, or archived",
        },
        {
          name: "Workflow Run",
          value: "workflow_run",
          description: "When a workflow run completes",
        },
        {
          name: "Discussion",
          value: "discussion",
          description: "When a discussion is created or updated",
        },
      ],
    },
    
    // Repository filter
    {
      displayName: "Repository Filter",
      name: "repositoryFilter",
      type: "string",
      default: "",
      placeholder: "owner/repo or leave empty for all",
      description: "Only trigger for specific repository (format: owner/repo). Leave empty for all repositories.",
      displayOptions: {
        show: {
          eventType: ["push", "pull_request", "issues", "release", "create", "delete"],
        },
      },
    },
    
    // Branch filter
    {
      displayName: "Branch Filter",
      name: "branchFilter",
      type: "string",
      default: "",
      placeholder: "main, develop, release/*",
      description: "Only trigger for specific branches (comma-separated, supports wildcards like release/*)",
      displayOptions: {
        show: {
          eventType: ["push", "create", "delete"],
        },
      },
    },
    
    // PR Action filter
    {
      displayName: "PR Action Filter",
      name: "prActionFilter",
      type: "options",
      default: "",
      description: "Only trigger for specific PR actions",
      options: [
        {
          name: "All Actions",
          value: "",
        },
        {
          name: "Opened",
          value: "opened",
        },
        {
          name: "Closed",
          value: "closed",
        },
        {
          name: "Synchronize",
          value: "synchronize",
        },
        {
          name: "Reopened",
          value: "reopened",
        },
        {
          name: "Edited",
          value: "edited",
        },
        {
          name: "Ready for Review",
          value: "ready_for_review",
        },
        {
          name: "Converted to Draft",
          value: "converted_to_draft",
        },
      ],
      displayOptions: {
        show: {
          eventType: ["pull_request"],
        },
      },
    },
    
    // Issue Action filter
    {
      displayName: "Issue Action Filter",
      name: "issueActionFilter",
      type: "options",
      default: "",
      description: "Only trigger for specific issue actions",
      options: [
        {
          name: "All Actions",
          value: "",
        },
        {
          name: "Opened",
          value: "opened",
        },
        {
          name: "Closed",
          value: "closed",
        },
        {
          name: "Reopened",
          value: "reopened",
        },
        {
          name: "Edited",
          value: "edited",
        },
        {
          name: "Labeled",
          value: "labeled",
        },
        {
          name: "Unlabeled",
          value: "unlabeled",
        },
        {
          name: "Assigned",
          value: "assigned",
        },
        {
          name: "Unassigned",
          value: "unassigned",
        },
      ],
      displayOptions: {
        show: {
          eventType: ["issues"],
        },
      },
    },
    
    // Release Action filter
    {
      displayName: "Release Action Filter",
      name: "releaseActionFilter",
      type: "options",
      default: "",
      description: "Only trigger for specific release actions",
      options: [
        {
          name: "All Actions",
          value: "",
        },
        {
          name: "Published",
          value: "published",
        },
        {
          name: "Created",
          value: "created",
        },
        {
          name: "Edited",
          value: "edited",
        },
        {
          name: "Deleted",
          value: "deleted",
        },
        {
          name: "Pre-released",
          value: "prereleased",
        },
        {
          name: "Released",
          value: "released",
        },
      ],
      displayOptions: {
        show: {
          eventType: ["release"],
        },
      },
    },
    
    // Keyword filter
    {
      displayName: "Keyword Filter",
      name: "keywordFilter",
      type: "string",
      default: "",
      placeholder: "bug, urgent, hotfix",
      description: "Only trigger if commit message or PR title contains these keywords (comma-separated, case-insensitive)",
      displayOptions: {
        show: {
          eventType: ["push", "pull_request", "issues"],
        },
      },
    },
    
    // Additional Options
    {
      displayName: "Options",
      name: "options",
      type: "collection",
      default: {},
      placeholder: "Add Option",
      description: "Additional trigger options",
      options: [
        {
          displayName: "Verify GitHub Signature",
          name: "verifySignature",
          type: "boolean",
          default: true,
          description: "Verify GitHub webhook signature for security",
        },
        {
          displayName: "Include Commit Details",
          name: "includeCommitDetails",
          type: "boolean",
          default: true,
          description: "Fetch and include full commit information (push events)",
        },
        {
          displayName: "Include PR Details",
          name: "includePRDetails",
          type: "boolean",
          default: true,
          description: "Fetch and include full pull request information",
        },
        {
          displayName: "Include Issue Details",
          name: "includeIssueDetails",
          type: "boolean",
          default: true,
          description: "Fetch and include full issue information",
        },
        {
          displayName: "Save Event Logs",
          name: "saveEventLogs",
          type: "boolean",
          default: false,
          description: "Save webhook events to logs for debugging",
        },
      ],
    },
  ],

  async execute(inputData) {
    // Trigger nodes don't execute in the traditional sense
    // They are called by the webhook handler
    return [{ main: [{ json: inputData }] }];
  },

  /**
   * Handle incoming webhook
   */
  async webhook(req, res) {
    try {
      const eventType = this.getNodeParameter("eventType");
      const options = this.getNodeParameter("options", {});
      const githubEvent = req.headers["x-github-event"];
      const payload = req.body;

      // Verify GitHub signature if enabled
      if (options.verifySignature) {
        const verified = this.verifyGitHubSignature(req, payload);
        if (!verified) {
          this.logger.warn("GitHub webhook signature verification failed");
          return res.status(401).json({ error: "Unauthorized" });
        }
      }

      // Check if event type matches
      if (githubEvent !== eventType) {
        return res.status(200).json({ message: "Event type mismatch" });
      }

      // Apply filters
      if (!this.matchesFilters(payload, githubEvent)) {
        return res.status(200).json({ message: "Filters did not match" });
      }

      // Enrich event data
      const enrichedData = await this.enrichEventData(payload, githubEvent, options);

      // Save logs if enabled
      if (options.saveEventLogs) {
        this.logger.info("GitHub webhook received", {
          event: githubEvent,
          repository: payload.repository?.full_name,
          action: payload.action,
        });
      }

      // Return the enriched data
      res.status(200).json({ success: true });
      return [{ main: [{ json: enrichedData }] }];
    } catch (error) {
      this.logger.error("GitHub webhook error:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Verify GitHub webhook signature
   */
  verifyGitHubSignature(req, payload) {
    const crypto = require("crypto");
    const signature = req.headers["x-hub-signature-256"];
    
    if (!signature) {
      return false;
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET || "";
    const hash = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");

    const expectedSignature = `sha256=${hash}`;
    return crypto.timingSafeEqual(signature, expectedSignature);
  },

  /**
   * Check if event matches configured filters
   */
  matchesFilters(payload, eventType) {
    const repositoryFilter = this.getNodeParameter("repositoryFilter", "");
    const branchFilter = this.getNodeParameter("branchFilter", "");
    const prActionFilter = this.getNodeParameter("prActionFilter", "");
    const issueActionFilter = this.getNodeParameter("issueActionFilter", "");
    const releaseActionFilter = this.getNodeParameter("releaseActionFilter", "");
    const keywordFilter = this.getNodeParameter("keywordFilter", "");

    // Repository filter
    if (repositoryFilter && payload.repository) {
      const fullName = payload.repository.full_name;
      if (fullName !== repositoryFilter) {
        return false;
      }
    }

    // Branch filter
    if (branchFilter && eventType === "push") {
      const branch = payload.ref?.replace("refs/heads/", "");
      if (!this.matchesBranchPattern(branch, branchFilter)) {
        return false;
      }
    }

    // PR action filter
    if (prActionFilter && eventType === "pull_request") {
      if (payload.action !== prActionFilter) {
        return false;
      }
    }

    // Issue action filter
    if (issueActionFilter && eventType === "issues") {
      if (payload.action !== issueActionFilter) {
        return false;
      }
    }

    // Release action filter
    if (releaseActionFilter && eventType === "release") {
      if (payload.action !== releaseActionFilter) {
        return false;
      }
    }

    // Keyword filter
    if (keywordFilter) {
      const keywords = keywordFilter.split(",").map(k => k.trim().toLowerCase());
      let text = "";

      if (eventType === "push") {
        text = payload.head_commit?.message || "";
      } else if (eventType === "pull_request") {
        text = `${payload.pull_request?.title} ${payload.pull_request?.body}`;
      } else if (eventType === "issues") {
        text = `${payload.issue?.title} ${payload.issue?.body}`;
      }

      const hasKeyword = keywords.some(kw => text.toLowerCase().includes(kw));
      if (!hasKeyword) {
        return false;
      }
    }

    return true;
  },

  /**
   * Match branch against pattern (supports wildcards)
   */
  matchesBranchPattern(branch, pattern) {
    const patterns = pattern.split(",").map(p => p.trim());
    
    for (const p of patterns) {
      if (p === branch) {
        return true;
      }
      
      // Simple wildcard matching
      if (p.includes("*")) {
        const regex = new RegExp(`^${p.replace(/\*/g, ".*")}$`);
        if (regex.test(branch)) {
          return true;
        }
      }
    }
    
    return false;
  },

  /**
   * Enrich event data with additional information
   */
  async enrichEventData(payload, eventType, options) {
    const enriched = {
      event: eventType,
      timestamp: new Date().toISOString(),
      repository: payload.repository?.full_name,
      action: payload.action,
      ...payload,
    };

    // Add commit details for push events
    if (eventType === "push" && options.includeCommitDetails) {
      enriched.commits = payload.commits?.map(commit => ({
        id: commit.id,
        message: commit.message,
        author: commit.author?.name,
        email: commit.author?.email,
        url: commit.url,
        timestamp: commit.timestamp,
      }));
    }

    // Add PR details
    if (eventType === "pull_request" && options.includePRDetails) {
      enriched.pullRequest = {
        number: payload.pull_request?.number,
        title: payload.pull_request?.title,
        body: payload.pull_request?.body,
        state: payload.pull_request?.state,
        author: payload.pull_request?.user?.login,
        createdAt: payload.pull_request?.created_at,
        updatedAt: payload.pull_request?.updated_at,
        url: payload.pull_request?.html_url,
      };
    }

    // Add issue details
    if (eventType === "issues" && options.includeIssueDetails) {
      enriched.issue = {
        number: payload.issue?.number,
        title: payload.issue?.title,
        body: payload.issue?.body,
        state: payload.issue?.state,
        author: payload.issue?.user?.login,
        createdAt: payload.issue?.created_at,
        updatedAt: payload.issue?.updated_at,
        url: payload.issue?.html_url,
      };
    }

    return enriched;
  },
};

module.exports = GitHubTriggerNode;
