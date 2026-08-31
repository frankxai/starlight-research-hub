"use client";

import "@xyflow/react/dist/style.css";

import { Background, Controls, MiniMap, Position, ReactFlow, type Edge, type Node, type NodeProps } from "@xyflow/react";

type HubNodeData = {
  title: string;
  note: string;
};

function HubNode({ data }: NodeProps<Node<HubNodeData>>) {
  return (
    <div className="card" style={{ minWidth: 180 }}>
      <strong>{data.title}</strong>
      <p style={{ margin: "0.4rem 0 0", color: "#9aa8c8", fontSize: "0.82rem" }}>{data.note}</p>
    </div>
  );
}

const nodeTypes = { hub: HubNode };

const nodes: Node<HubNodeData>[] = [
  { id: "operator", type: "hub", position: { x: 0, y: 180 }, data: { title: "Frank / Operator", note: "Sets objective and stop authority." }, sourcePosition: Position.Right },
  { id: "conductor", type: "hub", position: { x: 260, y: 180 }, data: { title: "Grok 4.6 conductor", note: "Routes identity, tools, and completion." }, sourcePosition: Position.Right, targetPosition: Position.Left },
  { id: "swarm", type: "hub", position: { x: 540, y: 40 }, data: { title: "Grok Bot swarm", note: "One computer per agent." }, targetPosition: Position.Left },
  { id: "harness", type: "hub", position: { x: 540, y: 180 }, data: { title: "This harness", note: "GitHub/Vercel/Linear/Notion/Drive/Canva/MCP." }, targetPosition: Position.Left },
  { id: "mcp", type: "hub", position: { x: 540, y: 320 }, data: { title: "MCP 2026-07-28", note: "Stateless bus with identity roadmap." }, targetPosition: Position.Left },
  { id: "github", type: "hub", position: { x: 860, y: 20 }, data: { title: "GitHub frankxai", note: "Code, CI, merge gates." }, targetPosition: Position.Left },
  { id: "vercel", type: "hub", position: { x: 860, y: 120 }, data: { title: "Vercel Starlight", note: "38 linked projects." }, targetPosition: Position.Left },
  { id: "sis", type: "hub", position: { x: 860, y: 220 }, data: { title: "SiS substrate", note: "Starlight Intelligence System runtime." }, targetPosition: Position.Left },
  { id: "peer", type: "hub", position: { x: 860, y: 320 }, data: { title: "Peer frontier", note: "Sol · Opus 5 · Gemini 3.7 Flash · Muse" }, targetPosition: Position.Left },
];

const edges: Edge[] = [
  { id: "e1", source: "operator", target: "conductor", animated: true },
  { id: "e2", source: "conductor", target: "swarm" },
  { id: "e3", source: "conductor", target: "harness" },
  { id: "e4", source: "conductor", target: "mcp" },
  { id: "e5", source: "swarm", target: "github" },
  { id: "e6", source: "harness", target: "vercel" },
  { id: "e7", source: "mcp", target: "sis" },
  { id: "e8", source: "conductor", target: "peer" },
];

export default function ArchitectureCanvas() {
  return (
    <div className="canvas-shell">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#243152" gap={20} />
        <MiniMap pannable zoomable style={{ background: "#0c1224" }} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
