import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Navbar from "../components/Navbar";

type BlockType = "air" | "grass" | "dirt" | "stone" | "wood" | "leaves";

const BLOCK_COLORS: Record<BlockType, string> = {
  air: "transparent",
  grass: "#5a8f3a",
  dirt: "#7a5230",
  stone: "#8a8a8a",
  wood: "#8b5a2b",
  leaves: "#3f7f2f",
};

const BLOCKS: BlockType[] = ["grass", "dirt", "stone", "wood", "leaves"];

const TILE = 32;
const WORLD_W = 120;
const WORLD_H = 40;
const GRAVITY = 0.6;
const MOVE_SPEED = 4;
const JUMP = 11;

interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  onGround: boolean;
}

const MinecraftPage: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldRef = useRef<BlockType[][]>([]);
  const playerRef = useRef<Player>({
    x: 60 * TILE,
    y: 10 * TILE,
    vx: 0,
    vy: 0,
    w: 24,
    h: 48,
    onGround: false,
  });
  const keysRef = useRef<Record<string, boolean>>({});
  const cameraRef = useRef({ x: 0, y: 0 });
  const selectedRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, down: false, right: false });
  const [selected, setSelected] = useState(0);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    // generate world
    const world: BlockType[][] = Array.from({ length: WORLD_H }, () =>
      Array(WORLD_W).fill("air"),
    );
    const heights: number[] = [];
    for (let x = 0; x < WORLD_W; x++) {
      const h = Math.floor(
        18 +
          Math.sin(x * 0.15) * 3 +
          Math.sin(x * 0.05) * 2 +
          Math.cos(x * 0.3) * 1.5,
      );
      heights.push(h);
      for (let y = h; y < WORLD_H; y++) {
        if (y === h) world[y][x] = "grass";
        else if (y < h + 4) world[y][x] = "dirt";
        else world[y][x] = "stone";
      }
      // trees
      if (Math.random() < 0.08 && h > 8) {
        const th = 3 + Math.floor(Math.random() * 3);
        for (let t = 1; t <= th; t++) {
          if (h - t >= 0) world[h - t][x] = "wood";
        }
        for (let ly = h - th - 2; ly <= h - th; ly++) {
          for (let lx = x - 2; lx <= x + 2; lx++) {
            if (
              ly >= 0 &&
              lx >= 0 &&
              lx < WORLD_W &&
              world[ly][lx] === "air"
            ) {
              world[ly][lx] = "leaves";
            }
          }
        }
      }
    }
    // bedrock-ish bottom
    for (let x = 0; x < WORLD_W; x++) {
      world[WORLD_H - 1][x] = "stone";
    }
    worldRef.current = world;

    // place player above surface
    const sx = 60;
    const sy = heights[sx] - 4;
    playerRef.current.x = sx * TILE;
    playerRef.current.y = sy * TILE;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let accFps = 0;
    let frames = 0;

    const isSolid = (bx: number, by: number) => {
      if (bx < 0 || by < 0 || bx >= WORLD_W || by >= WORLD_H) return true;
      return worldRef.current[by][bx] !== "air";
    };

    const update = (dt: number) => {
      const p = playerRef.current;
      const keys = keysRef.current;
      // input
      let move = 0;
      if (keys["a"] || keys["ArrowLeft"]) move -= 1;
      if (keys["d"] || keys["ArrowRight"]) move += 1;
      p.vx = move * MOVE_SPEED;
      if ((keys[" "] || keys["w"] || keys["ArrowUp"]) && p.onGround) {
        p.vy = -JUMP;
        p.onGround = false;
      }
      // gravity
      p.vy += GRAVITY;
      if (p.vy > 20) p.vy = 20;

      // horizontal collision
      p.x += p.vx;
      let left = Math.floor(p.x / TILE);
      let right = Math.floor((p.x + p.w - 1) / TILE);
      let top = Math.floor(p.y / TILE);
      let bottom = Math.floor((p.y + p.h - 1) / TILE);
      if (p.vx > 0) {
        if (isSolid(right, top) || isSolid(right, bottom)) {
          p.x = right * TILE - p.w;
          p.vx = 0;
        }
      } else if (p.vx < 0) {
        if (isSolid(left, top) || isSolid(left, bottom)) {
          p.x = (left + 1) * TILE;
          p.vx = 0;
        }
      }

      // vertical collision
      p.y += p.vy;
      left = Math.floor(p.x / TILE);
      right = Math.floor((p.x + p.w - 1) / TILE);
      top = Math.floor(p.y / TILE);
      bottom = Math.floor((p.y + p.h - 1) / TILE);
      p.onGround = false;
      if (p.vy > 0) {
        if (isSolid(left, bottom) || isSolid(right, bottom)) {
          p.y = bottom * TILE - p.h;
          p.vy = 0;
          p.onGround = true;
        }
      } else if (p.vy < 0) {
        if (isSolid(left, top) || isSolid(right, top)) {
          p.y = (top + 1) * TILE;
          p.vy = 0;
        }
      }

      // world bounds
      if (p.x < 0) p.x = 0;
      if (p.x > (WORLD_W - 1) * TILE) p.x = (WORLD_W - 1) * TILE;
      if (p.y > (WORLD_H - 1) * TILE) {
        // respawn
        p.x = 60 * TILE;
        p.y = 10 * TILE;
        p.vx = 0;
        p.vy = 0;
      }

      // camera
      const cam = cameraRef.current;
      const targetCamX = p.x - canvas.width / 2 + p.w / 2;
      cam.x += (targetCamX - cam.x) * 0.1;
      if (cam.x < 0) cam.x = 0;
      if (cam.x > WORLD_W * TILE - canvas.width) cam.x = WORLD_W * TILE - canvas.width;
      const targetCamY = p.y - canvas.height / 2 + p.h / 2;
      cam.y += (targetCamY - cam.y) * 0.1;
      if (cam.y < 0) cam.y = 0;
      if (cam.y > WORLD_H * TILE - canvas.height) cam.y = WORLD_H * TILE - canvas.height;
    };

    const render = () => {
      const world = worldRef.current;
      const p = playerRef.current;
      const cam = cameraRef.current;
      ctx.fillStyle = "#87ceeb";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // sun
      ctx.fillStyle = "#fff7a8";
      ctx.beginPath();
      ctx.arc(canvas.width - 80, 60, 30, 0, Math.PI * 2);
      ctx.fill();

      const startCol = Math.floor(cam.x / TILE);
      const endCol = Math.ceil((cam.x + canvas.width) / TILE);
      const startRow = Math.floor(cam.y / TILE);
      const endRow = Math.ceil((cam.y + canvas.height) / TILE);

      for (let y = startRow; y <= endRow; y++) {
        if (y < 0 || y >= WORLD_H) continue;
        for (let x = startCol; x <= endCol; x++) {
          if (x < 0 || x >= WORLD_W) continue;
          const b = world[y][x];
          if (b === "air") continue;
          ctx.fillStyle = BLOCK_COLORS[b];
          ctx.fillRect(
            x * TILE - cam.x,
            y * TILE - cam.y,
            TILE,
            TILE,
          );
          // outline
          ctx.strokeStyle = "rgba(0,0,0,0.15)";
          ctx.strokeRect(x * TILE - cam.x, y * TILE - cam.y, TILE, TILE);
          // grass top highlight
          if (b === "grass") {
            ctx.fillStyle = "#7cb342";
            ctx.fillRect(x * TILE - cam.x, y * TILE - cam.y, TILE, 6);
          }
        }
      }

      // player
      ctx.fillStyle = "#e53935";
      ctx.fillRect(p.x - cam.x, p.y - cam.y, p.w, p.h);
      ctx.fillStyle = "#ffcc80";
      ctx.fillRect(p.x - cam.x + 4, p.y - cam.y + 4, p.w - 8, 12);
      // eyes
      ctx.fillStyle = "#000";
      ctx.fillRect(p.x - cam.x + 6, p.y - cam.y + 8, 3, 3);
      ctx.fillRect(p.x - cam.x + 15, p.y - cam.y + 8, 3, 3);

      // highlight hovered block
      const mx = mouseRef.current.x + cam.x;
      const my = mouseRef.current.y + cam.y;
      const hbX = Math.floor(mx / TILE);
      const hbY = Math.floor(my / TILE);
      if (hbX >= 0 && hbY >= 0 && hbX < WORLD_W && hbY < WORLD_H) {
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(hbX * TILE - cam.x, hbY * TILE - cam.y, TILE, TILE);
        ctx.lineWidth = 1;
      }

      // hotbar
      const hbY0 = canvas.height - 48;
      for (let i = 0; i < BLOCKS.length; i++) {
        const bx = canvas.width / 2 - (BLOCKS.length * 40) / 2 + i * 40;
        ctx.fillStyle = i === selectedRef.current ? "#fff" : "rgba(0,0,0,0.5)";
        ctx.fillRect(bx, hbY0, 36, 36);
        ctx.fillStyle = BLOCK_COLORS[BLOCKS[i]];
        ctx.fillRect(bx + 4, hbY0 + 4, 28, 28);
        ctx.fillStyle = "#000";
        ctx.font = "12px monospace";
        ctx.fillText(String(i + 1), bx + 2, hbY0 - 2);
      }

      // instructions
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(8, 8, 360, 60);
      ctx.fillStyle = "#fff";
      ctx.font = "12px monospace";
      ctx.fillText("A/D move  Space jump  1-5 select block", 16, 26);
      ctx.fillText("Left click break  Right click place", 16, 44);
      ctx.fillText(`Selected: ${BLOCKS[selectedRef.current]}`, 16, 62);
    };

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current.x = (e.clientX - rect.left) * scaleX;
      mouseRef.current.y = (e.clientY - rect.top) * scaleY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      const cam = cameraRef.current;
      const mx = mouseRef.current.x + cam.x;
      const my = mouseRef.current.y + cam.y;
      const bx = Math.floor(mx / TILE);
      const by = Math.floor(my / TILE);
      if (bx < 0 || by < 0 || bx >= WORLD_W || by >= WORLD_H) return;
      if (e.button === 0) {
        // break
        worldRef.current[by][bx] = "air";
      } else if (e.button === 2) {
        // place if not overlapping player
        const p = playerRef.current;
        const blockLeft = bx * TILE;
        const blockRight = blockLeft + TILE;
        const blockTop = by * TILE;
        const blockBottom = blockTop + TILE;
        const overlap =
          p.x < blockRight &&
          p.x + p.w > blockLeft &&
          p.y < blockBottom &&
          p.y + p.h > blockTop;
        if (!overlap && worldRef.current[by][bx] === "air") {
          worldRef.current[by][bx] = BLOCKS[selectedRef.current];
        }
      }
    };

    const handleContext = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key >= "1" && e.key <= "5") {
        const idx = parseInt(e.key) - 1;
        selectedRef.current = idx;
        setSelected(idx);
      }
      if (e.key === " " || e.key.startsWith("Arrow")) e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight - 48;
    };
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("contextmenu", handleContext);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      frames++;
      accFps += dt;
      if (accFps >= 1000) {
        setFps(Math.round((frames * 1000) / accFps));
        frames = 0;
        accFps = 0;
      }
      update(dt / 16.67);
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("contextmenu", handleContext);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <Navbar />
      <div className="relative w-full" style={{ height: "calc(100vh - 48px)" }}>
        <canvas ref={canvasRef} className="block w-full h-full" />
        <div className="absolute top-2 right-2 text-white text-xs font-mono bg-black/50 px-2 py-1 rounded">
          FPS {fps}
        </div>
      </div>
    </div>
  );
};

export default MinecraftPage;