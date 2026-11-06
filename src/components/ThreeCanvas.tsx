import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect mobile or low performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 650 : 1400;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06090e, 0.012);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 45;

    // High Performance WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    mountRef.current.appendChild(renderer.domElement);

    // Dynamic 3D Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mouseLightOrange = new THREE.PointLight(0xff8a00, 4, 60);
    mouseLightOrange.position.set(0, 0, 15);
    scene.add(mouseLightOrange);

    const mouseLightCyan = new THREE.PointLight(0x00f0ff, 3, 50);
    mouseLightCyan.position.set(0, 0, 15);
    scene.add(mouseLightCyan);

    // =========================================================================
    // 1. Cybernetic Morphing Polyhedron Core
    // =========================================================================
    const coreDetail = isMobile ? 1 : 2;
    const baseCoreGeo = new THREE.IcosahedronGeometry(7, coreDetail);
    const coreGeo = baseCoreGeo.clone();
    const originalPositions = baseCoreGeo.attributes.position.clone();

    // Wireframe Outer Layer
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff8a00,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const coreWireMesh = new THREE.Mesh(coreGeo, wireMat);
    coreWireMesh.position.set(18, 2, -10);
    scene.add(coreWireMesh);

    // Inner Translucent Facet Layer
    const facetMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.85,
      roughness: 0.25,
      transparent: true,
      opacity: 0.08,
      flatShading: true,
    });
    const coreFacetMesh = new THREE.Mesh(coreGeo, facetMat);
    coreWireMesh.add(coreFacetMesh);

    // Glowing Inner Nucleus Sphere
    const nucleusGeo = new THREE.SphereGeometry(2.5, 16, 16);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0xffa800,
      transparent: true,
      opacity: 0.45,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreWireMesh.add(nucleusMesh);

    // =========================================================================
    // 2. Gyroscopic Gimbal Orbital Rings
    // =========================================================================
    const ring1Geo = new THREE.TorusGeometry(12.5, 0.05, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreWireMesh.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(15, 0.04, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xff8a00,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2.5;
    ring2.rotation.y = Math.PI / 4;
    coreWireMesh.add(ring2);

    // =========================================================================
    // 3. Kinetic Quantum Stardust Vector Field (1400 particles)
    // =========================================================================
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const initialPos = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorWarm = new THREE.Color('#FF8A00');
    const colorCyan = new THREE.Color('#00F0FF');
    const colorWhite = new THREE.Color('#F8FAFC');

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const x = (Math.random() - 0.5) * 140;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 80;

      particlePos[idx] = x;
      particlePos[idx + 1] = y;
      particlePos[idx + 2] = z;

      initialPos[idx] = x;
      initialPos[idx + 1] = y;
      initialPos[idx + 2] = z;

      velocities[idx] = 0;
      velocities[idx + 1] = 0;
      velocities[idx + 2] = 0;

      const mix = Math.random();
      const col = mix < 0.25 ? colorWarm : mix < 0.65 ? colorCyan : colorWhite;
      colors[idx] = col.r;
      colors[idx + 1] = col.g;
      colors[idx + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.65 : 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // =========================================================================
    // 4. Interactive Mouse Tracking & Physical Shockwaves
    // =========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Shockwave State
    const shockwaves: Array<{
      x: number;
      y: number;
      z: number;
      radius: number;
      maxRadius: number;
      speed: number;
      force: number;
    }> = [];

    let coreImpulse = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleClick = (e: MouseEvent) => {
      // Calculate 3D mouse unprojected ray
      const vector = new THREE.Vector3(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const clickWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));

      // Trigger 3D expanding shockwave
      shockwaves.push({
        x: clickWorldPos.x,
        y: clickWorldPos.y,
        z: clickWorldPos.z,
        radius: 0,
        maxRadius: 45,
        speed: 1.8,
        force: 2.2,
      });

      // Pulse core violently on click
      coreImpulse = 1.0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (window.innerWidth < 768) {
        coreWireMesh.position.set(0, 8, -15);
      } else {
        coreWireMesh.position.set(18, 2, -10);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 5. Main 60-120 FPS Render Loop with Physics & Shaders
    // =========================================================================
    let clock = new THREE.Clock();
    let animId: number;
    let isVisible = true;

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Update 3D Point Lights to follow mouse in space
      mouseLightOrange.position.x = mouseX * 28 + 10;
      mouseLightOrange.position.y = mouseY * 22;
      mouseLightCyan.position.x = mouseX * -25 - 10;
      mouseLightCyan.position.y = mouseY * -20;

      // Camera parallax tilt
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // =======================================================================
      // Deform Cybernetic Core Vertices (Procedural Mathematical Morph)
      // =======================================================================
      const posAttr = coreGeo.attributes.position;
      const origPos = originalPositions.array as Float32Array;
      const currentPos = posAttr.array as Float32Array;

      coreImpulse *= 0.92; // Damping impulse

      const morphFrequency = 1.5;
      const morphAmplitude = 0.55 + coreImpulse * 1.8;

      for (let i = 0; i < posAttr.count; i++) {
        const i3 = i * 3;
        const ox = origPos[i3];
        const oy = origPos[i3 + 1];
        const oz = origPos[i3 + 2];

        const wave =
          Math.sin(elapsedTime * morphFrequency + ox * 0.4) *
          Math.cos(elapsedTime * morphFrequency + oy * 0.4);

        const displacement = 1 + wave * morphAmplitude * 0.15 + coreImpulse * 0.3;

        currentPos[i3] = ox * displacement;
        currentPos[i3 + 1] = oy * displacement;
        currentPos[i3 + 2] = oz * displacement;
      }
      posAttr.needsUpdate = true;

      // Rotate Cyber Core on Multi-Axes
      coreWireMesh.rotation.y = elapsedTime * 0.18 + mouseX * 0.5;
      coreWireMesh.rotation.x = elapsedTime * 0.12 - mouseY * 0.5;

      ring1.rotation.z = elapsedTime * 0.35;
      ring1.rotation.y = elapsedTime * 0.25;
      ring2.rotation.z = -elapsedTime * 0.3;
      ring2.rotation.x = elapsedTime * 0.2;

      // Nucleus pulse
      const nScale = 1 + Math.sin(elapsedTime * 4) * 0.12 + coreImpulse * 0.8;
      nucleusMesh.scale.set(nScale, nScale, nScale);

      // =======================================================================
      // Update Particles with Gravity Wells, Wavefronts, & Inertia
      // =======================================================================
      const positions = particleGeo.attributes.position.array as Float32Array;

      // Update active shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += sw.speed;
        if (sw.radius > sw.maxRadius) {
          shockwaves.splice(s, 1);
        }
      }

      // Mouse 3D position proxy
      const mWorldX = mouseX * 35;
      const mWorldY = mouseY * 25;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Current position
        let px = positions[i3];
        let py = positions[i3 + 1];
        let pz = positions[i3 + 2];

        // Origin target
        const ox = initialPos[i3];
        const oy = initialPos[i3 + 1];
        const oz = initialPos[i3 + 2];

        // 1. Gentle orbital swirl drift
        const angle = 0.0006;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const nx = px * cos - pz * sin;
        const nz = px * sin + pz * cos;
        px = nx;
        pz = nz;

        // 2. Mouse proximity attraction / deflection
        const dx = mWorldX - px;
        const dy = mWorldY - py;
        const distSq = dx * dx + dy * dy;

        if (distSq < 400 && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 20) * 0.25;
          velocities[i3] += (dx / dist) * force;
          velocities[i3 + 1] += (dy / dist) * force;
        }

        // 3. Shockwave explosive wavefront impact
        for (let s = 0; s < shockwaves.length; s++) {
          const sw = shockwaves[s];
          const swDx = px - sw.x;
          const swDy = py - sw.y;
          const swDz = pz - sw.z;
          const swDist = Math.sqrt(swDx * swDx + swDy * swDy + swDz * swDz);

          // If particle is near the shockwave expanding ring
          const ringDist = Math.abs(swDist - sw.radius);
          if (ringDist < 6 && swDist > 0.1) {
            const push = (1 - ringDist / 6) * sw.force;
            velocities[i3] += (swDx / swDist) * push;
            velocities[i3 + 1] += (swDy / swDist) * push;
            velocities[i3 + 2] += (swDz / swDist) * push;
          }
        }

        // 4. Elastic return force to home anchor
        const homeDx = ox - px;
        const homeDy = oy - py;
        const homeDz = oz - pz;
        velocities[i3] += homeDx * 0.015;
        velocities[i3 + 1] += homeDy * 0.015;
        velocities[i3 + 2] += homeDz * 0.015;

        // Velocity damping (friction)
        velocities[i3] *= 0.94;
        velocities[i3 + 1] *= 0.94;
        velocities[i3 + 2] *= 0.94;

        // Apply velocity
        positions[i3] = px + velocities[i3];
        positions[i3 + 1] = py + velocities[i3 + 1];
        positions[i3 + 2] = pz + velocities[i3 + 2];
      }

      particleGeo.attributes.position.needsUpdate = true;

      // Render
      renderer.render(scene, camera);
    };

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      baseCoreGeo.dispose();
      coreGeo.dispose();
      wireMat.dispose();
      facetMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    />
  );
};
