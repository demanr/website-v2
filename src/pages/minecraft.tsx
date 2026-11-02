import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { NextPage } from "next";
import Link from "next/link";

const WORLD_SIZE = 48;
const TILE = 1;

const MinecraftPage: NextPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [locked, setLocked] = useState(false);
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;
    console.log("minecraft effect start");

    (async () => {
      console.log("minecraft async start");
      const THREE = await import("three");
      console.log("three imported", !!THREE);
      if (cancelled) return;
      const container = containerRef.current;
      if (!container) return;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87ceeb);
      scene.fog = new THREE.Fog(0x87ceeb, 40, 120);

      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        200,
      );
      camera.position.set(0, 10, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const sun = new THREE.DirectionalLight(0xffffff, 0.9);
      sun.position.set(50, 80, 30);
      scene.add(sun);

      // Terrain heightmap
      const heightAt = (x: number, z: number) => {
        return (
          4 +
          Math.floor(Math.sin(x * 0.25) * 2 + Math.cos(z * 0.2) * 2 + Math.sin((x + z) * 0.1) * 1.5)
        );
      };

      // Build voxel terrain with instanced meshes per block type
      const blockTypes = [
        { name: "grass", color: 0x5a8f3a, yLevel: (h: number, y: number) => y === h },
        { name: "dirt", color: 0x7a5230, yLevel: (h: number, y: number) => y < h && y >= h - 3 },
        { name: "stone", color: 0x8a8a8a, yLevel: (h: number, y: number) => y < h - 3 },
      ];

      const instances: any[] = [];
      const geometry = new THREE.BoxGeometry(1, 1, 1);

      for (const bt of blockTypes) {
        const material = new THREE.MeshLambertMaterial({ color: bt.color });
        const matrices: any[] = [];
        for (let x = -WORLD_SIZE / 2; x < WORLD_SIZE / 2; x++) {
          for (let z = -WORLD_SIZE / 2; z < WORLD_SIZE / 2; z++) {
            const h = heightAt(x, z);
            for (let y = 0; y <= h; y++) {
              if (!bt.yLevel(h, y)) continue;
              const m = new THREE.Matrix4();
              m.setPosition(x + 0.5, y + 0.5, z + 0.5);
              matrices.push(m);
            }
          }
        }
        const mesh = new THREE.InstancedMesh(geometry, material, matrices.length);
        matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
        mesh.instanceMatrix.needsUpdate = true;
        scene.add(mesh);
        instances.push({ mesh, matrices });
      }

      // Trees (simple)
      const trunkGeo = new THREE.BoxGeometry(0.6, 4, 0.6);
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
      const leavesGeo = new THREE.BoxGeometry(3, 2, 3);
      const leavesMat = new THREE.MeshLambertMaterial({ color: 0x3f7f2f });
      for (let i = 0; i < 40; i++) {
        const x = Math.floor(Math.random() * WORLD_SIZE) - WORLD_SIZE / 2;
        const z = Math.floor(Math.random() * WORLD_SIZE) - WORLD_SIZE / 2;
        const h = heightAt(x, z);
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(x + 0.5, h + 2, z + 0.5);
        scene.add(trunk);
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.set(x + 0.5, h + 4.5, z + 0.5);
        scene.add(leaves);
      }

      // Stations (portfolio content markers)
      const stationDefs: { id: string; title: string; pos: [number, number, number]; color: number }[] = [
        { id: "about", title: "About", pos: [6, 0, 6], color: 0xffd700 },
        { id: "projects", title: "Projects", pos: [-8, 0, 4], color: 0x42a5f5 },
        { id: "photography", title: "Photography", pos: [4, 0, -10], color: 0xab47bc },
        { id: "contact", title: "Contact", pos: [-6, 0, -8], color: 0x66bb6a },
      ];

      const stations: { id: string; title: string; position: any }[] = [];
      for (const s of stationDefs) {
        const h = heightAt(s.pos[0], s.pos[2]);
        const pos = new THREE.Vector3(s.pos[0] + 0.5, h + 1.5, s.pos[2] + 0.5);
        const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        const mat = new THREE.MeshLambertMaterial({ color: s.color, emissive: s.color, emissiveIntensity: 0.4 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        scene.add(mesh);
        // floating label via sprite? skip; HTML handles
        stations.push({ id: s.id, title: s.title, position: pos });
      }

      // Player state
      const player = {
        position: new THREE.Vector3(0, heightAt(0, 0) + 2, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        yaw: 0,
        pitch: 0,
        onGround: false,
      };
      camera.position.copy(player.position);

      const keys = new Set<string>();
      const onKeyDown = (e: KeyboardEvent) => keys.add(e.code);
      const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      // Pointer lock
      const onPointerLockChange = () => {
        setLocked(document.pointerLockElement === renderer.domElement);
      };
      document.addEventListener("pointerlockchange", onPointerLockChange);
      const onMouseMove = (e: MouseEvent) => {
        if (document.pointerLockElement !== renderer.domElement) return;
        player.yaw -= e.movementX * 0.002;
        player.pitch -= e.movementY * 0.002;
        player.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, player.pitch));
      };
      document.addEventListener("mousemove", onMouseMove);
      renderer.domElement.addEventListener("click", () => {
        if (document.pointerLockElement !== renderer.domElement) {
          renderer.domElement.requestPointerLock();
        }
      });

      const EYE = 1.7;
      const SPEED = 6;
      const JUMP = 7;
      const GRAVITY = 18;

      let last = performance.now();
      let raf = 0;
      const tmpForward = new THREE.Vector3();
      const tmpRight = new THREE.Vector3();

      const animate = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;

        // input direction
        const forward = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
        // note: camera looks along -Z in local space; adjust
        const right = new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw));

        const move = new THREE.Vector3(0, 0, 0);
        if (keys.has("KeyW")) move.add(forward);
        if (keys.has("KeyS")) move.sub(forward);
        if (keys.has("KeyA")) move.sub(right);
        if (keys.has("KeyD")) move.add(right);
        if (move.lengthSq() > 0) move.normalize().multiplyScalar(SPEED * dt);

        player.position.x += move.x;
        player.position.z += move.z;

        // world bounds
        const half = WORLD_SIZE / 2 - 1;
        player.position.x = Math.max(-half, Math.min(half, player.position.x));
        player.position.z = Math.max(-half, Math.min(half, player.position.z));

        // gravity / jump
        if (keys.has("Space") && player.onGround) {
          player.velocity.y = JUMP;
          player.onGround = false;
        }
        player.velocity.y -= GRAVITY * dt;
        player.position.y += player.velocity.y * dt;

        const groundH = heightAt(Math.floor(player.position.x), Math.floor(player.position.z)) + EYE;
        if (player.position.y <= groundH) {
          player.position.y = groundH;
          player.velocity.y = 0;
          player.onGround = true;
        }

        // camera rotation
        camera.position.copy(player.position);
        const lookTarget = new THREE.Vector3(
          player.position.x + Math.sin(player.yaw) * Math.cos(player.pitch),
          player.position.y + Math.sin(player.pitch),
          player.position.z + Math.cos(player.yaw) * Math.cos(player.pitch),
        );
        camera.lookAt(lookTarget);

        // station proximity
        let nearest: string | null = null;
        let nearestDist = 4;
        for (const s of stations) {
          const d = Math.hypot(s.position.x - player.position.x, s.position.z - player.position.z);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = s.id;
          }
        }
        setActiveStation(nearest);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);

      const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("pointerlockchange", onPointerLockChange);
        document.removeEventListener("mousemove", onMouseMove);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };

      setReady(true);
    })().catch((err) => {
      console.error("3D world failed to load", err);
      setError(String(err?.message ?? err));
    });

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  const stationContent: Record<string, ReactNode> = {
    about: (
      <div>
        <p className="mb-2">
          I&apos;m Rachelle. Programmer, crocheter, and game lover. Welcome to
          my 3D voxel portfolio.
        </p>
        <p>Use WASD to walk and mouse to look around. Approach the glowing blocks.</p>
      </div>
    ),
    projects: (
      <div className="space-y-2">
        <a className="block text-blue-300 hover:underline" href="https://github.com/demanr/tango" target="_blank" rel="noreferrer">
          Tango — voice-activated AI helper (Hack the North 2025)
        </a>
        <a className="block text-blue-300 hover:underline" href="https://github.com/Krish120003/lane-centering-bracketbot" target="_blank" rel="noreferrer">
          Bracket Bot — autonomous lane driving robot
        </a>
        <a className="block text-blue-300 hover:underline" href="https://github.com/deltahacks" target="_blank" rel="noreferrer">
          DeltaHacks — McMaster hackathon platform
        </a>
        <a className="block text-blue-300 hover:underline" href="https://github.com/krish120003/integrity" target="_blank" rel="noreferrer">
          Integrity — hackathon submission checker
        </a>
      </div>
    ),
    photography: (
      <div>
        <p className="mb-2">A selection of my photography.</p>
        <Link href="/photography" className="text-blue-300 hover:underline">
          Open photography gallery →
        </Link>
      </div>
    ),
    contact: (
      <div className="space-y-2">
        <a className="block text-blue-300 hover:underline" href="mailto:rachelledeman@icloud.com">
          rachelledeman@icloud.com
        </a>
        <a className="block text-blue-300 hover:underline" href="https://github.com/demanr" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="block text-blue-300 hover:underline" href="https://www.linkedin.com/in/r-deman/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    ),
  };

  const stationTitle: Record<string, string> = {
    about: "About",
    projects: "Projects",
    photography: "Photography",
    contact: "Contact",
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-mono">
          Loading 3D world…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 font-mono p-4 text-center">
          Failed to load 3D world: {error}
        </div>
      )}
      <div className="absolute top-4 left-4 text-white text-sm font-mono bg-black/60 px-3 py-2 rounded z-10">
        <div className="font-bold">Minecraft Portfolio (3D)</div>
        <div className="opacity-70">Click to look · WASD move · Space jump</div>
        <div className="opacity-70">{locked ? "Pointer locked" : "Click canvas to lock pointer"}</div>
        <Link href="/" className="text-blue-300 hover:underline block mt-1">
          ← Back to 2D portfolio
        </Link>
      </div>
      {activeStation && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-black/80 text-white p-4 rounded-lg z-10 border border-white/20">
          <div className="font-bold mb-2">{stationTitle[activeStation]}</div>
          {stationContent[activeStation]}
        </div>
      )}
    </div>
  );
};

export default MinecraftPage;