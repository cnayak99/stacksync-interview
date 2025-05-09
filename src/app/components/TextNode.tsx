import { memo } from "react";
import {
  Position,
  Handle,
  useReactFlow,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import "./xy-theme.css"

type DataType = {
  text: string;
  isFirst: boolean;
  result:string,
  stdout: string
};
function TextNode({ id, data }: NodeProps<Node<DataType>>) {
  const { isFirst, result, stdout } = data;
  const { updateNodeData, getNodes, setNodes, setEdges } =
    useReactFlow();

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
        data: { text: "", isFirst: false },
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) =>
        eds.concat({ id: `e${id}-${newId}`, source: id, target: newId })
      );
    };

  return (
    <div style={{ position: "relative" }}>
      <div className="text-black">Enter Script</div>

      <div>
        <textarea
          rows={5}
          style={{ color: "black" }}
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text}
          className="xy-theme__input"
        />
      </div>

      {result && (
        <div className="mt-2 text-sm text-left text-gray-800">
          <p>Result: {result}</p>
          <p>Stdout: {stdout}</p>
        </div>
      )}

     
      <button
        onClick={handleAddNode}
        style={{
          position: "absolute",
          right: -37,
          bottom: 10,
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

      <Handle
        style={{
          bottom: -10,
        }}
        type="source"
        position={Position.Bottom}
      />
      {!isFirst && (
        <Handle
          style={{
            top: -10,
          }}
          type="target"
          position={Position.Top}
        />
      )}
    </div>
  );
}


export default memo(TextNode);
