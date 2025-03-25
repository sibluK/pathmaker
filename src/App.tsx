import React, { useEffect, useRef, useState } from 'react'
import Menu from './components/Menu'
import './App.css'

type NodeType = {
  x: number,
  y: number
}

type Connection = {
  first_node: NodeType,
  second_node: NodeType
}

function App() {
  // States
  const [nodes, setNodes] = useState<NodeType[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [nodeConnection, setNodeConnection] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [tempLine, setTempLine] = useState<NodeType | null>(null);
  const [startNode, setStartNode] = useState<NodeType | null>(null);
  const [endNode, setEndNode] = useState<NodeType | null>(null);
  const [error, setError] = useState<string>("");
  const [bfsPath, setBfsPath] = useState<number[]>([]);
  const [dfsPath, setDfsPath] = useState<number[]>([]);
  const [currentBfsStep, setCurrentBfsStep] = useState<number>(0);
  const [currentDfsStep, setCurrentDfsStep] = useState<number>(0);

  // References
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

  // Objects
  const buttons = {
    left: 0,
    middle: 1,
    right: 2,
  }

  // For drawing the bfs path with a delay
  useEffect(() => {
    if (bfsPath.length > 1 && currentBfsStep < bfsPath.length - 1) {
      const timer = setTimeout(() => {
        setCurrentBfsStep(currentBfsStep + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
    
  }, [bfsPath, currentBfsStep]);

  // For drawing the dfs path with a delay
  useEffect(() => {
    if (dfsPath.length > 1 && currentDfsStep < dfsPath.length - 1) {
      const timer = setTimeout(() => {
        setCurrentDfsStep(currentDfsStep + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
    
  }, [dfsPath, currentDfsStep]);

  // For handling the click on the canvas
  function HandleCanvasClick(e: React.MouseEvent<HTMLElement>) {

    // If click not on canvas, return
    if(!canvasRef.current) {
      return;
    }

    // Set the x, y values, based on the canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Boolean checks
    // Checks if node with x, y values already exists
    const nodeExists = nodes.some(n => n.x === x && n.y === y);
    // Checks if the click is inside any other node
    const insideNode = Array.from(nodeRefs.current.values()).some((ref) => ref?.contains(e.target as Node));

    // If node does not exist and is not inside other node, create new node
    if (!nodeExists && !insideNode) {
      console.log(`Creating new node at: x: ${x}, y: ${y}`);
      setNodes([...nodes, { x, y }]);
    }
  }

  function HandleNodeClick(node: NodeType, e: React.MouseEvent<HTMLElement>) {
    console.log(`NODE(${node.x}, ${node.y}) clicked`);
  
    if (e.button === buttons.left) {
      setSelectedNode(node);
  
      if (nodeConnection && selectedNode) {
        if (selectedNode.x !== node.x || selectedNode.y !== node.y) {
          let connection = { first_node: selectedNode, second_node: node };
          if (!connections.some(conn => 
            (conn.first_node.x === connection.first_node.x && conn.first_node.y === connection.first_node.y && conn.second_node.x === connection.second_node.x && conn.second_node.y === connection.second_node.y) ||
            (conn.first_node.x === connection.second_node.x && conn.first_node.y === connection.second_node.y && conn.second_node.x === connection.first_node.x && conn.second_node.y === connection.first_node.y)
          )) {
            setConnections([...connections, connection]);
            setError("");
          } else {
            console.log("connection is already set");
            setError("Nodes already connected")
          }
        }
        setNodeConnection(false);
        setSelectedNode(null);
        setTempLine(null);
      } else {
        setSelectedNode(node);
        setNodeConnection(true);
      }
    } else if (e.button === buttons.right) {
      setStartNode(node);
    } else if (e.button === buttons.middle) {
      setEndNode(node);
    }
  }

  function HandleMouseMove(e: React.MouseEvent) {
    if (selectedNode && nodeConnection) {
      if(!canvasRef.current) {
        return;
      }
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTempLine({ x, y });
    }
  }

  function HandleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
  }

  function HandleMouseDown(e: React.MouseEvent) {
    if (e.button === 1) {
      e.preventDefault();
    }
  }

  function GetAdjNodes() {
    const adj: number[][] = Array(nodes.length).fill(null).map(() => []);
    connections.forEach((conn) => {
      const firstIndex = nodes.findIndex(n => n.x === conn.first_node.x && n.y === conn.first_node.y);
      const secondIndex = nodes.findIndex(n => n.x === conn.second_node.x && n.y === conn.second_node.y);
      if (firstIndex !== -1 && secondIndex !== -1) {
        adj[firstIndex].push(secondIndex);
        adj[secondIndex].push(firstIndex);
      }
    });

    return adj;
  }

  function SolveUsingBFS() {
    if (!startNode) {
      setError("Start node is not set");
      return;
    }
    if (!endNode) {
      setError("End node is not set");
      return;
    }

    const adj = GetAdjNodes();
    const startIndex = nodes.findIndex(n => n.x === startNode.x && n.y === startNode.y);
    const endIndex = nodes.findIndex(n => n.x === endNode.x && n.y === endNode.y);
    const bfsResult = bfsOfGraph(adj, startIndex, endIndex);

    if (bfsResult.length === 0) {
      setError("No available path.");
      return;
    }

    console.log("BFS Result:", bfsResult);
    setBfsPath(bfsResult);
    setError("");
    setCurrentBfsStep(0);
  }

  function SolveUsingDFS() {
    if (!startNode) {
      setError("Start node is not set");
      return;
    }
    if (!endNode) {
      setError("End node is not set");
      return;
    }

    const adj = GetAdjNodes();
    const startIndex = nodes.findIndex(n => n.x === startNode.x && n.y === startNode.y);
    const endIndex = nodes.findIndex(n => n.x === endNode.x && n.y === endNode.y);
    const dfsResult = dfsOfGraph(adj, startIndex, endIndex);

    if (dfsResult.length === 0) {
      setError("No available path.");
      return;
    }

    console.log("DFS Result: ", dfsResult);
    setDfsPath(dfsResult);
    setError("");
    setCurrentDfsStep(0);

  }

  function bfsOfGraph(adj: number[][], s: number, e: number) {
    let V = adj.length;
    let res = [];
    let q = [];
    let visited = new Array(V).fill(false);
    let parent = new Array(V).fill(-1);

    visited[s] = true;
    q.push(s);

    while (q.length > 0) {
      let curr = q.shift();
      if (curr === e) {
        break;
      }
      for (let x of adj[curr]) {
        if (!visited[x]) {
          visited[x] = true;
          parent[x] = curr;
          q.push(x);
        }
      }
    }

    let curr = e;
    while (curr !== -1) {
      res.push(curr);
      curr = parent[curr];
    }
    res.reverse();
    return res;
  }

  function dfsOfGraph(adj: number[][], s: number, e: number) {
    let V = adj.length;
    let res = [];
    let visited = new Array(V).fill(false);
    let parent = new Array(V).fill(-1);

    function DFSRec(curr: number) {
      visited[curr] = true;
      if (curr === e) return true;
      for (let x of adj[curr]) {
        if (!visited[x]) {
          parent[x] = curr;
          if (DFSRec(x)) return true;
        }
      }
      return false;
    }

    DFSRec(s);

    let curr = e;
    while (curr !== -1) {
      res.push(curr);
      curr = parent[curr];
    }
    res.reverse();
    return res[0] === s ? res : [];
  }

  function Clear() {
    setConnections([]);
    setNodes([]);
    setBfsPath([]);
    setCurrentBfsStep(0);
    setDfsPath([]);
    setCurrentDfsStep(0);
    setError("");
  }

  return (
    <>
      <div>
        <Menu
            numberOfNodes={nodes.length}
            numberOfConnections={connections.length}
            error={error}
            SolveUsingBFS={SolveUsingBFS}
            SolveUsingDFS={SolveUsingDFS}
            Clear={Clear}
          />
      </div>
      <div
        ref={canvasRef}
        className='canvas'
        onMouseMove={HandleMouseMove}
        onContextMenu={HandleContextMenu}
        onMouseDown={HandleMouseDown}
        onClick={HandleCanvasClick}
      >

        {/* SVG for drawing lines */}
        <svg className="lines" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {/* Existing connections */}
          {connections.map((conn, index) => (
            <line
              key={index}
              x1={conn.first_node.x}
              y1={conn.first_node.y}
              x2={conn.second_node.x}
              y2={conn.second_node.y}
              stroke="black"
              strokeWidth="2"
            />
          ))}

          {/* Bfs Path connections */}
          {bfsPath.length > 1 && bfsPath.slice(0, currentBfsStep + 1).map((nodeIndex, index) => {
            if (index === bfsPath.length - 1) return null;
            const nextNodeIndex = bfsPath[index + 1];
            const currentNode = nodes[nodeIndex];
            const nextNode = nodes[nextNodeIndex];
            return (
              <line
                key={`path-${index}`}
                x1={currentNode.x}
                y1={currentNode.y}
                x2={nextNode.x}
                y2={nextNode.y}
                stroke="blue"
                strokeWidth="2"
              />
            );
          })}

          {/* Dfs Path connections */}
          {dfsPath.length > 1 && dfsPath.slice(0, currentDfsStep + 1).map((nodeIndex, index) => {
            if (index === dfsPath.length - 1) return null;
            const nextNodeIndex = dfsPath[index + 1];
            const currentNode = nodes[nodeIndex];
            const nextNode = nodes[nextNodeIndex];
            return (
              <line
                key={`path-${index}`}
                x1={currentNode.x}
                y1={currentNode.y}
                x2={nextNode.x}
                y2={nextNode.y}
                stroke="yellow"
                strokeWidth="3"
                strokeDasharray="5"
              />
            );
          })} 

          {/* Temporary line when selecting a node */}
          {selectedNode && tempLine && (
            <line
              x1={selectedNode.x}
              y1={selectedNode.y}
              x2={tempLine.x}
              y2={tempLine.y}
              stroke="black"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>
        
        {/* For drawing nodes */}
        {nodes.map((node, index) => (
          <div
            className={`node ${selectedNode == node ? `selected` : ``} ${startNode == node ? `start` : ``} ${endNode == node ? `end` : ``}`}
            key={index}
            ref={(el) => {
              nodeRefs.current.set(index, el);
            }}
            onMouseDown={(e) => HandleNodeClick(node, e)}
            style={{
              left: node.x,
              top: node.y
            }}>{index + 1}</div>
        ))}
      </div>
    </>
  )
}

export default App
