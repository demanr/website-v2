import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { positions } from '@/types/positions';

interface TimelineProps {
  variant?: 'mobile' | 'desktop';
}

const DOT_SIZE = 16;
const DESKTOP_DASH = 24;
const DESKTOP_GAP = 24;
const SHORT_DIAG = 64;
const TALL_DIAG = 115;
const DIAG_ANGLE_RAD = (67 * Math.PI) / 180;

const BOAT_WIDTH = 166;
const BOAT_HEIGHT = 59;
const BOAT_HULL_BOTTOM = 58;
const BOAT_LEFT_PAD = 24;

const MOBILE_DOT_SIZE = 14;
const MOBILE_LINE_X = 28;
const MOBILE_DASH = 16;
const MOBILE_GAP = 16;
const MOBILE_DIAG = 50;
const MOBILE_DIAG_ANGLE_RAD = (25 * Math.PI) / 180;
const MOBILE_SPACING_PER_MONTH = 12;

const MAX_TILT_DEG = 15;
const MAX_WAKE_SCALE = 1;
const WAKE_LEN = 280;
const WAKE_SPEED_THRESHOLD = 0.4;

const FONT_FAMILY = 'Red Hat Display, Inter, sans-serif';

function measureWidth(text: string, fontSize: number, weight: string): number {
  if (typeof document === 'undefined') return 0;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;
  ctx.font = `${weight} ${fontSize}px ${FONT_FAMILY}`;
  return ctx.measureText(text).width;
}

function monthsBetween(a: Date, b: Date): number {
  return (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}


const boatHullPath = 'M20.4002 57.358C9.71922 57.358 10.0007 30.6284 10.0007 30.6284H108.905C119.304 30.6284 115.931 3.00781 115.931 3.00781L140.95 30.6284H164C164 30.6284 154.443 55.8959 137.577 57.358C120.711 58.8201 31.0812 57.358 20.4002 57.358Z';
const boatCabinPath = 'M4.16481 14.3672H22.0983C22.0983 14.3672 23.649 14.4129 24.7885 14.6661C29.9165 15.8057 25.388 27.8185 25.388 27.8185H4.16481C4.16481 27.8185 -2.95602 14.3672 4.16481 14.3672Z';

function MobileTimeline() {
  const cumulativeMonths = useMemo(() => {
    const result: number[] = [0];
    for (let i = 1; i < positions.length; i++) {
      result.push(result[i - 1] + monthsBetween(positions[i - 1].startDate, positions[i].startDate));
    }
    return result;
  }, []);

  const totalMonths = cumulativeMonths[cumulativeMonths.length - 1];
  const svgHeight = 60 + totalMonths * MOBILE_SPACING_PER_MONTH;

  const dotCenters = useMemo(() => {
    return cumulativeMonths.map((m) => ({
      x: MOBILE_LINE_X,
      y: 40 + m * MOBILE_SPACING_PER_MONTH,
    }));
  }, [cumulativeMonths]);

  const yearLabels: { year: number; y: number }[] = useMemo(() => {
    const labels: { year: number; y: number }[] = [];
    let currentYear = -1;
    for (let i = 0; i < positions.length; i++) {
      const year = positions[i].startDate.getFullYear();
      if (year !== currentYear) {
        labels.push({ year, y: dotCenters[i].y });
        currentYear = year;
      }
    }
    return labels;
  }, [dotCenters]);

  const textWidths = useMemo(() => {
    return positions.map((p) => {
      const cw = measureWidth(p.company, 15, '700');
      const tw = measureWidth(p.title, 15, '400');
      return Math.max(cw, tw);
    });
  }, []);

  return (
    <div className="w-full px-12 py-4">
      <svg width="100%" height={svgHeight} className="overflow-visible">
        <line
          x1={MOBILE_LINE_X}
          y1={40}
          x2={MOBILE_LINE_X}
          y2={40 + totalMonths * MOBILE_SPACING_PER_MONTH}
          stroke="white"
          strokeWidth={1.5}
          strokeDasharray={`${MOBILE_DASH} ${MOBILE_GAP}`}
        />
        {dotCenters.map((c, i) => {
          const dx = MOBILE_DIAG * Math.cos(MOBILE_DIAG_ANGLE_RAD);
          const dy = MOBILE_DIAG * Math.sin(MOBILE_DIAG_ANGLE_RAD);
          const endX = c.x + dx;
          const endY = c.y + dy;

          return (
            <g key={i}>
              <line x1={c.x} y1={c.y} x2={endX} y2={endY} stroke="white" strokeWidth={1} />
              <circle cx={c.x} cy={c.y} r={MOBILE_DOT_SIZE / 2} fill="#0C0D14" stroke="white" strokeWidth={1.5} />
              <foreignObject x={endX + 8} y={endY - 12} width={textWidths[i]} height={44}>
                <div {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as any)} style={{ color: 'white', fontSize: 15, fontFamily: FONT_FAMILY, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, textDecoration: 'underline' }}>{positions[i].company}</div>
                  <div>{positions[i].title}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
        {yearLabels.map((ly) => (
          <text
            key={ly.year}
            x={MOBILE_LINE_X - 12}
            y={ly.y}
            textAnchor="end"
            fill="white"
            fontSize={12}
            fontFamily={FONT_FAMILY}
            opacity={0.6}
          >
            {ly.year}
          </text>
        ))}
      </svg>
    </div>
  );
}

function DesktopTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [spacingPerMonth, setSpacingPerMonth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(600);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [wakeScale, setWakeScale] = useState(0);
  const [dateText, setDateText] = useState('');
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const currentTiltRef = useRef(0);
  const currentWakeRef = useRef(0);
  const peakWakeRef = useRef(0);
  const animFrameRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const ww = window.innerWidth;
      setWindowWidth(ww);
      setSpacingPerMonth(ww / 24);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cumulativeMonths = useMemo(() => {
    const result: number[] = [0];
    for (let i = 1; i < positions.length; i++) {
      result.push(result[i - 1] + monthsBetween(positions[i - 1].startDate, positions[i].startDate));
    }
    return result;
  }, []);

  const totalMonths = cumulativeMonths[cumulativeMonths.length - 1];
  const timelineWidth = totalMonths * spacingPerMonth + 60;
  const gapWidth = windowWidth / 8;
  const boatAndGapWidth = BOAT_LEFT_PAD + BOAT_WIDTH + gapWidth;

  const svgHeight = 380;
  const lineY = 220;
  const boatTop = lineY - BOAT_HULL_BOTTOM - 8;

  const handleScroll = useCallback(() => {
    const container = document.getElementById('home-scroll-desktop');
    if (!container || !sectionRef.current) return;

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    const dScroll = container.scrollLeft - lastScrollRef.current;
    lastScrollRef.current = container.scrollLeft;
    lastTimeRef.current = now;

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const isBoatStuck = sectionRect.left <= 0;

    if (dt > 0 && dScroll > 0 && isBoatStuck) {
      const v = dScroll / dt;
      const SMOOTHING = 0.12;
      velocityRef.current = velocityRef.current + (v - velocityRef.current) * SMOOTHING;
      const targetTilt = -Math.min(velocityRef.current * 6, MAX_TILT_DEG);
      const targetWake = v > WAKE_SPEED_THRESHOLD ? Math.min(v, MAX_WAKE_SCALE) : 0;
      const REEMERGE = 0.15;
      currentTiltRef.current += (targetTilt - currentTiltRef.current) * REEMERGE;
      currentWakeRef.current += (targetWake - currentWakeRef.current) * REEMERGE;
    }

    const svgXAtBoat = BOAT_LEFT_PAD - sectionRect.left;
    const progress = Math.max(0, Math.min(1, (svgXAtBoat - boatAndGapWidth) / (totalMonths * spacingPerMonth || 1)));

    const newestDate = positions[0].startDate;
    const oldestDate = positions[positions.length - 1].startDate;
    const dateRange = oldestDate.getTime() - newestDate.getTime();
    const currentDate = new Date(newestDate.getTime() + dateRange * progress);
    setDateText(formatDate(currentDate));
  }, [boatAndGapWidth, timelineWidth]);

  useEffect(() => {
    const container = document.getElementById('home-scroll-desktop');
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const DECAY_LERP = 0.07;

    const loop = () => {
      if (velocityRef.current > 0) {
        velocityRef.current *= 0.98;
        if (velocityRef.current < 0.001) velocityRef.current = 0;
      }

      currentTiltRef.current += (0 - currentTiltRef.current) * DECAY_LERP;
      currentWakeRef.current += (0 - currentWakeRef.current) * DECAY_LERP;

      if (currentWakeRef.current > peakWakeRef.current) {
        peakWakeRef.current = currentWakeRef.current;
      }

      if (Math.abs(currentTiltRef.current) < 0.01) currentTiltRef.current = 0;
      if (Math.abs(currentWakeRef.current) < 0.005) {
        currentWakeRef.current = 0;
        peakWakeRef.current = 0;
      }

      setTiltAngle(currentTiltRef.current);
      setWakeScale(currentWakeRef.current);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const totalWidth = boatAndGapWidth + timelineWidth;
  const lineEndX = timelineWidth;
  const markerSize = 10;

  const dotCenters = useMemo(() => {
    return cumulativeMonths.map((m) => ({
      x: m * spacingPerMonth,
      y: lineY,
    }));
  }, [cumulativeMonths, spacingPerMonth, lineY]);

  const LABEL_WIDTH = 220;

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ width: totalWidth, height: svgHeight }}
    >
      <svg
        width={totalWidth}
        height={svgHeight}
        className="overflow-visible"
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
      >
        <line
          x1={BOAT_LEFT_PAD}
          y1={lineY - markerSize}
          x2={BOAT_LEFT_PAD}
          y2={lineY + markerSize}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
        <line
          x1={BOAT_LEFT_PAD - markerSize}
          y1={lineY}
          x2={BOAT_LEFT_PAD + markerSize}
          y2={lineY}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />

        <line
          x1={BOAT_LEFT_PAD}
          y1={lineY}
          x2={boatAndGapWidth + lineEndX}
          y2={lineY}
          stroke="#FFFFFF"
          strokeWidth={1.5}
          strokeDasharray={`${DESKTOP_DASH} ${DESKTOP_GAP}`}
        />

        <line
          x1={boatAndGapWidth + lineEndX}
          y1={lineY - markerSize}
          x2={boatAndGapWidth + lineEndX}
          y2={lineY + markerSize}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
        <line
          x1={boatAndGapWidth + lineEndX - markerSize}
          y1={lineY}
          x2={boatAndGapWidth + lineEndX + markerSize}
          y2={lineY}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />

        {dotCenters.map((c, i) => {
          const dotX = boatAndGapWidth + c.x;
          const isShort = i % 2 === 0;
          const diagLen = isShort ? SHORT_DIAG : TALL_DIAG;
          const dx = diagLen * Math.cos(DIAG_ANGLE_RAD);
          const dy = diagLen * Math.sin(DIAG_ANGLE_RAD);
          const endX = dotX - dx;
          const endY = c.y + dy;

          if (dotX > boatAndGapWidth + lineEndX) return null;

          return (
            <g key={i}>
              <line x1={dotX} y1={c.y} x2={endX} y2={endY} stroke="white" strokeWidth={1} />
              <circle cx={dotX} cy={c.y} r={DOT_SIZE / 2} fill="#0C0D14" stroke="white" strokeWidth={1.5} />
              <foreignObject x={endX - 112} y={endY + 18} width={LABEL_WIDTH} height={50}>
                <div {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as any)} style={{ color: 'white', fontSize: 18, fontFamily: FONT_FAMILY, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, textDecoration: 'underline'}}>{positions[i].company}</div>
                  <div>{positions[i].title}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      <div
        className="sticky top-0 left-0 z-20"
        style={{ width: boatAndGapWidth, height: svgHeight }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div
            style={{
              position: 'absolute',
              top: boatTop - 20,
              left: BOAT_LEFT_PAD,
              width: BOAT_WIDTH,
              textAlign: 'left',
              color: 'white',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: FONT_FAMILY,
            }}
          >
            {dateText}
          </div>

          <svg
            width={BOAT_WIDTH}
            height={BOAT_HEIGHT}
            viewBox="0 0 166 59"
            className="overflow-visible"
            style={{
              position: 'absolute',
              top: boatTop,
              left: BOAT_LEFT_PAD,
              transform: `rotate(${tiltAngle}deg)`,
              transformOrigin: `0px ${BOAT_HULL_BOTTOM}px`,
            }}
          >
            <g>
              <path d={boatHullPath} stroke="white" strokeWidth={2} fill="none" />
              <path d={boatCabinPath} stroke="white" strokeWidth={2} fill="none" />
            </g>
          </svg>

          {wakeScale > 0.01 && (
            <svg
              className="overflow-visible"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <defs>
                <filter id="wake-blur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <filter id="wake-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
              </defs>
              {(() => {
                const sternX = BOAT_LEFT_PAD + 164;
                const waterlineY = boatTop + BOAT_HULL_BOTTOM - 10;
                const len = WAKE_LEN * Math.max(wakeScale, peakWakeRef.current);
                const dispY = wakeScale;
                const sinkOffset = (1 - wakeScale) * 5;
                const els: JSX.Element[] = [];
                let k = 0;

                // Layer 0: Bow wave — starts partway along hull, stretches into stern wake
                const bowTipX = BOAT_LEFT_PAD + BOAT_WIDTH - 2;
                const bowStartX = bowTipX - 30;
                const totalBowLen = ((bowStartX - sternX) + len) * 1.5;
                const bowCount = 40;
                for (let i = 0; i < bowCount; i++) {
                  const t = i / bowCount;
                  const x = bowStartX - t * totalBowLen;
                  const peakT = 0.08;
                  const crestHeight = t < peakT
                    ? (t / peakT) * 8
                    : Math.pow(Math.max(0, 1 - (t - peakT) / (1 - peakT)), 1.4) * 8;
                  const undulate = Math.sin(i * 1.5 + 0.6) * (1 + t * 2) * dispY;
                  const y = waterlineY - crestHeight * dispY + undulate + sinkOffset;
                  const fade = Math.pow(1 - t, 1.03);
                  const r = 5 + Math.sin(i * 1.8) * 2 + (t < 0.3 ? (1 - t / 0.3) * 3 : 0);
                  els.push(
                    <circle key={k++} cx={x} cy={y} r={r}
                      fill="white" opacity={fade * 0.35 * wakeScale}
                      filter="url(#wake-blur)" />
                  );
                  if (i % 3 === 0) {
                    els.push(
                      <circle key={k++} cx={x - r * 0.3} cy={y + r * 0.5} r={r * 0.5}
                        fill="white" opacity={fade * 0.59 * wakeScale}
                        filter="url(#wake-blur)" />
                    );
                  }
                }

                // Layer 1: Dense foam churn right at the stern (scales with wakeScale)
                // const churnSpread = 30 * wakeScale;
                // for (let i = 0; i < 8; i++) {
                //   const t = i / 8;
                //   const x = sternX - t * churnSpread;
                //   const y = waterlineY - 2 + Math.sin(i * 1.8) * 4;
                //   const r = (6 + t * 8) * Math.max(0.4, wakeScale);
                //   els.push(
                //     <circle key={k++} cx={x} cy={y} r={r}
                //       fill="white" opacity={0.25 * wakeScale * (1 - t * 0.5)}
                //       filter="url(#wake-blur)" />
                //   );
                // }

                // Layer 2: Rolling foam clouds that expand outward
                const cloudCount = 14;
                for (let i = 0; i < cloudCount; i++) {
                  const t = i / cloudCount;
                  const x = sternX - 15 - t * len;
                  const fade = Math.pow(1 - t, 1.2);
                  const spreadY = t * 12 * dispY;
                  const y = waterlineY + Math.sin(i * 2.4 + 0.5) * spreadY + sinkOffset;
                  const baseR = 5 + t * 12;
                  const r = baseR + Math.sin(i * 1.9) * 6;
                  els.push(
                    <circle key={k++} cx={x} cy={y} r={r}
                      fill="white" opacity={fade * 0.7 * wakeScale}
                      filter="url(#wake-blur-lg)" />
                  );
                  if (i % 2 === 0) {
                    els.push(
                      <circle key={k++} cx={x + r * 0.4} cy={y - r * 0.3 * dispY} r={r * 0.6}
                        fill="white" opacity={fade * 0.42 * wakeScale}
                        filter="url(#wake-blur-lg)" />
                    );
                  }
                }

                // Layer 3: Upper splash droplets — small rising puffs
                // for (let i = 0; i < 6; i++) {
                //   const t = (i + 1) / 7;
                //   const x = sternX - 10 - t * len * 0.5;
                //   const y = waterlineY - 8 - Math.sin(i * 1.3) * (6 + t * 10);
                //   const r = 3 + t * 5;
                //   const fade = Math.pow(1 - t, 2);
                //   els.push(
                //     <circle key={k++} cx={x} cy={y} r={r}
                //       fill="white" opacity={fade * 0.14 * wakeScale}
                //       filter="url(#wake-blur)" />
                //   );
                // }

                // Layer 4: Trailing thin foam line at waterline
                // for (let i = 0; i < 10; i++) {
                //   const t = (i + 1) / 10;
                //   const x = sternX - 15 - t * len;
                //   const y = waterlineY + Math.sin(i * 3.7) * 2;
                //   const rx = 8 + t * 14;
                //   const ry = 2 + t * 3;
                //   const fade = Math.pow(1 - t, 1.8);
                //   els.push(
                //     <ellipse key={k++} cx={x} cy={y} rx={rx} ry={ry}
                //       fill="white" opacity={fade * 0.1 * wakeScale}
                //       filter="url(#wake-blur)" />
                //   );
                // }

                return <g>{els}</g>;
              })()}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Timeline({ variant = 'desktop' }: TimelineProps) {
  if (variant === 'mobile') return <MobileTimeline />;
  return <DesktopTimeline />;
}
