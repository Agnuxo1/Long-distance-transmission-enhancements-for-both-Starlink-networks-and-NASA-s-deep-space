import React, { useEffect, useRef } from 'react';
import { Cpu } from 'lucide-react';

interface ChipComponent {
  id: string;
  x: number;
  y: number;
  type: string;
  connections: string[];
}

export function ChipVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const components = useRef<ChipComponent[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize chip components
    components.current = Array.from({ length: 12 }, (_, i) => ({
      id: `comp-${i}`,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      type: ['CPU', 'Memory', 'IO'][Math.floor(Math.random() * 3)],
      connections: [],
    }));

    // Create connections
    components.current.forEach(comp => {
      const numConnections = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numConnections; i++) {
        const target = components.current[Math.floor(Math.random() * components.current.length)];
        if (target.id !== comp.id && !comp.connections.includes(target.id)) {
          comp.connections.push(target.id);
          target.connections.push(comp.id);
        }
      }
    });

    let animationFrame: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      components.current.forEach(comp => {
        comp.connections.forEach(targetId => {
          const target = components.current.find(c => c.id === targetId);
          if (target) {
            const gradient = ctx.createLinearGradient(comp.x, comp.y, target.x, target.y);
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.5)');
            gradient.addColorStop(1, 'rgba(236, 72, 153, 0.5)');
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.moveTo(comp.x, comp.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      });

      // Draw components
      components.current.forEach(comp => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          comp.x,
          comp.y,
          0,
          comp.x,
          comp.y,
          30
        );
        gradient.addColorStop(0, comp.type === 'CPU' ? 'rgba(139, 92, 246, 0.8)' :
                               comp.type === 'Memory' ? 'rgba(236, 72, 153, 0.8)' :
                               'rgba(34, 211, 238, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(comp.x, comp.y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Component label
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(comp.type, comp.x, comp.y + 45);
      });

      // Update positions slightly
      components.current.forEach(comp => {
        comp.x += (Math.random() - 0.5) * 1;
        comp.y += (Math.random() - 0.5) * 1;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={1920}
        height={1080}
        style={{ filter: 'blur(0.5px)' }}
      />
      <div className="absolute top-4 right-4 flex gap-4">
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Cpu className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-purple-400">AlphaChip Active</span>
        </div>
      </div>
    </div>
  );
}