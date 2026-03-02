import { useEffect, useRef } from 'react';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
  fadeColor?: string;
  size?: number;
  hoverColor?: CanvasStrokeStyle;
}

export default function Squares({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
  fadeColor = '#060010',
  size,
  hoverColor,
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = size ?? squareSize;
    const hoverColorValue = hoverColor ?? hoverFillColor;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / cellSize) * cellSize;
      const startY = Math.floor(gridOffset.current.y / cellSize) * cellSize;

      for (let x = startX; x < canvas.width + cellSize; x += cellSize) {
        for (let y = startY; y < canvas.height + cellSize; y += cellSize) {
          const squareX = x - (gridOffset.current.x % cellSize);
          const squareY = y - (gridOffset.current.y % cellSize);

          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / cellSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / cellSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverColorValue;
            ctx.fillRect(squareX, squareY, cellSize, cellSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, cellSize, cellSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, fadeColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);

      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + cellSize) % cellSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + cellSize) % cellSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + cellSize) % cellSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + cellSize) % cellSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + cellSize) % cellSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + cellSize) % cellSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / cellSize) * cellSize;
      const startY = Math.floor(gridOffset.current.y / cellSize) * cellSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / cellSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / cellSize);

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, size, hoverColor, fadeColor]);

  return <canvas ref={canvasRef} className="h-full w-full border-none block" />;
}
