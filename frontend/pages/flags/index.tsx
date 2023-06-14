import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { data: { label: "1" }, id: "1", position: { x: 0, y: 0 } },
  { data: { label: "2" }, id: "2", position: { x: 0, y: 100 } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function Home() {
  return (
    <main style={{ height: "100%", width: "100%" }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </main>
  );
}
