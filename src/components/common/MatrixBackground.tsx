import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    class MatrixColumn {
      x: number;
      y: number;
      fontSize: number;
      speed: number;
      opacity: number;
      chars: string[];

      constructor(x: number, fontSize: number) {
        this.x = x;
        this.fontSize = fontSize;
        this.y = Math.random() * -1000;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.2 + 0.05;
        this.chars = Array.from({ length: 10 }, () => 
          String.fromCharCode(33 + Math.floor(Math.random() * 94))
        );
      }

      update() {
        this.y += this.speed;
        if (Math.random() > 0.95) {
          this.chars[0] = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }
        if (this.y > canvas.height) {
          this.y = Math.random() * -1000;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.font = `${this.fontSize}px monospace`;
        this.chars.forEach((char, i) => {
          const y = this.y - (i * this.fontSize);
          if (y > -this.fontSize && y < canvas.height) {
            ctx.fillText(char, this.x, y);
          }
        });
      }
    }

    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize / 2);
    const matrixColumns = Array.from({ length: columns }, (_, i) => 
      new MatrixColumn(i * fontSize * 2, fontSize)
    );

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = 'rgba(10, 25, 41, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      matrixColumns.forEach(column => {
        column.update();
        column.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full opacity-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default MatrixBackground;

