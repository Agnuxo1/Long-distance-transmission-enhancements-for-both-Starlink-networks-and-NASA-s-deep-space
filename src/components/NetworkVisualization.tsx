import React, { useEffect, useRef, useState } from 'react';
import { Activity, Zap } from 'lucide-react';

interface Node {
  id: number;
  x: number;
  y: number;
  strength: number;
}

interface Connection {
  from: Node;
  to: Node;
  strength: number;
}

export function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodeCount, setNodeCount] = useState(50);
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [tempNodeCount, setTempNodeCount] = useState('50');
  const nodes = useRef<Node[]>([]);
  const connections = useRef<Connection[]>([]);

  const initializeNetwork = (count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize nodes
    nodes.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      strength: Math.random(),
    }));

    // Create connections - each node connects to ~3 others
    connections.current = [];
    nodes.current.forEach(node => {
      const numConnections = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numConnections; i++) {
        const target = nodes.current[Math.floor(Math.random() * nodes.current.length)];
        if (target.id !== node.id) {
          connections.current.push({
            from: node,
            to: target,
            strength: Math.random(),
          });
        }
      }
    });
  };

  const handleNodeCountSubmit = () => {
    const newCount = parseInt(tempNodeCount, 10);
    if (!isNaN(newCount) && newCount > 0 && newCount <= 100000) {
      setNodeCount(newCount);
      setIsEditingCount(false);
      initializeNetwork(newCount);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial network setup
    initializeNetwork(nodeCount);

    let animationFrame: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      connections.current.forEach(connection => {
        const gradient = ctx.createLinearGradient(
          connection.from.x,
          connection.from.y,
          connection.to.x,
          connection.to.y
        );
        gradient.addColorStop(0, `rgba(56, 189, 248, ${connection.strength})`);
        gradient.addColorStop(1, `rgba(168, 85, 247, ${connection.strength})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = connection.strength * 2;
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.stroke();
      });

      // Draw nodes
      nodes.current.forEach(node => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.strength * 20
        );
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(node.x, node.y, node.strength * 20, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update positions with optimized movement for large numbers of nodes
      const movementScale = Math.max(0.1, 1 - (nodes.current.length / 10000));
      nodes.current.forEach(node => {
        node.x += (Math.random() - 0.5) * 2 * movementScale;
        node.y += (Math.random() - 0.5) * 2 * movementScale;
        node.strength = Math.max(0.2, Math.min(1, node.strength + (Math.random() - 0.5) * 0.1));

        // Keep nodes within canvas bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [nodeCount]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={1920}
        height={1080}
        style={{ filter: 'blur(1px)' }}
      />
      <div className="absolute top-4 right-4 flex gap-4">
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Activity className="h-4 w-4 text-sky-400" />
          <span className="text-sm text-sky-400">Network Active</span>
        </div>
        <button
          onClick={() => setIsEditingCount(true)}
          className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-black/30 transition-colors"
        >
          <Zap className="h-4 w-4 text-purple-400" />
          {isEditingCount ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleNodeCountSubmit();
              }}
              className="flex items-center"
            >
              <input
                type="text"
                value={tempNodeCount}
                onChange={(e) => setTempNodeCount(e.target.value)}
                className="w-20 bg-transparent border-b border-purple-400 text-purple-400 text-sm focus:outline-none"
                placeholder="Enter nodes"
                autoFocus
                onBlur={handleNodeCountSubmit}
              />
            </form>
          ) : (
            <span className="text-sm text-purple-400">{nodeCount.toLocaleString()} Nodes</span>
          )}
        </button>
      </div>
    </div>
  );
}