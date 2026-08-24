import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PracticeType } from '../types';

interface ReleaseCanvasProps {
  practice: PracticeType;
  text: string;
  onFinish: () => void;
}

export const ReleaseCanvas: React.FC<ReleaseCanvasProps> = ({ practice, text, onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const duration = 10000; // 10 somatic, slow seconds
    const startTime = Date.now();
    let animationFrameId: number;

    // Prepare particles for fire / sparks / ash / bubbles / wind
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      life: number;
    }> = [];

    // Sand grains precomputation for "Arena que se borra"
    const sandGrains: Array<{ x: number; y: number; color: string; size: number }> = [];
    if (practice === 'mar') {
      for (let i = 0; i < 600; i++) {
        sandGrains.push({
          x: Math.random() * width,
          y: Math.random() * height,
          color: Math.random() > 0.5 ? '#CBB8A6' : '#E2D4C6',
          size: Math.random() * 2 + 0.8,
        });
      }
    }

    // Dynamic text calculation based on length to allow full, long expressions (500+ characters) without cutoff
    const cleanText = text.trim();
    const textLength = cleanText.length;

    // Split text into lines helper respecting paragraphs and max characters per line
    const wrapText = (str: string, maxChars: number): string[] => {
      const paragraphs = str.split('\n');
      const allLines: string[] = [];

      for (const para of paragraphs) {
        const words = para.split(' ');
        let currentLine = '';

        for (const w of words) {
          if (!w) continue;
          if ((currentLine + ' ' + w).trim().length > maxChars) {
            if (currentLine) allLines.push(currentLine.trim());
            currentLine = w;
          } else {
            currentLine = currentLine ? currentLine + ' ' + w : w;
          }
        }
        if (currentLine) allLines.push(currentLine.trim());
      }
      return allLines;
    };

    // Configuration for Fuego (Burning parchment)
    let fireFontSize = 12.5;
    let fireLineHeight = 20;
    let fireCharsPerLine = 36;

    if (textLength > 600) {
      fireFontSize = 8.5;
      fireLineHeight = 11.5;
      fireCharsPerLine = 58;
    } else if (textLength > 350) {
      fireFontSize = 9.5;
      fireLineHeight = 13.5;
      fireCharsPerLine = 50;
    } else if (textLength > 160) {
      fireFontSize = 11;
      fireLineHeight = 16.5;
      fireCharsPerLine = 42;
    }

    const fireLines = wrapText(cleanText, fireCharsPerLine);

    // Configuration for Sand (Mar) & Balloon (Globo)
    const sandLines = wrapText(cleanText, 36).slice(0, 7);
    const balloonLines = wrapText(cleanText, 26).slice(0, 5);

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProgressPercent(Math.round(progress * 100));

      ctx.clearRect(0, 0, width, height);

      if (practice === 'fuego') {
        // ==========================================
        // 1. FUEGO: FOGATA / HOGUERA ANIMADA Y PAPEL QUE SE QUEMA DESDE LA ESQUINA INFERIOR
        // ==========================================
        // Warm dark hearth ambient background
        const bgGrad = ctx.createRadialGradient(width * 0.35, height - 40, 20, width / 2, height / 2, width);
        bgGrad.addColorStop(0, '#221510');
        bgGrad.addColorStop(0.5, '#161313');
        bgGrad.addColorStop(1, '#0D0C0C');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Paper configuration
        const paperW = Math.min(width - 44, 336);
        const paperH = Math.min(height - 95, 220);
        const paperX = (width - paperW) / 2 + 18;
        const paperY = 28;

        // Burn Origin: Bottom-left corner of the paper
        const burnOriginX = paperX - 12;
        const burnOriginY = paperY + paperH + 12;
        const maxBurnDist = Math.hypot(paperW + 40, paperH + 40);

        // Burn radius expands diagonally across the paper
        // Easing so it starts catching then burns steadily
        const burnRadius = Math.max(0, (progress * 1.18 - 0.05)) * maxBurnDist;

        // Draw Paper (Only if not completely burned)
        if (progress < 0.98) {
          ctx.save();

          // Clip paper to only the unburned region
          // We create a clipping path that starts from top-left, goes to top-right, bottom-right,
          // and then traces the organic burn edge from bottom-right back to top-left.
          ctx.beginPath();

          // Calculate burn boundary points across the diagonal
          const burnPoints: Array<{ x: number; y: number }> = [];
          const steps = 32;

          for (let i = 0; i <= steps; i++) {
            // Angle from 0 (bottom-right direction) to PI/2 (top-left direction)
            const angle = (i / steps) * (Math.PI / 2);
            // Add natural flame jitter/noise to the burn front
            const noise = Math.sin(i * 0.8 + now * 0.006) * 7 + Math.cos(i * 1.4 - now * 0.004) * 4;
            const currentR = Math.max(0, burnRadius + noise);

            const px = burnOriginX + Math.cos(angle) * currentR;
            const py = burnOriginY - Math.sin(angle) * currentR;
            burnPoints.push({ x: px, y: py });
          }

          // Construct unburned polygon:
          // Start at top-left of paper
          ctx.moveTo(paperX, paperY);
          // Go to top-right
          ctx.lineTo(paperX + paperW, paperY);
          // Go to bottom-right
          ctx.lineTo(paperX + paperW, paperY + paperH);

          // Follow the jagged burn boundary from right to left
          for (let i = 0; i < burnPoints.length; i++) {
            const pt = burnPoints[i];
            // Clamp within paper area for clean clipping
            const clampedX = Math.max(paperX - 5, Math.min(paperX + paperW + 5, pt.x));
            const clampedY = Math.max(paperY - 5, Math.min(paperY + paperH + 5, pt.y));
            ctx.lineTo(clampedX, clampedY);
          }

          ctx.closePath();
          ctx.clip();

          // Draw Parchment Paper Sheet
          ctx.fillStyle = '#F5EFE6';
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 14;
          ctx.roundRect(paperX, paperY, paperW, paperH, 8);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Notebook horizontal lines matching dynamic line height
          ctx.strokeStyle = 'rgba(125, 152, 161, 0.22)';
          ctx.lineWidth = 1;
          for (let y = paperY + fireLineHeight + 6; y < paperY + paperH - 6; y += fireLineHeight) {
            ctx.beginPath();
            ctx.moveTo(paperX + 14, y);
            ctx.lineTo(paperX + paperW - 14, y);
            ctx.stroke();
          }

          // Draw User Written Text with full multi-line capacity (500+ characters)
          ctx.fillStyle = '#2C2B2A';
          ctx.font = `500 ${fireFontSize}px "Newsreader", Georgia, serif`;
          fireLines.forEach((line, idx) => {
            const y = paperY + 4 + (idx + 1) * fireLineHeight;
            if (y <= paperY + paperH - 4) {
              ctx.fillText(line, paperX + 16, y);
            }
          });

          ctx.restore();

          // Draw Charred Ash and Glowing Incandescent Ember Edge
          if (burnRadius > 5 && progress < 0.95) {
            ctx.save();

            // 1. Charred Black/Dark Brown Border
            ctx.strokeStyle = '#1F140E';
            ctx.lineWidth = 6;
            ctx.beginPath();
            burnPoints.forEach((pt, idx) => {
              if (idx === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();

            // 2. Glowing Orange/Yellow Hot Ember Seam
            ctx.shadowColor = '#FF6B00';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = '#FF8C38';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            burnPoints.forEach((pt, idx) => {
              if (idx === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();

            // 3. Ultra-hot White-Yellow Core Highlights along edge
            ctx.strokeStyle = '#FFE899';
            ctx.lineWidth = 1;
            ctx.beginPath();
            burnPoints.forEach((pt, idx) => {
              if (idx % 2 === 0) {
                if (idx === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
              }
            });
            ctx.stroke();

            ctx.restore();

            // Micro-flames licking along the burning edge
            const flameStep = Math.max(1, Math.floor(burnPoints.length / 5));
            for (let i = 0; i < burnPoints.length; i += flameStep) {
              const pt = burnPoints[i];
              if (pt.x >= paperX - 10 && pt.x <= paperX + paperW + 10 && pt.y >= paperY - 10 && pt.y <= paperY + paperH + 10) {
                const flameH = (Math.sin(i + now * 0.01) + 1.2) * 12 + 6;
                const flameW = 8;

                ctx.save();
                ctx.translate(pt.x, pt.y);
                ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 140, 50, 0.85)' : 'rgba(255, 70, 30, 0.8)';
                ctx.beginPath();
                ctx.moveTo(-flameW / 2, 0);
                ctx.quadraticCurveTo(0, -flameH, 0, -flameH * 1.2);
                ctx.quadraticCurveTo(flameW / 2, -flameH * 0.4, flameW / 2, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
              }
            }
          }
        }

        // ==========================================
        // FOGATA / HOGUERA VIVA EN LA PARTE INFERIOR (Fire Source)
        // ==========================================
        const fireBaseX = burnOriginX + 15;
        const fireBaseY = height - 12;

        ctx.save();

        // 1. Warm Hearth Glow Under Fire
        const hearthGlow = ctx.createRadialGradient(fireBaseX, fireBaseY - 15, 5, fireBaseX, fireBaseY - 15, 90);
        hearthGlow.addColorStop(0, 'rgba(255, 120, 30, 0.45)');
        hearthGlow.addColorStop(0.6, 'rgba(230, 60, 20, 0.15)');
        hearthGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = hearthGlow;
        ctx.beginPath();
        ctx.arc(fireBaseX, fireBaseY - 15, 90, 0, Math.PI * 2);
        ctx.fill();

        // 2. Firewood / Leños de la fogata
        ctx.fillStyle = '#241611';
        // Left Log
        ctx.save();
        ctx.translate(fireBaseX - 18, fireBaseY - 6);
        ctx.rotate(-0.28);
        ctx.fillRect(-22, -4, 44, 8);
        // Log grain highlight
        ctx.fillStyle = '#3D251D';
        ctx.fillRect(-20, -2, 40, 2);
        ctx.restore();

        // Right Log
        ctx.save();
        ctx.translate(fireBaseX + 18, fireBaseY - 6);
        ctx.rotate(0.28);
        ctx.fillStyle = '#241611';
        ctx.fillRect(-22, -4, 44, 8);
        ctx.fillStyle = '#3D251D';
        ctx.fillRect(-20, -2, 40, 2);
        ctx.restore();

        // Glowing Embers between logs
        ctx.fillStyle = '#FF5500';
        ctx.shadowColor = '#FF9900';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(fireBaseX, fireBaseY - 5, 20, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 3. Helper to draw dynamic organic flame tongues
        const drawFlameTongue = (
          xOffset: number,
          baseWidth: number,
          flameHeight: number,
          color: string,
          timeOffset: number,
          swayFactor: number
        ) => {
          const sway = Math.sin(now * 0.005 + timeOffset) * swayFactor;
          const tipX = fireBaseX + xOffset + sway;
          const tipY = fireBaseY - flameHeight - Math.abs(Math.cos(now * 0.007 + timeOffset)) * 12;
          const leftBaseX = fireBaseX + xOffset - baseWidth / 2;
          const rightBaseX = fireBaseX + xOffset + baseWidth / 2;

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(leftBaseX, fireBaseY - 6);
          // Left curve
          ctx.bezierCurveTo(
            leftBaseX - sway * 0.3, fireBaseY - flameHeight * 0.45,
            tipX - baseWidth * 0.35, fireBaseY - flameHeight * 0.8,
            tipX, tipY
          );
          // Right curve
          ctx.bezierCurveTo(
            tipX + baseWidth * 0.35, fireBaseY - flameHeight * 0.8,
            rightBaseX + sway * 0.3, fireBaseY - flameHeight * 0.45,
            rightBaseX, fireBaseY - 6
          );
          ctx.closePath();
          ctx.fill();
        };

        // LAYER 1: Deep Crimson Outer Flame Aura
        drawFlameTongue(-18, 38, 55, 'rgba(215, 45, 25, 0.75)', 0.5, 9);
        drawFlameTongue(18, 38, 55, 'rgba(215, 45, 25, 0.75)', 2.1, -9);
        drawFlameTongue(0, 44, 75, 'rgba(225, 55, 30, 0.85)', 1.2, 12);

        // LAYER 2: Vibrant Fiery Orange Main Flames
        drawFlameTongue(-10, 30, 62, 'rgba(255, 125, 35, 0.9)', 3.4, 8);
        drawFlameTongue(12, 30, 60, 'rgba(255, 125, 35, 0.9)', 4.7, -8);
        drawFlameTongue(2, 34, 78, 'rgba(255, 140, 40, 0.92)', 0.8, 10);

        // LAYER 3: Golden-Amber Inner Flame
        drawFlameTongue(-4, 22, 50, 'rgba(255, 200, 60, 0.95)', 2.8, 6);
        drawFlameTongue(6, 20, 48, 'rgba(255, 200, 60, 0.95)', 5.2, -6);
        drawFlameTongue(1, 24, 58, 'rgba(255, 215, 80, 0.95)', 1.9, 7);

        // LAYER 4: Bright White-Yellow Flame Core
        drawFlameTongue(0, 14, 30, 'rgba(255, 250, 210, 0.98)', 1.0, 3);

        ctx.restore();

        // 4. Subtle Micro-Sparks ascending gently into the dark air
        if (Math.random() < 0.35) {
          particles.push({
            x: fireBaseX + (Math.random() - 0.5) * 30,
            y: fireBaseY - 20 - Math.random() * 30,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(Math.random() * 2.2 + 1.2),
            size: Math.random() * 1.8 + 0.8, // Small micro sparks
            color: Math.random() > 0.4 ? '#FFD166' : '#FF9F1C',
            alpha: 1,
            life: 1,
          });
        }

        // Draw and update micro sparks
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          p.alpha = Math.max(0, p.life);

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

      } else if (practice === 'mar') {
        // ==========================================
        // 2. MAR: ARENA TEXTURIZADA Y AGUA QUE BORRA LAS PALABRAS
        // ==========================================
        // Warm sand background
        ctx.fillStyle = '#D4C4B2';
        ctx.fillRect(0, 0, width, height);

        // Draw sand grains for realistic texture
        sandGrains.forEach((g) => {
          ctx.fillStyle = g.color;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Wave dynamics: wave moves from left to right (0 to 0.7), then retreats (0.7 to 1.0)
        let waveFrontX = 0;
        if (progress < 0.7) {
          // Wave advancing from left to past right edge
          waveFrontX = (progress / 0.7) * (width + 120);
        } else {
          // Wave gently retreating
          const retreatT = (progress - 0.7) / 0.3;
          waveFrontX = width + 120 - retreatT * (width + 180);
        }

        // Text is permanently erased where the wave has touched
        // The erase barrier is the maximum X the wave reached so far
        const maxWaveReached = Math.min(width, (progress / 0.7) * (width + 120));

        // Draw Inscribed Words in Sand (only on parts not yet washed)
        ctx.save();
        ctx.beginPath();
        // Clip so text is only visible to the right of the erase line
        ctx.rect(maxWaveReached, 0, Math.max(0, width - maxWaveReached), height);
        ctx.clip();

        ctx.fillStyle = '#7A6B5A';
        ctx.font = '500 13px "Newsreader", Georgia, serif';
        sandLines.forEach((line, idx) => {
          const yPos = height / 2 - 40 + idx * 20;
          // Inscribed shadow effect in sand
          ctx.shadowColor = 'rgba(255,255,255,0.4)';
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.fillText(line, 36, yPos);
          ctx.shadowColor = 'transparent';
        });

        ctx.restore();

        // Draw Realistic Translucent Sea Wave
        if (waveFrontX > 0) {
          ctx.save();
          // Wave body gradient
          const waveGrad = ctx.createLinearGradient(0, 0, waveFrontX, 0);
          waveGrad.addColorStop(0, 'rgba(95, 130, 142, 0.88)');
          waveGrad.addColorStop(0.75, 'rgba(125, 152, 161, 0.75)');
          waveGrad.addColorStop(0.95, 'rgba(165, 195, 205, 0.82)');
          waveGrad.addColorStop(1, 'rgba(240, 248, 255, 0.95)');

          ctx.fillStyle = waveGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);

          // Wavy contour front edge with sinusoidal motion
          const wavePhase = now * 0.003;
          for (let y = 0; y <= height; y += 10) {
            const waveOffset = Math.sin(y * 0.05 + wavePhase) * 14 + Math.cos(y * 0.02 - wavePhase) * 8;
            ctx.lineTo(waveFrontX + waveOffset, y);
          }

          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();

          // Frothy White Foam along the edge
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          for (let y = 5; y < height; y += 14) {
            const foamOffset = Math.sin(y * 0.05 + wavePhase) * 14 + Math.cos(y * 0.02 - wavePhase) * 8;
            const bubbleR = (Math.sin(y + now * 0.01) + 1) * 3.5 + 2.5;
            ctx.beginPath();
            ctx.arc(waveFrontX + foamOffset - 4, y, bubbleR, 0, Math.PI * 2);
            ctx.fill();
          }

          // Sea bubbles inside the water
          if (Math.random() < 0.4) {
            particles.push({
              x: Math.random() * waveFrontX,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              size: Math.random() * 3 + 1,
              color: 'rgba(255,255,255,0.6)',
              alpha: 0.8,
              life: 1,
            });
          }

          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= 0.03;
            if (p.life <= 0) {
              particles.splice(i, 1);
              continue;
            }
            ctx.fillStyle = `rgba(255,255,255,${p.life * 0.7})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

      } else {
        // ==========================================
        // 3. GLOBO: CIELO INFINITO, PARGAMINO Y GLOBO QUE SE ELEVA
        // ==========================================
        // Serene sky gradient from dusk to twilight
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#1C262B');
        skyGrad.addColorStop(0.5, '#28383F');
        skyGrad.addColorStop(1, '#3A4C53');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Wind breeze particles floating gently
        if (Math.random() < 0.3) {
          particles.push({
            x: -20,
            y: Math.random() * height,
            vx: Math.random() * 1.5 + 1.2,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * 2 + 1,
            color: 'rgba(143, 175, 154, 0.4)',
            alpha: 0.6,
            life: 1,
          });
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.008;
          if (p.life <= 0 || p.x > width + 20) {
            particles.splice(i, 1);
            continue;
          }
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Balloon & Note position with organic swaying
        const sway = Math.sin(now * 0.002) * 12;
        // In first second (progress < 0.1), stays resting, then rises smoothly
        let riseProgress = 0;
        if (progress > 0.1) {
          riseProgress = (progress - 0.1) / 0.9;
        }

        // Elevation calculation: from center bottom to high sky beyond top
        const startY = height * 0.65;
        const targetY = -180;
        const currentY = startY - riseProgress * (startY - targetY);
        const currentX = width / 2 + sway * (1 - riseProgress * 0.5);

        // Scale decreases slightly as it flies into the distance
        const scale = Math.max(0.2, 1 - riseProgress * 0.75);
        const opacity = Math.max(0, 1 - riseProgress * 0.9);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(currentX, currentY);
        ctx.scale(scale, scale);

        // 1. Balloon String
        ctx.strokeStyle = 'rgba(216, 200, 184, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 36);
        ctx.quadraticCurveTo(sway * 0.4, 60, 0, 85);
        ctx.stroke();

        // 2. Note Paper Attached to String
        const noteW = 160;
        const noteH = 96;
        ctx.fillStyle = '#F7F4EB';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 8;
        ctx.roundRect(-noteW / 2, 85, noteW, noteH, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Note user text
        ctx.fillStyle = '#222';
        ctx.font = '10.5px "Newsreader", Georgia, serif';
        balloonLines.forEach((line, idx) => {
          ctx.fillText(line, -noteW / 2 + 10, 103 + idx * 16);
        });

        // 3. Sage Green Balloon Sphere
        const balloonGrad = ctx.createRadialGradient(-10, -12, 5, 0, 0, 36);
        balloonGrad.addColorStop(0, '#A6C4B0');
        balloonGrad.addColorStop(0.7, '#8FAF9A');
        balloonGrad.addColorStop(1, '#6F8E7A');

        ctx.fillStyle = balloonGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 38, 0, 0, Math.PI * 2);
        ctx.fill();

        // Balloon knot
        ctx.fillStyle = '#6F8E7A';
        ctx.beginPath();
        ctx.moveTo(-4, 38);
        ctx.lineTo(4, 38);
        ctx.lineTo(0, 42);
        ctx.closePath();
        ctx.fill();

        // Balloon soft reflection highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.ellipse(-10, -12, 8, 14, -0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        // Complete practice
        setTimeout(() => {
          onFinish();
        }, 500);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [practice, text, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center max-w-lg mx-auto w-full gap-4 pb-6"
    >
      <div className="text-center space-y-1">
        <h2 className="text-xl font-serif-display font-medium text-[#8FAF9A] tracking-tight">
          Liberando tu carga...
        </h2>
        <p className="text-xs text-white/70">
          Inhala profundo. Observa cómo se disuelve tu carga.
        </p>
      </div>

      {/* Somatic Canvas Visual Display */}
      <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#18181A]">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Progress Bar indicator */}
        <div className="absolute bottom-3 left-6 right-6 flex flex-col gap-1.5 bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/5">
          <div className="flex justify-between text-[10px] text-white/70 font-mono">
            <span>Práctica de transformación</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8FAF9A] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
