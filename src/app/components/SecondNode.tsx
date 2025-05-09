import { memo } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import "./xy-theme.css";

type DataType = {
  label: string;
};

function SquareNode({ id }: NodeProps<Node<DataType>>) {
  const { getNodes, setNodes, setEdges } = useReactFlow();

  const handleAddNode = () => {
    const newId = `${Math.random().toString(36).substr(2, 9)}`;
    const currentNode = getNodes().find((n) => n.id === id);
    const baseY = currentNode?.position?.y ?? 100;

    const newNode: Node = {
      id: newId,
      position: {
        x: 250,
        y: baseY + 150,
      },
      type: "text", 
      data: { label: "New Node", deletable: true },
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) =>
      eds.concat({ id: `e${id}-${newId}`, source: id, target: newId })
    );
  };

  return (
    <div
      className="react-flow__node-square"
      style={{
        backgroundColor: "transparent",
        width: 50,
        height: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        position: "relative",
        padding: 0,
      }}
    >
      <h1 className="text-black">Input</h1>

      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#333" }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#333" }}
      />

      
      <button
        onClick={handleAddNode}
        style={{
          position: "absolute",
          right: "-30px",
          top: "50%",
          transform: "translateY(-50%)",
          border: "1px solid black",
          borderRadius: "50%",
          width: 24,
          height: 24,
          background: "white",
          fontWeight: "bold",
          cursor: "pointer",
          color: "black",
        }}
        title="Add connected node"
      >
        +
      </button>
    </div>
  );
}

export default memo(SquareNode);
