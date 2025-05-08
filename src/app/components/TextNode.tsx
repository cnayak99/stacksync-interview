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
  const { updateNodeData } = useReactFlow();

  return (
    <div>
      <div className="text-black">node {id}</div>
      <div>
        <textarea
          rows={5}
          style={{ color: "black" }}
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text}
          className="xy-theme__input"
        />
      </div>
      {
        result && (
            <div className="mt-2 text-sm text-left text-gray-800">
                <p>
                    Result: {result}
                </p>
                <p>
                    Stdout: {stdout}
                </p>
            </div>
        )
      }
      <Handle type="source" position={Position.Bottom} />
      {!isFirst && <Handle type="target" position={Position.Top} />}
    </div>
  );
}

export default memo(TextNode);
