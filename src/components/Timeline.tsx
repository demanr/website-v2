import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
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

const MOBILE_RAIL_X = 72;
const MOBILE_TOP_PAD = 34;
const MOBILE_BOTTOM_PAD = 180;
const MOBILE_SPACING_PER_MONTH = 32;
const MOBILE_BOAT_WIDTH = 60;
const MOBILE_BOAT_HEIGHT = 150;
const MOBILE_BOAT_DRIFT = 0.06;
const MOBILE_BOAT_ZOOM = 1.1;

const MAX_TILT_DEG = 2;

const FONT_FAMILY = 'Red Hat Display, Inter, sans-serif';
const WAKE_GREY = '#B9CAD2';

function monthsBetween(a: Date, b: Date): number {
  return (
    (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth())
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function nb(text: string): string {
  return text.replace(/-/g, '\u2011');
}

function wakeRand(i: number) {
  const x = Math.sin(i * 12.9898 + 7.13) * 43758.5453;
  return x - Math.floor(x);
}

// Bow wake: bubbles thrown from the bow in two tiers, arcing back and falling
// to the timeline. Coordinates are in boat-local units.
function BowWake({
  scale,
  phase,
  lineY,
}: {
  scale: number;
  phase: number;
  lineY: number;
}) {
  const k = Math.min(1, scale * 1.7);
  if (k <= 0.01) return null;

  const L = lineY;
  const originX = 134 + 6 + 5; // bow contact, nudged toward the bow
  const originY = BOAT_HULL_BOTTOM;
  const cycle = phase * 0.0333; // about one throw every 3s

  const bubbles: JSX.Element[] = [];

  for (let i = 0; i < 30; i++) {
    const f = (cycle + i / 30) % 1;
    const a = ((34 + 36 * wakeRand(i + 3)) * Math.PI) / 180;
    const R = (22 + 118 * k) * (0.7 + 0.3 * wakeRand(i + 9));
    const H = (4 + 14 * k) * Math.sin(a);
    const x = originX - Math.cos(a) * R * f;
    const y = originY + (L - originY) * f * f - 4 * H * f * (1 - f);
    bubbles.push(
      <circle
        key={`a${i}`}
        cx={x}
        cy={y}
        r={0.7 + 1.5 * k * (1 - f * 0.5)}
        fill={WAKE_GREY}
        opacity={Math.sin(Math.PI * f) * k * 0.8}
      />,
    );
  }

  for (let i = 0; i < 30; i++) {
    const f = (cycle * 1.5625 + i / 30) % 1;
    const a = ((6 + 16 * wakeRand(i + 21)) * Math.PI) / 180;
    const R = (14 + 72 * k) * (0.6 + 0.4 * wakeRand(i + 29));
    const x = originX - Math.cos(a) * R * f;
    const y =
      originY +
      (L - originY) * f * f -
      2 * (1 + 4 * k) * Math.sin(a) * f * (1 - f);
    bubbles.push(
      <circle
        key={`b${i}`}
        cx={x}
        cy={y}
        r={0.4 + 0.8 * k}
        fill={WAKE_GREY}
        opacity={Math.sin(Math.PI * f) * k * 0.6}
      />,
    );
  }

  return <g pointerEvents="none">{bubbles}</g>;
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
      <path d="M46 47.4 53 38.6h4l-7 8.8z" fill="#A8232B" stroke="none" />

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

/**
 * Top-down Princecraft used on mobile. Approved design notes:
 * - red leather: rear bench + one connected, backless front bench
 * - continuous chrome windshield arc (no centre split)
 * - closed red bow (~35% of the hull)
 * - recessed stern well with the red gas tank; no PRINCECRAFT lettering
 * - no steering wheel for now (to be redesigned)
 * - white hull, red trim (no yellow)
 * Full notes: /tmp/boat-designs/NOTES.md
 */
function TopDownBoat() {
  return (
    <svg
      viewBox="0 0 120 300"
      className="block h-full w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      {/* hull */}
      <path
        d="M 12 32 Q 5 32 5 46 C 3 114 11 200 26 244 C 35 270 49 285 60 292 C 71 285 85 270 94 244 C 109 200 117 114 115 46 Q 115 32 108 32 Z"
        fill="rgba(185,202,210,.10)"
        stroke="#fff"
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      {/* inner deck / gunwale */}
      <path
        d="M 22 44 Q 15 44 15 56 C 14 114 22 198 35 240 C 44 262 54 278 60 284 C 66 278 76 262 85 240 C 98 198 106 114 105 56 Q 105 44 98 44 Z"
        fill="rgba(255,255,255,.035)"
        stroke="#fff"
        strokeWidth={1.4}
        strokeOpacity={0.7}
      />

      {/* white + red side stripes */}
      <path d="M 19 48 C 17 114 25 198 38 240" fill="none" stroke="#A8232B" strokeWidth={3.4} strokeLinecap="round" />
      <path d="M 101 48 C 103 114 95 198 82 240" fill="none" stroke="#A8232B" strokeWidth={3.4} strokeLinecap="round" />
      <path d="M 24 48 C 22 114 30 196 42 236" fill="none" stroke="#fff" strokeWidth={1.1} strokeOpacity={0.8} />
      <path d="M 96 48 C 98 114 90 196 78 236" fill="none" stroke="#fff" strokeWidth={1.1} strokeOpacity={0.8} />

      {/* cockpit floor */}
      <path d="M 28 112 H 92 V 168 H 28 Z" fill="rgba(242,227,213,.055)" stroke="rgba(242,227,213,.14)" strokeWidth={0.8} />
      <path d="M 52 112 V 168 M 68 112 V 168" fill="none" stroke="#F2E3D5" strokeWidth={0.7} strokeOpacity={0.12} strokeDasharray="3 5" />

      {/* stern well + red gas tank */}
      <path
        d="M 30 38 Q 24 38 24 44 V 64 Q 24 70 30 70 H 90 Q 96 70 96 64 V 44 Q 96 38 90 38 Z"
        fill="rgba(0,0,0,.55)"
        stroke="rgba(255,255,255,.35)"
        strokeWidth={1}
      />
      <path d="M 32 42 H 88 V 66 H 32 Z" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={0.8} />
      <rect x="44" y="44" width="20" height="19" rx="3.5" fill="#C2373D" stroke="#F2E3D5" strokeWidth={1.1} />
      <path d="M 48 44 v3 M 60 44 v3" fill="none" stroke="#F2E3D5" strokeWidth={1} strokeOpacity={0.6} />
      <circle cx="58" cy="48" r="1.9" fill="#F2E3D5" fillOpacity={0.85} />
      <path d="M 52 44 C 48 38 45 35 45 32" fill="none" stroke="#DDE7EC" strokeWidth={0.9} strokeOpacity={0.8} />
      <path d="M 46 58 h16" fill="none" stroke="#7E161C" strokeWidth={0.9} strokeOpacity={0.6} />

      {/* rear bench */}
      <rect x="22" y="76" width="76" height="34" rx="7" fill="#B3252C" stroke="#F2E3D5" strokeWidth={1.2} />
      <rect x="25" y="79" width="70" height="10" rx="4" fill="#8C1A20" stroke="#F2E3D5" strokeWidth={0.8} strokeOpacity={0.55} />
      <path d="M 60 90 V 108" fill="none" stroke="#7E161C" strokeWidth={0.9} strokeOpacity={0.55} />
      <path d="M 28 97 h64" fill="none" stroke="#F2E3D5" strokeWidth={0.8} strokeOpacity={0.28} />

      {/* front bench: connected, no backrest */}
      <rect x="22" y="136" width="76" height="28" rx="7" fill="#B3252C" stroke="#F2E3D5" strokeWidth={1.2} />
      <path d="M 60 139 V 161" fill="none" stroke="#7E161C" strokeWidth={0.9} strokeOpacity={0.55} />
      <path d="M 28 146 h26 M 66 146 h26 M 28 153 h26 M 66 153 h26" fill="none" stroke="#F2E3D5" strokeWidth={0.8} strokeOpacity={0.28} />

      {/* windshield: one continuous arc */}
      <path
        d="M 20 188 Q 60 196 100 188 L 99 180 Q 60 188 21 180 Z"
        fill="rgba(143,163,173,.3)"
        stroke="#DDE7EC"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d="M 25 184 Q 60 191 95 184" fill="none" stroke="#fff" strokeWidth={0.8} strokeOpacity={0.4} />

      {/* closed red bow */}
      <path
        d="M 22 193 C 27 224 38 252 49 271 Q 60 283 71 271 C 82 252 93 224 98 193 Z"
        fill="#A8232B"
        stroke="#F2E3D5"
        strokeWidth={1.1}
        strokeOpacity={0.8}
        strokeLinejoin="round"
      />
      <path d="M 60 202 V 268" fill="none" stroke="#7E161C" strokeWidth={0.9} strokeOpacity={0.7} />
      <path d="M 46 212 C 51 236 56 254 60 264 C 64 254 69 236 74 212" fill="none" stroke="#F2E3D5" strokeWidth={0.8} strokeOpacity={0.3} />
      <path d="M 53 264 h14" fill="none" stroke="#DDE7EC" strokeWidth={1.7} strokeLinecap="round" />
      <path d="M 56 260.5 v7 M 64 260.5 v7" fill="none" stroke="#DDE7EC" strokeWidth={0.9} strokeOpacity={0.85} />

      {/* gunwale cleats */}
      <path d="M 12 72 h7 M 15.5 72 v3" fill="none" stroke="#fff" strokeWidth={1} strokeOpacity={0.7} strokeLinecap="round" />
      <path d="M 101 72 h7 M 104.5 72 v3" fill="none" stroke="#fff" strokeWidth={1} strokeOpacity={0.7} strokeLinecap="round" />

      {/* Evinrude outboard */}
      <path
        d="M 45 32 L 45 17 Q 45 9 53 9 L 67 9 Q 75 9 75 17 L 75 32 Z"
        fill="#171b23"
        stroke="#fff"
        strokeWidth={2.1}
        strokeLinejoin="round"
      />
      <path d="M 47 18 h26 M 47 27 h26" fill="none" stroke="#fff" strokeWidth={0.9} strokeOpacity={0.45} />
      <path d="M 60 10 v20" fill="none" stroke="#fff" strokeWidth={0.8} strokeOpacity={0.28} />
      <rect x="56" y="12.5" width="8" height="3.4" rx="1.2" fill="#A8232B" />
      <path d="M 45 24 L 36 28" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx="36" cy="28" r="2" fill="#fff" />
      <path d="M 45 32 v5 M 75 32 v5" fill="none" stroke="#fff" strokeWidth={1.2} strokeOpacity={0.6} />
    </svg>
  );
}

type WakeBubble = {
  id: string;
  kind: 'stern' | 'bow';
  size: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
};

function makeWakeBubbles(): WakeBubble[] {
  const out: WakeBubble[] = [];
  for (let i = 0; i < 12; i++) {
    const seed = 100 + i * 7;
    out.push({
      id: `s${i}`,
      kind: 'stern',
      size: 1.8 + wakeRand(seed) * 2.8,
      dx: wakeRand(seed + 1) * 52 - 26,
      dy: -(26 + wakeRand(seed + 2) * 54),
      duration: 1.1 + wakeRand(seed + 3),
      delay: -wakeRand(seed + 4) * 1.6,
    });
  }
  for (let i = 0; i < 16; i++) {
    const seed = 400 + i * 9;
    const angle = ((wakeRand(seed) * 44 - 22) * Math.PI) / 180;
    const dist = 26 + wakeRand(seed + 1) * 46;
    out.push({
      id: `b${i}`,
      kind: 'bow',
      size: 1.8 + wakeRand(seed + 2) * 2.8,
      dx: Math.sin(angle) * dist,
      dy: Math.cos(angle) * dist,
      duration: 0.85 + wakeRand(seed + 3) * 0.8,
      delay: -wakeRand(seed + 4) * 1.6,
    });
  }
  return out;
}

function MobileTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const sternWakeRef = useRef<HTMLDivElement>(null);
  const bowWakeRef = useRef<HTMLDivElement>(null);

  const [stageHeight, setStageHeight] = useState(800);
  const [activeIdx, setActiveIdx] = useState(0);
  const [shownIdx, setShownIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const activeRef = useRef(0);

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
  const railHeight = totalMonths * MOBILE_SPACING_PER_MONTH;
  const maxScroll = railHeight;

  const dotYs = useMemo(
    () =>
      cumulativeMonths.map(
        (m) => MOBILE_TOP_PAD + m * MOBILE_SPACING_PER_MONTH,
      ),
    [cumulativeMonths],
  );

  const yearTicks = useMemo(() => {
    const ticks: { year: number; top: number }[] = [];
    orderedPositions.forEach((p, i) => {
      const year = p.startDate.getFullYear();
      if (!ticks.length || ticks[ticks.length - 1].year !== year) {
        ticks.push({ year, top: dotYs[i] });
      }
    });
    return ticks;
  }, [orderedPositions, dotYs]);

  const [bubbles, setBubbles] = useState<WakeBubble[]>([]);

  useEffect(() => {
    setBubbles(makeWakeBubbles());
  }, []);

  useEffect(() => {
    const update = () => setStageHeight(window.innerHeight);
    update();

    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (activeIdx === shownIdx) return;

    setFading(true);
    const timer = setTimeout(() => {
      setShownIdx(activeIdx);
      setFading(false);
    }, 130);
    return () => clearTimeout(timer);
  }, [activeIdx, shownIdx]);

  useEffect(() => {
    if (dateRef.current) {
      dateRef.current.textContent = formatDate(orderedPositions[0].startDate);
    }
  }, [orderedPositions]);

  useEffect(() => {
    let raf = 0;
    let lastScrollY = window.scrollY;
    let lastScrollAt = 0;
    let targetWake = 0;
    let wakeOpacity = 0;

    const tick = (now: number) => {
      const section = sectionRef.current;
      const stage = stageRef.current;

      if (section && stage) {
        const currentStageHeight = stage.clientHeight || stageHeight;
        const rect = section.getBoundingClientRect();
        const scrolled = Math.max(0, Math.min(maxScroll, -rect.top));
        const progress = maxScroll > 0 ? scrolled / maxScroll : 0;
        const zoom = 1 + (MOBILE_BOAT_ZOOM - 1) * progress;
        const boatY = Math.round(
          currentStageHeight * 0.5 +
            (progress - 0.5) * currentStageHeight * MOBILE_BOAT_DRIFT,
        );

        if (timelineRef.current) {
          timelineRef.current.style.top = `${boatY - MOBILE_TOP_PAD}px`;
          timelineRef.current.style.transform = `translateY(${-scrolled}px) scale(${zoom})`;
          timelineRef.current.style.transformOrigin = `${MOBILE_RAIL_X}px ${MOBILE_TOP_PAD + scrolled}px`;
        }
        if (boatRef.current) boatRef.current.style.top = `${boatY}px`;
        if (cardRef.current) cardRef.current.style.top = `${boatY}px`;

        let nearest = 0;
        let nearestDist = Number.POSITIVE_INFINITY;
        for (let i = 0; i < dotYs.length; i++) {
          const distance = Math.abs(dotYs[i] - (MOBILE_TOP_PAD + scrolled));
          if (distance < nearestDist) {
            nearestDist = distance;
            nearest = i;
          }
        }

        if (nearest !== activeRef.current) {
          activeRef.current = nearest;
          setActiveIdx(nearest);
        }

        if (dateRef.current) {
          const date =
            nearestDist < 5
              ? orderedPositions[nearest].startDate
              : addMonths(
                  orderedPositions[0].startDate,
                  -scrolled / MOBILE_SPACING_PER_MONTH,
                );
          const text = formatDate(date);
          if (dateRef.current.textContent !== text) {
            dateRef.current.textContent = text;
          }
        }

        const scrollY = window.scrollY;
        const delta = Math.abs(scrollY - lastScrollY);
        lastScrollY = scrollY;
        if (delta > 0.4) {
          targetWake = Math.min(1, 0.35 + delta / 30);
          lastScrollAt = now;
        }
      }

      if (now - lastScrollAt > 120) {
        targetWake = Math.max(0, targetWake - 0.012);
      }
      wakeOpacity += (targetWake - wakeOpacity) * 0.08;
      if (wakeOpacity < 0.008) wakeOpacity = 0;
      if (sternWakeRef.current) {
        sternWakeRef.current.style.opacity = `${wakeOpacity}`;
      }
      if (bowWakeRef.current) {
        bowWakeRef.current.style.opacity = `${wakeOpacity}`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dotYs, maxScroll, orderedPositions, stageHeight]);

  const shown = orderedPositions[shownIdx];
  const wakeStyle = (bubble: WakeBubble) =>
    ({
      width: bubble.size,
      height: bubble.size,
      left: -bubble.size / 2,
      top: -bubble.size / 2,
      '--dx': `${bubble.dx}px`,
      '--dy': `${bubble.dy}px`,
      animationDuration: `${bubble.duration}s`,
      animationDelay: `${bubble.delay}s`,
    }) as CSSProperties;

  return (
    <div
      ref={sectionRef}
      className="relative w-full"
      style={{ height: maxScroll + stageHeight }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 overflow-hidden"
        style={{ height: stageHeight, background: '#0C0D14' }}
      >
        <div
          className="relative mx-auto h-full w-full"
          style={{ maxWidth: 430 }}
        >
          <div
            className="pointer-events-none absolute z-[1]"
            style={{
              top: 16,
              right: 12,
              fontFamily: FONT_FAMILY,
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              color: '#fff',
              opacity: 0.04,
            }}
          >
            {orderedPositions[activeIdx].startDate.getFullYear()}
          </div>

          <div
            ref={timelineRef}
            className="absolute inset-x-0 z-[2] will-change-transform"
            style={{
              top: stageHeight * 0.5 - MOBILE_TOP_PAD,
              height: MOBILE_TOP_PAD + railHeight + MOBILE_BOTTOM_PAD,
            }}
          >
            <div
              className="absolute"
              style={{
                left: MOBILE_RAIL_X,
                top: MOBILE_TOP_PAD,
                height: railHeight + 34,
                borderLeft: '1.5px dashed rgba(255,255,255,0.78)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: MOBILE_RAIL_X - 6,
                top: MOBILE_TOP_PAD,
                width: 13,
                height: 1.5,
                background: '#fff',
              }}
            />
            <div
              className="absolute"
              style={{
                left: MOBILE_RAIL_X - 6,
                top: MOBILE_TOP_PAD + railHeight,
                width: 13,
                height: 1.5,
                background: '#fff',
              }}
            />

            {yearTicks.map((tick) => (
              <div
                key={tick.year}
                className="absolute"
                style={{
                  left: 6,
                  width: 34,
                  top: tick.top,
                  transform: 'translateY(-50%)',
                  textAlign: 'right',
                  fontFamily: FONT_FAMILY,
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {tick.year}
                <span
                  className="absolute"
                  style={{
                    right: -12,
                    top: '50%',
                    width: 5,
                    height: 1,
                    background: 'rgba(255,255,255,0.25)',
                  }}
                />
              </div>
            ))}

            {orderedPositions.map((p, i) => (
              <div
                key={`dot-${p.company}-${p.title}`}
                data-position-dot={i}
                className="absolute"
                style={{
                  left: MOBILE_RAIL_X,
                  top: dotYs[i],
                  width: 14,
                  height: 14,
                  marginLeft: -7,
                  marginTop: -7,
                  borderRadius: '50%',
                  background: '#0C0D14',
                  border: '1.5px solid #fff',
                }}
              />
            ))}

            {orderedPositions.map((p, i) => (
              <div
                key={`tag-${p.company}-${p.title}`}
                className="absolute flex items-baseline whitespace-nowrap"
                style={{
                  left: 108,
                  top: dotYs[i],
                  transform: 'translateY(-50%)',
                  gap: 6,
                  opacity: 0.42,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {p.company}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.06em',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {p.startDate.getFullYear()}
                </span>
              </div>
            ))}
          </div>

          <div
            ref={cardRef}
            data-position-card
            className="absolute z-[6] -translate-y-1/2"
            style={{
              left: 108,
              right: 16,
              top: stageHeight * 0.5,
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 16,
              background: '#0E1018',
              boxShadow: '0 18px 46px rgba(0,0,0,0.55)',
              padding: '13px 16px 15px',
            }}
          >
            <span
              className="absolute"
              style={{
                left: -7,
                top: '50%',
                width: 12,
                height: 12,
                transform: 'translateY(-50%) rotate(45deg)',
                background: '#0E1018',
                borderLeft: '1px solid rgba(255,255,255,0.12)',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 2,
              }}
            />
            <div
              style={{
                opacity: fading ? 0 : 1,
                transition: 'opacity 160ms ease-out',
              }}
            >
              <div
                className="flex items-center justify-between"
                style={{ gap: 10, marginBottom: 4 }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: FONT_FAMILY,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#E8B93B',
                  }}
                >
                  {shown.company}
                </p>
                <span
                  ref={dateRef}
                  style={{
                    flex: 'none',
                    fontFamily: FONT_FAMILY,
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.72)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 999,
                    padding: '3px 7px',
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                  }}
                />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontFamily: FONT_FAMILY,
                  fontSize: 17,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  color: '#fff',
                }}
              >
                {nb(shown.title)}
              </h3>
              <p
                style={{
                  margin: '3px 0 0',
                  fontSize: 9.5,
                  letterSpacing: '0.05em',
                  color: 'rgba(255,255,255,0.42)',
                }}
              >
                {formatDate(shown.startDate)}
                {shownIdx === 0 ? ' · Present' : ''}
              </p>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 11,
                  lineHeight: 1.55,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {shown.description}
              </p>
            </div>
          </div>

          <div
            ref={boatRef}
            data-position-boat
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: MOBILE_RAIL_X, top: stageHeight * 0.5 }}
          >
            <div
              className="boat-bob relative"
              style={{
                width: MOBILE_BOAT_WIDTH,
                height: MOBILE_BOAT_HEIGHT,
              }}
            >
              <div
                ref={sternWakeRef}
                className="pointer-events-none absolute left-1/2 h-0 w-0 opacity-0"
                style={{ top: '12%' }}
              >
                {bubbles
                  .filter((bubble) => bubble.kind === 'stern')
                  .map((bubble) => (
                    <span
                      key={bubble.id}
                      className="mobile-wake-bubble"
                      style={wakeStyle(bubble)}
                    />
                  ))}
              </div>
              <div
                ref={bowWakeRef}
                className="mobile-wake-bow pointer-events-none absolute left-1/2 h-0 w-0 opacity-0"
                style={{ top: '92%' }}
              >
                {bubbles
                  .filter((bubble) => bubble.kind === 'bow')
                  .map((bubble) => (
                    <span
                      key={bubble.id}
                      className="mobile-wake-bubble"
                      style={wakeStyle(bubble)}
                    />
                  ))}
              </div>
              <TopDownBoat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [spacingPerMonth, setSpacingPerMonth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(600);
  const [boatScale, setBoatScale] = useState(1);
  const [yearTop, setYearTop] = useState<number | null>(null);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [wakeScale, setWakeScale] = useState(0);
  const [wakePhase, setWakePhase] = useState(0);
  const [dateText, setDateText] = useState('');
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeRef = useRef(0);
  const [focus, setFocus] = useState(0);
  const focusRef = useRef(0);
  const shownRef = useRef(0);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wantRef = useRef<number | null>(null);
  const setFocusBoth = (v: number) => {
    focusRef.current = v;
    setFocus(v);
  };
  const [vizScale, setVizScale] = useState(1);
  const [vizScrollX, setVizScrollX] = useState(0);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const currentTiltRef = useRef(0);
  const currentWakeRef = useRef(0);
  const wakeTargetRef = useRef(0);
  const animFrameRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const ww = window.innerWidth;
      setWindowWidth(ww);
      setSpacingPerMonth(ww / 36);
      setBoatScale(
        Math.min(1.8, Math.max(1, Math.min(ww / 1440, window.innerHeight / 800))),
      );
      const footer = document.getElementById('desktop-footer');
      const section = sectionRef.current;
      if (footer && section) {
        const offset =
          footer.getBoundingClientRect().top - section.getBoundingClientRect().top;
        setYearTop(offset - 30 * Math.min(1.8, Math.max(1, Math.min(ww / 1440, window.innerHeight / 800))));
      }
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
  const gapWidth = windowWidth / 8;
  const bs = boatScale;
  const boatLeft = BOAT_LEFT_PAD * bs;
  const boatW = BOAT_WIDTH * bs;
  const boatH = BOAT_HEIGHT * bs;
  const hullB = BOAT_HULL_BOTTOM * bs;
  const boatAndGapWidth = boatLeft + boatW + gapWidth;
  // End the line where the pinned boat can reach the last dot, rather than
  // overshooting into a long empty runway.
  const timelineWidth =
    totalMonths * spacingPerMonth +
    Math.max(160, windowWidth - boatLeft - boatW / 2);

  const svgHeight = 380;
  const lineY = 220;
  const boatTop = lineY - hullB - 8 * bs;

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
      const targetTilt = -Math.min(velocityRef.current * 1.5, MAX_TILT_DEG);
      const REEMERGE = 0.15;
      currentTiltRef.current += (targetTilt - currentTiltRef.current) * REEMERGE;
      // Target follows scroll speed; small slow scrolls barely register.
      wakeTargetRef.current = Math.min(1, Math.max(0, (dScroll - 2) / 30));
    }

    const scrolledFromBoat = Math.max(0, -sectionRect.left);
    setVizScrollX(scrolledFromBoat);
    setVizScale(Math.min(1.3, Math.max(1, 1 + scrolledFromBoat / 1000)));

    // The dot aligns with the boat's centre, so the current date should be
    // read at the centre too (not at the boat's left edge).
    const boatCenter = boatLeft + boatW / 2 - sectionRect.left;
    const progress = Math.max(0, Math.min(1, (boatCenter - boatAndGapWidth) / (totalMonths * spacingPerMonth || 1)));

    const newestDate = orderedPositions[0].startDate;
    const oldestDate = orderedPositions[orderedPositions.length - 1].startDate;
    const dateRange = oldestDate.getTime() - newestDate.getTime();
    const currentDate = new Date(newestDate.getTime() + dateRange * progress);
    setDateText(formatDate(currentDate));
    // Each position's zone: on each side, the larger of a fixed minimum and
    // 40% of the distance to the neighbouring position on that side.
    const dotXs = cumulativeMonths.map((m) => boatAndGapWidth + m * spacingPerMonth);
    const offsetOf = (i: number) => boatCenter - dotXs[i];

    // Snap the date when the boat is centred on a dot so the label agrees
    // with the position even when sub-pixel alignment rounds a month.
    let nearestIdx: number | null = null;
    let nearestDist = Infinity;
    dotXs.forEach((x, i) => {
      const d = Math.abs(boatCenter - x);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    });
    if (nearestIdx !== null && nearestDist < 2 * bs) {
      setDateText(formatDate(orderedPositions[nearestIdx].startDate));
    }
    const inZone = (i: number) => {
      const d = offsetOf(i);
      const before = Math.max(
        60 * bs,
        i > 0 ? 0.4 * (dotXs[i] - dotXs[i - 1]) : 0,
      );
      const after = Math.max(
        100 * bs,
        i < dotXs.length - 1 ? 0.4 * (dotXs[i + 1] - dotXs[i]) : 0,
      );
      return d > -before && d < after;
    };

    // Work out which position should be shown. Keep the current one while the
    // boat is still in its zone; otherwise take the nearest zone it's in.
    let want: number | null = null;
    if (inZone(activeRef.current)) {
      want = activeRef.current;
    } else {
      let foundDist = Infinity;
      cumulativeMonths.forEach((_, i) => {
        if (inZone(i) && Math.abs(offsetOf(i)) < foundDist) {
          foundDist = Math.abs(offsetOf(i));
          want = i;
        }
      });
    }

    wantRef.current = want;
    if (want === null) {
      setFocusBoth(0);
      return;
    }
    activeRef.current = want;

    if (shownRef.current === want) {
      setFocusBoth(1);
    } else if (focusRef.current === 0) {
      // nothing showing: switch text and fade in
      shownRef.current = want;
      setActiveIdx(want);
      setFocusBoth(1);
    } else if (swapTimerRef.current === null) {
      // changing positions while showing: fade out, swap text, fade back in
      setFocusBoth(0);
      swapTimerRef.current = setTimeout(() => {
        swapTimerRef.current = null;
        if (wantRef.current !== null) {
          shownRef.current = activeRef.current;
          setActiveIdx(activeRef.current);
          setFocusBoth(1);
        }
      }, 240);
    }
  }, [boatAndGapWidth, spacingPerMonth, totalMonths, cumulativeMonths, boatLeft, boatW, bs, orderedPositions]);

  useEffect(() => {
    handleScroll();
    return () => {
      if (swapTimerRef.current !== null) clearTimeout(swapTimerRef.current);
    };
  }, [handleScroll]);

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
      // ease toward the scroll-driven target, slowly, in both directions
      wakeTargetRef.current *= 0.95;
      currentWakeRef.current += (wakeTargetRef.current - currentWakeRef.current) * 0.06;

      if (Math.abs(currentTiltRef.current) < 0.01) currentTiltRef.current = 0;
      if (Math.abs(currentWakeRef.current) < 0.005) {
        currentWakeRef.current = 0;
      }

      setTiltAngle(currentTiltRef.current);
      setWakeScale(currentWakeRef.current);
      if (currentWakeRef.current > 0.01) {
        setWakePhase((phase) => phase + 0.16);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const totalWidth = boatAndGapWidth + timelineWidth;

  const yearTicks: { year: number; x: number }[] = [];
  if (positions.length > 0) {
    const newest = positions[0].startDate;
    const oldestYear = positions[positions.length - 1].startDate.getFullYear();
    for (let y = newest.getFullYear(); y >= oldestYear; y--) {
      const m = monthsBetween(newest, new Date(y, 0, 1));
      yearTicks.push({ year: y, x: boatAndGapWidth + m * spacingPerMonth });
    }
  }
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
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: totalWidth,
          height: svgHeight,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: totalWidth,
            height: svgHeight,
            transform: `scale(${vizScale})`,
            transformOrigin: `${vizScrollX + boatLeft}px ${svgHeight}px`,
          }}
        >
      <svg
        width={totalWidth}
        height={svgHeight}
        className="overflow-visible"
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
      >
        <line
          x1={boatLeft}
          y1={lineY - markerSize}
          x2={boatLeft}
          y2={lineY + markerSize}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
        <line
          x1={boatLeft - markerSize}
          y1={lineY}
          x2={boatLeft + markerSize}
          y2={lineY}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />

        <line
          x1={boatLeft}
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
              <foreignObject x={endX - 112} y={endY + 4} width={LABEL_WIDTH} height={44}>
                <div {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as any)} style={{ color: 'white', fontSize: 18, fontFamily: FONT_FAMILY, textAlign: 'center', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 700, textDecoration: 'underline'}}>{orderedPositions[i].company}</div>
                  <div>{orderedPositions[i].title}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
        </div>
      </div>

      {yearTicks.map((tick) => (
        <div
          key={tick.year}
          style={{
            position: 'absolute',
            left:
              vizScrollX +
              boatLeft +
              (tick.x - (vizScrollX + boatLeft)) * vizScale,
            top: (yearTop ?? svgHeight - 36) - 34 * bs,
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: 14 * bs,
            lineHeight: 1.2,
            fontFamily: FONT_FAMILY,
            opacity: 0.85,
            whiteSpace: 'nowrap',
          }}
        >
          {tick.year}
        </div>
      ))}

      <div
        className="sticky top-0 left-0 z-20"
        style={{ width: boatAndGapWidth, height: svgHeight }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transform: `scale(${vizScale})`,
            transformOrigin: `${boatLeft}px ${svgHeight}px`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: boatLeft,
              top: boatTop - 34 * bs,
              transform: 'translateY(-100%)',
              width: 380 * bs,
              color: 'white',
              fontFamily: FONT_FAMILY,
              lineHeight: 1.4,
              pointerEvents: 'none',
              opacity: focus,
              transition: 'opacity 0.22s ease-out',
            }}
          >
            <div style={{ fontSize: 20 * bs, fontWeight: 700 }}>
              {positions[activeIdx].company} · {positions[activeIdx].title}
            </div>
            <div style={{ fontSize: 16 * bs, opacity: 0.85, marginTop: 4 * bs }}>
              {positions[activeIdx].description}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: boatTop - 20 * bs,
              left: boatLeft,
              width: boatW,
              fontSize: 14 * bs,
              textAlign: 'left',
              color: 'white',
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
                // local space: origin at the boat's top-left, scaled by bs
                const waterlineY = BOAT_HULL_BOTTOM;
                const disp = wakeScale;
                const phase = wakePhase;
                const sternX = 3.5;
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

                els.push(
                  <BowWake
                    key="bow"
                    scale={wakeScale}
                    phase={wakePhase}
                    lineY={BOAT_HULL_BOTTOM + 8}
                  />,
                );

                return (
                  <g transform={`translate(${boatLeft} ${boatTop}) scale(${bs})`}>
                    {els}
                  </g>
                );
              })()}
            </svg>
          )}

          <div
            className="boat-bob"
            style={{
              position: 'absolute',
              top: boatTop,
              left: boatLeft,
              width: boatW,
              height: boatH,
              transformOrigin: `${80 * bs}px ${44 * bs}px`,
            }}
          >
            <svg
              width={boatW}
              height={boatH}
              viewBox="0 0 166 59"
              className="overflow-visible"
              style={{
                display: 'block',
                transform: `rotate(${tiltAngle}deg)`,
                transformOrigin: `0px ${hullB}px`,
              }}
            >
              <PrincecraftBoat />
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
