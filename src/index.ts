import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const VBB_API_BASE = "https://v6.vbb.transport.rest";

// Define our MCP agent with tools
export class BerlinTransportMCP extends McpAgent {
  server = new McpServer({
    name: "Berlin Transport API",
    version: "1.0.0",
  });

  async init() {
    // Search for stops
    this.server.tool(
      "search_stops",
      {
        query: z.string().describe("Search query for stops"),
      },
      async ({ query }) => {
        const url = new URL("/locations", VBB_API_BASE);
        url.searchParams.set("query", query);
        url.searchParams.set("poi", "false");
        url.searchParams.set("addresses", "false");

        const response = await fetch(url);
        const data = await response.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
    );

    // Get departures for a stop
    this.server.tool(
      "get_departures",
      {
        stop_id: z.string().describe("Stop ID to get departures for"),
        results: z.number().optional().describe("Number of results to return"),
      },
      async ({ stop_id, results }) => {
        const url = new URL(`/stops/${stop_id}/departures`, VBB_API_BASE);
        if (results) {
          url.searchParams.set("results", String(results));
        }

        const response = await fetch(url);
        const data = await response.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
    );

    // Get journeys from A to B
    this.server.tool(
      "get_journeys",
      {
        from: z.string().describe("Origin stop ID"),
        to: z.string().describe("Destination stop ID"),
        departure: z
          .string()
          .optional()
          .describe("Departure time (e.g. tomorrow 2pm)"),
        results: z.number().optional().describe("Number of results to return"),
      },
      async ({ from, to, departure, results }) => {
        const url = new URL("/journeys", VBB_API_BASE);
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);
        if (departure) {
          url.searchParams.set("departure", departure);
        }
        if (results) {
          url.searchParams.set("results", String(results));
        }

        const response = await fetch(url);
        const data = await response.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      }
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      // @ts-ignore
      return BerlinTransportMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      // @ts-ignore
      return BerlinTransportMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
