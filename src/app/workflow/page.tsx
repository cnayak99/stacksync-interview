"use client"
import React, { useCallback, useRef } from "react";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type OnConnect,
  type OnConnectEnd,
  type NodeChange,
  type OnNodesDelete,
  applyNodeChanges,
} from "@xyflow/react";
import TextNode from "../components/TextNode";
import TriggerNode from "../components/FirstNode";
import SquareNode from "../components/SecondNode";
import "@xyflow/react/dist/style.css";
const nodeTypes = {
  text: TextNode,
  first: TriggerNode,
  second: SquareNode,
};


const initialNodes = [
  {
    id: "0",
    type: "first",
    data: { label: "Input", deletable: true },

    position: { x: 0, y: 50 },
  },
  {
    id: "1",
    type: "second",
    data: { label: "Input", deletable: false },
    position: { x: 0, y: 120 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e0-1", 
    source: "0", 
    target: "1", 
    type: "default", 
  },
];

let id = 2;
const getId = () => `${id++}`;
const nodeOrigin: [number, number] = [0.5, 0];

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const filtered = changes.filter((change) => {
        if (change.type === "remove") {
          const node = nodes.find((n) => n.id === change.id);
          return node?.data?.deletable !== false;
        }
        return true;
      });

      setNodes((nds) => applyNodeChanges(filtered, nds));
    },
    [nodes]
  );
  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted) => {
      // Only process nodes that are actually deletable
      const deletableNodes = deleted.filter(
        (node) => node?.data?.deletable !== false
      );

      if (deletableNodes.length === 0) return;

      // Remove edges connected to deleted nodes
      setEdges((edges) =>
        edges.filter(
          (edge) =>
            !deletableNodes.some(
              (node) => node.id === edge.source || node.id === edge.target
            )
        )
      );
    },
    [setEdges]
  );
  
  const { screenToFlowPosition } = useReactFlow();
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode:Node = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          type: "text",
          data: {
            text: "",
            isFirst: false,
          },
          origin: [0.5, 0.0],
        };

        if (connectionState.fromNode) {  
          const fromNode = connectionState.fromNode;      
          setNodes((nds) => nds.concat(newNode));
          setEdges((eds) =>
            eds.concat({ id, source: fromNode.id, target: id })
          );
        }
      }
    },
    [screenToFlowPosition]
  );

  





  function findFirstNode(nodes:Node[],edges:Edge[]){
    const targetIds = new Set(edges.map(e=>e.target))
    return nodes.find(n=>!targetIds.has(n.id));
  }
  function findLinearOrder(startId:string,edges:Edge[]){
    const order =[startId];
    const edgeMap= new Map(edges.map(e=>[e.source,e.target]));
    let current = startId;
    while(edgeMap.has(current)){
      const next = edgeMap.get(current);
      if(!next) return;
      order.push(next);
      current = next;
    }
    return order;
  }
  async function runWorkflow(){
    const firstNode = findFirstNode(nodes, edges);
    console.log(firstNode);
    if(!firstNode){
      console.log("first node not found");
      return;
    }
    const execOrder = findLinearOrder(firstNode?.id,edges);
    console.log(execOrder);
    if(!execOrder)return;
    for(let i=0;i<execOrder?.length;i++){
      const nodeId = execOrder[i];
      const node = nodes.find(n=> n.id===nodeId);
      const script = node?.data.text ||"";
      setNodes((nds)=>
        nds.map(n=>({
          ...n,
          data:{
            ...n.data,
            result: n.id==nodeId? undefined:n.data.result,
            stdout: n.id==nodeId? undefined:n.data.stdout,
          }
        }))
      );

      const res = await fetch("api/execute-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scripts:[script] }),
      });

      const data = await res.json();
      const result = data.results?.[0]|| {result:"", stdout:""}
      console.log("Execution result details: ", nodeId, data);

      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  result: result.result,
                  stdout: result.stdout,
                },
              }
            : n
        )
      );

      await new Promise((res)=> setTimeout(res,200));

    }
  }

  const addNodeManually=()=>{
    const id = getId();
    const newNode: Node = {
      id,
      position: screenToFlowPosition({
        x: 250,
        y: 120,
      }),
      type: "text",
      data: {
        text: "",
        isFirst: false,
      },
      origin: [0.5, 0.0],
    }; 
    setNodes((nds)=>[...nds, newNode]);
  }
  return (
    <div
      className="wrapper"
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100vh", position: "relative" }}
    >
      <ReactFlow
        style={{ backgroundColor: "#F7F9FB" }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
        nodeTypes={nodeTypes}
        onNodesDelete={onNodesDelete}
      >
        <button
          onClick={runWorkflow}
          className="bg-blue-500 z-10 absolute top-4 left-4 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        >
          Run Workflow
        </button>
        <button
          onClick={addNodeManually}
          className="bg-blue-500 z-10 absolute right-4 top-4 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        >
          Add a node
        </button>
        <Background />
      </ReactFlow>
    </div>
  );
};

const Workflow= () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);

export default Workflow;
