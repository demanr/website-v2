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

const BOAT_WIDTH = 197;
const BOAT_HEIGHT = 60;
const BOAT_HULL_BOTTOM = 58;
const BOAT_LEFT_PAD = 24;

const MOBILE_DOT_SIZE = 14;
const MOBILE_LINE_X = 28;
const MOBILE_DASH = 16;
const MOBILE_GAP = 16;
const MOBILE_DIAG = 50;
const MOBILE_DIAG_ANGLE_RAD = (25 * Math.PI) / 180;
const MOBILE_SPACING_PER_MONTH = 12;

const MAX_TILT_DEG = 10;
const MAX_WAKE_SCALE = 1;
const DECAY_DURATION_MS = 3000;

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

const boatHullPath = 'M21.0283 57.5907C9.67017 57.5907 9.9695 30.6881 9.9695 30.6881H136.412C147.47 30.6881 143.883 2.88867 143.883 2.88867L170.489 30.6881H195C195 30.6881 184.837 56.1192 166.902 57.5907C148.967 59.0623 32.3865 57.5907 21.0283 57.5907Z';
const boatCabinPath = 'M4.16481 14.248H22.0983C22.0983 14.248 23.649 14.2937 24.7885 14.547C29.9165 15.6865 25.388 27.6994 25.388 27.6994H4.16481C4.16481 27.6994 -2.95602 14.248 4.16481 14.248Z';

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
    <div className="w-full px-12 py-8">
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
  const lineY = 250;
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
      currentTiltRef.current = -Math.min(velocityRef.current * 3, MAX_TILT_DEG);
      currentWakeRef.current = Math.min(v, MAX_WAKE_SCALE);
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
    const decayFactor = Math.pow(0.01, 1 / ((60 * DECAY_DURATION_MS) / 1000));

    const loop = () => {
      if (velocityRef.current > 0) {
        velocityRef.current *= 0.98;
        if (velocityRef.current < 0.001) velocityRef.current = 0;
      }

      currentTiltRef.current *= decayFactor;
      currentWakeRef.current *= decayFactor;

      if (Math.abs(currentTiltRef.current) < 0.01) currentTiltRef.current = 0;
      if (Math.abs(currentWakeRef.current) < 0.005) currentWakeRef.current = 0;

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
            viewBox="0 0 197 60"
            style={{
              position: 'absolute',
              top: boatTop,
              left: BOAT_LEFT_PAD,
              transform: `rotate(${tiltAngle}deg)`,
              transformOrigin: `0px ${BOAT_HULL_BOTTOM}px`,
            }}
          >
            <g>
              {wakeScale > 0.01 && (
                <>
                  <line
                    x1={8}
                    y1={BOAT_HULL_BOTTOM - 10}
                    x2={-80 * wakeScale}
                    y2={BOAT_HULL_BOTTOM - 10}
                    stroke="white"
                    strokeWidth={1.5}
                    opacity={0.4 * wakeScale}
                    strokeLinecap="round"
                  />
                  <line
                    x1={8}
                    y1={BOAT_HULL_BOTTOM - 4}
                    x2={-60 * wakeScale}
                    y2={BOAT_HULL_BOTTOM - 4}
                    stroke="white"
                    strokeWidth={1}
                    opacity={0.3 * wakeScale}
                    strokeLinecap="round"
                  />
                  <line
                    x1={12}
                    y1={BOAT_HULL_BOTTOM + 3}
                    x2={-40 * wakeScale}
                    y2={BOAT_HULL_BOTTOM + 3}
                    stroke="white"
                    strokeWidth={1}
                    opacity={0.2 * wakeScale}
                    strokeLinecap="round"
                  />
                </>
              )}
              <path d={boatHullPath} stroke="white" strokeWidth={2} fill="none" />
              <path d={boatCabinPath} stroke="white" strokeWidth={2} fill="none" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Timeline({ variant = 'desktop' }: TimelineProps) {
  if (variant === 'mobile') return <MobileTimeline />;
  return <DesktopTimeline />;
}
