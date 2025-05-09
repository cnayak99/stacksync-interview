import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { FaProjectDiagram } from "react-icons/fa";
import "./xy-theme.css";

type DataType = {
  isFirst: boolean;
};

function TriggerNode({  }: NodeProps<Node<DataType>>) {
  return (
    <div
      className="trigger-node-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        color: "black",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        padding: "0.5rem 1rem",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontWeight: "600",
        }}
      >
        <FaProjectDiagram />
        POST Trigger
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "#333",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "-6px", // optional: pull it closer to the edge if needed
        }}
      />
    </div>
  );
}

export default memo(TriggerNode);
