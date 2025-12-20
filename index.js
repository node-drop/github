/**
 * GitHub Custom Node Package
 * 
 * This package provides GitHub integration for Node-Drop
 * Includes: GitHub API node, GitHub Trigger node, and GitHub credentials
 */

const GitHubNode = require("./nodes/github.node.js");
const GitHubTriggerNode = require("./nodes/github-trigger.node.js");
const GitHubCredentials = require("./credentials/github.credentials.js");

module.exports = {
  nodes: [GitHubNode, GitHubTriggerNode],
  credentials: [GitHubCredentials],
};
