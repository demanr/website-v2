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
// 20 degrees off straight south (i.e. down and slightly to the left)
const DIAG_ANGLE_RAD = (70 * Math.PI) / 180;

const BOAT_WIDTH = 166;
const BOAT_HEIGHT = 59;
const BOAT_HULL_BOTTOM = 55.7;
// leave room behind the motor for the wake when the boat pins to the left
const BOAT_LEFT_PAD = 80;

const MOBILE_DOT_SIZE = 14;
const MOBILE_LINE_LEFT_PAD = 20;
const MOBILE_DASH = 6;
const MOBILE_GAP = 8;
const MOBILE_DIAG = 48;
const MOBILE_DIAG_ANGLE_RAD = (25 * Math.PI) / 180;
const MOBILE_SPACING_PER_MONTH = 16;
const MOBILE_TOP_PAD = 28;

const MAX_TILT_DEG = 15;

const FONT_FAMILY = 'Red Hat Display, Inter, sans-serif';
const WAKE_GREY = '#B9CAD2';

function monthsBetween(a: Date, b: Date): number {
  return (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}


function BowWake({ scale, phase }: { scale: number; phase: number }) {
  if (scale <= 0.01) return null;
  const k = Math.min(1, scale * 1.35);
  const x0 = 159;
  const y0 = 55;
  const count = 14;

  return (
    <g pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => {
        const t = (phase * 0.1 + i / count) % 1;
        const reach = (7 + 26 * k) * (0.65 + 0.35 * Math.sin(i * 1.7 + 0.6));
        const height = (3 + 13 * k) * (0.7 + 0.3 * Math.sin(i * 2.3 + 1.2));
        const x = x0 - reach * t + Math.sin(i * 3.1) * 0.8;
        const y = y0 - 4 * height * t * (1 - t);
        const fade = Math.sin(Math.PI * t);
        const r = 0.7 + (0.8 + 0.8 * Math.sin(i * 2.7 + 0.4)) * k;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={Math.max(0.5, r)}
            fill={WAKE_GREY}
            opacity={0.55 * k * fade}
          />
        );
      })}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = phase * 0.7 + i;
        return (
          <circle
            key={`c${i}`}
            cx={x0 - 1 + Math.cos(a) * (2 + i * 0.6)}
            cy={y0 + Math.sin(a) * 1.6}
            r={1 + (i % 3) * 0.5}
            fill={WAKE_GREY}
            opacity={0.45 * k}
          />
        );
      })}
    </g>
  );
}

function PrincecraftBoat() {
  return (
    <g
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Evinrude outboard, tight to the transom */}
      <path d="M4.5 25.5c0-2.6 1.8-4.3 4.4-4.3h8c2.5 0 4 1.7 4 4.2v4.6c0 2.6-1.8 4.4-4.4 4.4H9c-2.9 0-4.5-2-4.5-4.6z" />
      <path d="M5 28.1h16" strokeWidth={1.2} />
      <path d="M19 21.2v13" strokeWidth={1} opacity={0.5} />
      <path d="M10 34.4h5.5l1 8.6H11z" />
      <path d="M7.5 43h9.5" strokeWidth={1.3} />
      <path d="M11.5 43 10.5 50h4l-1-7" />
      <path d="M8 50.2h4" strokeWidth={1.3} />
      <path d="M6.5 30.6h5" strokeWidth={1} opacity={0.7} />
      <path d="M20.8 31.5 23 33.2" strokeWidth={1.2} />

      {/* red deck edge */}
      <path
        d="M22 34 H134 C148 34 157 33.5 163 32 L161.7 35 C153 37.2 145 38.5 134 38.5 H22 Z"
        fill="#B33A3A"
        stroke="none"
      />

      {/* hull */}
      <path d="M22 34 H134 C148 34 157 33.5 163 32 L160 38 C156 45 148 50 137 52 C116 55 85 56 54 55.7 H22 Z" />

      {/* rub rail + lower hull line, both landing on the bow edge */}
      <path
        d="M22.5 38.4h110c13 0 23-1.5 29.2-3.4"
        strokeWidth={1.2}
        opacity={0.55}
      />
      <path
        d="M22.5 47.3c47 1.1 85.5.4 110-2.7 9.6-1.2 18.5-3.2 29.2-9.6"
        strokeWidth={1.2}
      />

      {/* clear wrap-around windshield, seated on the deck */}
      <path
        d="M98 34V20c5.5-.6 11 2.8 14.5 7.5L119 34z"
        fill="#8FA3AD"
        fillOpacity={0.22}
        stroke="none"
      />
      <path d="M98 34V20c5.5-.6 11 2.8 14.5 7.5L119 34z" />
      <path d="M98 24.5c4.5-.6 9 1.8 12 5.5" strokeWidth={1} opacity={0.7} />
      <path
        d="M99.5 31.5c.6-4 2.3-7.4 5-9.3"
        strokeWidth={1}
        opacity={0.45}
      />

      {/* connected white + yellow side stripes */}
      <path
        d="M42 47.4 49 38.6h4l-7 8.8z"
        fill="#fff"
        stroke="none"
        opacity={0.95}
      />
      <path d="M46 47.4 53 38.6h4l-7 8.8z" fill="#E8B93B" stroke="none" />

      <text
        x="59.5"
        y="46"
        fontSize="4.6"
        fontWeight="700"
        letterSpacing=".7"
        fill="#fff"
        stroke="none"
        fontFamily={FONT_FAMILY}
      >
        PRINCECRAFT
      </text>
    </g>
  );
}

function MobileTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;

    const update = () => setWidth(element.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // newest first
  const orderedPositions = positions;

  const cumulativeMonths = useMemo(() => {
    const result: number[] = [0];
    for (let i = 1; i < orderedPositions.length; i++) {
      result.push(
        result[i - 1] +
          monthsBetween(
            orderedPositions[i - 1].startDate,
            orderedPositions[i].startDate,
          ),
      );
    }
    return result;
  }, [orderedPositions]);

  const totalMonths = cumulativeMonths[cumulativeMonths.length - 1];
  const lineX = MOBILE_LINE_LEFT_PAD;
  const lineTop = MOBILE_TOP_PAD;
  const lineBottom = MOBILE_TOP_PAD + totalMonths * MOBILE_SPACING_PER_MONTH;
  const svgHeight = lineBottom + 72;

  const dotCenters = useMemo(() => {
    return cumulativeMonths.map((m) => ({
      x: lineX,
      y: MOBILE_TOP_PAD + m * MOBILE_SPACING_PER_MONTH,
    }));
  }, [cumulativeMonths, lineX]);

  const dx = MOBILE_DIAG * Math.cos(MOBILE_DIAG_ANGLE_RAD);
  const dy = MOBILE_DIAG * Math.sin(MOBILE_DIAG_ANGLE_RAD);

  return (
    <div className="w-full" ref={wrapRef}>
      {width > 0 && (
        <svg width={width} height={svgHeight} className="overflow-visible">
          <line
            x1={lineX}
            y1={lineTop}
            x2={lineX}
            y2={lineBottom}
            stroke="white"
            strokeWidth={1.5}
            strokeDasharray={`${MOBILE_DASH} ${MOBILE_GAP}`}
          />
          <line
            x1={lineX - 6}
            y1={lineTop}
            x2={lineX + 6}
            y2={lineTop}
            stroke="white"
            strokeWidth={1.5}
          />
          <line
            x1={lineX - 6}
            y1={lineBottom}
            x2={lineX + 6}
            y2={lineBottom}
            stroke="white"
            strokeWidth={1.5}
          />

          {dotCenters.map((c, i) => {
            const endX = c.x + dx;
            const endY = c.y + dy;

            return (
              <g key={orderedPositions[i].company + orderedPositions[i].title}>
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={endX}
                  y2={endY}
                  stroke="white"
                  strokeWidth={1}
                />
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={MOBILE_DOT_SIZE / 2}
                  fill="#0C0D14"
                  stroke="white"
                  strokeWidth={1.5}
                />
                <foreignObject
                  x={endX + 10}
                  y={endY - 10}
                  width={Math.max(width - endX - 24, 40)}
                  height={54}
                >
                  <div
                    {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as any)}
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: FONT_FAMILY,
                      textAlign: 'left',
                      lineHeight: 1.25,
                    }}
                  >
                    <div
                      style={{ fontWeight: 700, textDecoration: 'underline' }}
                    >
                      {orderedPositions[i].company}
                    </div>
                    <div>{orderedPositions[i].title}</div>
                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
                      {formatDate(orderedPositions[i].startDate)}
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

function DesktopTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [spacingPerMonth, setSpacingPerMonth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(600);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [wakeScale, setWakeScale] = useState(0);
  const [wakePhase, setWakePhase] = useState(0);
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

  // newest first
  const orderedPositions = positions;

  const cumulativeMonths = useMemo(() => {
    const result: number[] = [0];
    for (let i = 1; i < orderedPositions.length; i++) {
      result.push(
        result[i - 1] +
          monthsBetween(
            orderedPositions[i - 1].startDate,
            orderedPositions[i].startDate,
          ),
      );
    }
    return result;
  }, [orderedPositions]);

  const totalMonths = cumulativeMonths[cumulativeMonths.length - 1];
  // extra room after the oldest dot so its label is never clipped
  const timelineWidth = totalMonths * spacingPerMonth + 120;
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
      const REEMERGE = 0.15;
      currentTiltRef.current += (targetTilt - currentTiltRef.current) * REEMERGE;
      // The wake is about motion, not exact velocity: any meaningful scroll
      // delta brings it up immediately, then the loop fades it out.
      const wakeTarget = Math.min(1, dScroll / 10);
      currentWakeRef.current = Math.max(currentWakeRef.current, wakeTarget);
    }

    const svgXAtBoat = BOAT_LEFT_PAD - sectionRect.left;
    const progress = Math.max(0, Math.min(1, (svgXAtBoat - boatAndGapWidth) / (totalMonths * spacingPerMonth || 1)));

    const newestDate = orderedPositions[0].startDate;
    const oldestDate = orderedPositions[orderedPositions.length - 1].startDate;
    const dateRange = oldestDate.getTime() - newestDate.getTime();
    const currentDate = new Date(newestDate.getTime() + dateRange * progress);
    setDateText(formatDate(currentDate));
  }, [boatAndGapWidth, spacingPerMonth, totalMonths]);

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

      if (Math.abs(currentTiltRef.current) < 0.01) currentTiltRef.current = 0;
      if (Math.abs(currentWakeRef.current) < 0.005) {
        currentWakeRef.current = 0;
      }

      setTiltAngle(currentTiltRef.current);
      setWakeScale(currentWakeRef.current);
      if (currentWakeRef.current > 0.01) {
        setWakePhase((phase) => (phase + 0.16) % (Math.PI * 2));
      }
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
                  <div style={{ fontWeight: 700, textDecoration: 'underline'}}>{orderedPositions[i].company}</div>
                  <div>{orderedPositions[i].title}</div>
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
              {(() => {
                const waterlineY = boatTop + BOAT_HULL_BOTTOM;
                const disp = wakeScale;
                const phase = wakePhase;
                const sternX = BOAT_LEFT_PAD + 3.5;
                const els: JSX.Element[] = [];
                let k = 0;

                // Dense bubbles right at the motor.
                for (let i = 0; i < 10; i++) {
                  const a = i * 1.7;
                  const x =
                    sternX - 2 - (i % 4) * 2.2 + Math.sin(phase + a) * 1.2;
                  const y =
                    waterlineY +
                    Math.sin(phase * 1.2 + a) * (1.5 + (i % 3) * 1.2);
                  const r = 1 + (i % 4) * 0.45;
                  els.push(
                    <circle
                      key={k++}
                      cx={x}
                      cy={y}
                      r={r}
                      fill={WAKE_GREY}
                      opacity={0.5 * disp}
                    />,
                  );
                }

                // Loose bubble trail spreading aft.
                const count = 22;
                for (let i = 0; i < count; i++) {
                  const t = i / (count - 1);
                  const jitter = Math.sin(i * 12.9898) * 2.2;
                  const x = sternX - 8 - t * 68 + jitter;
                  const spread = 1.5 + t * 4.5;
                  const y =
                    waterlineY +
                    Math.sin(i * 2.1 + phase * 1.4) * spread +
                    Math.cos(i * 1.3) * 1.2;
                  const r =
                    0.7 +
                    (0.8 + 0.7 * Math.sin(i * 3.3 + phase)) *
                      (1 - t * 0.2);
                  const fade =
                    (1 - t) *
                    (0.55 + 0.45 * Math.sin(phase * 1.5 + i * 1.1));
                  els.push(
                    <circle
                      key={k++}
                      cx={x}
                      cy={y}
                      r={Math.max(0.4, r)}
                      fill={WAKE_GREY}
                      opacity={Math.max(0, fade) * 0.5 * disp}
                    />,
                  );
                }

                return <g>{els}</g>;
              })()}
            </svg>
          )}

          <div
            className="boat-bob"
            style={{
              position: 'absolute',
              top: boatTop,
              left: BOAT_LEFT_PAD,
              width: BOAT_WIDTH,
              height: BOAT_HEIGHT,
              transformOrigin: '80px 44px',
            }}
          >
            <svg
              width={BOAT_WIDTH}
              height={BOAT_HEIGHT}
              viewBox="0 0 166 59"
              className="overflow-visible"
              style={{
                display: 'block',
                transform: `rotate(${tiltAngle}deg)`,
                transformOrigin: `0px ${BOAT_HULL_BOTTOM}px`,
              }}
            >
              <PrincecraftBoat />
              <BowWake scale={wakeScale} phase={wakePhase} />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Timeline({ variant = 'desktop' }: TimelineProps) {
  if (variant === 'mobile') return <MobileTimeline />;
  return <DesktopTimeline />;
}
