/**
 * GitHub API Credentials
 * 
 * Supports authentication via:
 * - Personal Access Token (PAT)
 * - GitHub App Token
 */

const GitHubCredentials = {
  name: "github",
  displayName: "GitHub",
  documentationUrl: "https://docs.github.com/en/authentication",
  icon: "file:icon.svg",
  color: "#eee",
  testable: true,
  properties: [
    {
      displayName: "Authentication Type",
      name: "authenticationType",
      type: "options",
      default: "pat",
      description: "Choose authentication method",
      options: [
        {
          name: "Personal Access Token",
          value: "pat",
        },
        {
          name: "GitHub App Token",
          value: "app",
        },
      ],
    },
    {
      displayName: "Personal Access Token",
      name: "accessToken",
      type: "string",
      typeOptions: {
        password: true,
      },
      required: true,
      default: "",
      placeholder: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      description: "GitHub Personal Access Token (PAT). Create at https://github.com/settings/tokens",
      displayOptions: {
        show: {
          authenticationType: ["pat"],
        },
      },
    },
    {
      displayName: "GitHub App Token",
      name: "appToken",
      type: "string",
      typeOptions: {
        password: true,
      },
      required: true,
      default: "",
      placeholder: "ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      description: "GitHub App installation token",
      displayOptions: {
        show: {
          authenticationType: ["app"],
        },
      },
    },
    {
      displayName: "GitHub Server",
      name: "server",
      type: "options",
      default: "github.com",
      description: "GitHub server (for GitHub Enterprise, use your domain)",
      options: [
        {
          name: "GitHub.com",
          value: "github.com",
        },
        {
          name: "GitHub Enterprise",
          value: "enterprise",
        },
      ],
    },
    {
      displayName: "Enterprise Server URL",
      name: "enterpriseUrl",
      type: "string",
      default: "",
      placeholder: "https://github.enterprise.com",
      description: "GitHub Enterprise Server URL",
      displayOptions: {
        show: {
          server: ["enterprise"],
        },
      },
    },
  ],

  /**
   * Test the GitHub API connection
   */
  async test(data) {
    if (!data.accessToken && !data.appToken) {
      return {
        success: false,
        message: "Access token is required",
      };
    }

    try {
      const axios = require("axios");
      const token = data.accessToken || data.appToken;
      const baseUrl = data.server === "enterprise" && data.enterpriseUrl 
        ? `${data.enterpriseUrl}/api/v3`
        : "https://api.github.com";

      const response = await axios.get(`${baseUrl}/user`, {
        headers: {
          Authorization: `token ${token}`,
          "Accept": "application/vnd.github.v3+json",
        },
        timeout: 5000,
      });

      if (response.status === 200) {
        return {
          success: true,
          message: `Connected successfully as ${response.data.login}`,
        };
      }

      return {
        success: false,
        message: "Connection test failed",
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "Invalid token. Please check your GitHub credentials.",
        };
      } else if (error.response?.status === 403) {
        return {
          success: false,
          message: "Access forbidden. Check your token permissions.",
        };
      } else if (error.code === "ECONNREFUSED") {
        return {
          success: false,
          message: "Cannot connect to GitHub API. Please check your internet connection.",
        };
      } else if (error.code === "ETIMEDOUT") {
        return {
          success: false,
          message: "Connection timeout. GitHub API is not responding.",
        };
      } else {
        return {
          success: false,
          message: `Connection failed: ${error.message || "Unknown error"}`,
        };
      }
    }
  },
};

module.exports = GitHubCredentials;
