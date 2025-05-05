# Berlin Transport MCP Server

An MCP server that provides access to Berlin's public transport data through the VBB (Verkehrsverbund Berlin-Brandenburg) API. This server wraps the [v6.vbb.transport.rest](https://v6.vbb.transport.rest/) API.

## Available Tools

### 1. search_stops
Search for public transport stops in Berlin-Brandenburg.

**Parameters:**
- `query` (string): Search query for stops

### 2. get_departures
Get upcoming departures for a specific stop.

**Parameters:**
- `stop_id` (string): Stop ID to get departures for
- `results` (number, optional): Number of results to return

### 3. get_journeys
Get journey options from one stop to another.

**Parameters:**
- `from` (string): Origin stop ID
- `to` (string): Destination stop ID
- `departure` (string, optional): Departure time (e.g. "tomorrow 2pm")
- `results` (number, optional): Number of results to return

## Connect Claude Desktop to your MCP server

You can also connect to your remote MCP server from local MCP clients, by using the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote). 

To connect to your MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://berlin-transport.mcp-tools.app/sse"  // or if local http://localhost:8787/sse
      ]
    }
  }
}
```

Restart Claude and you should see the tools become available.

## API Documentation
For more details about the underlying API, visit [v6.vbb.transport.rest/getting-started.html](https://v6.vbb.transport.rest/getting-started.html).

## Get started: 

[![Deploy to Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/ai/tree/main/demos/remote-mcp-authless)

This will deploy your MCP server to a URL like: `remote-mcp-server-authless.<your-account>.workers.dev/sse`

Alternatively, you can use the command line below to get the remote MCP Server created on your local machine:
```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
```

## Customizing your MCP Server

To add your own [tools](https://developers.cloudflare.com/agents/model-context-protocol/tools/) to the MCP server, define each tool inside the `init()` method of `src/index.ts` using `this.server.tool(...)`.

## Connect to Cloudflare AI Playground

You can connect to your MCP server from the Cloudflare AI Playground, which is a remote MCP client:

1. Go to https://playground.ai.cloudflare.com/
2. Enter your deployed MCP server URL (`remote-mcp-server-authless.<your-account>.workers.dev/sse`)
3. You can now use your MCP tools directly from the playground!
