import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 360 : 780;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.016);

    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 42);

    // WebGL Renderer
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 1. Ambient Particle Constellation (Ember Orange + Terminal Cyan + Steel)
    const particleGeo = new THREE.BufferGeometry();
    const basePositions = new Float32Array(particleCount * 3);
    const livePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const ember = new THREE.Color(0xff6b00);
    const cyan = new THREE.Color(0x00f0ff);
    const emerald = new THREE.Color(0x10b981);
    const slate = new THREE.Color(0x475569);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 92;
      const y = (Math.random() - 0.5) * 68;
      const z = (Math.random() - 0.5) * 52;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      livePositions[i * 3] = x;
      livePositions[i * 3 + 1] = y;
      livePositions[i * 3 + 2] = z;

      const r = Math.random();
      const c =
        r < 0.34
          ? ember.clone().lerp(slate, Math.random() * 0.45)
          : r < 0.68
          ? cyan.clone().lerp(slate, Math.random() * 0.5)
          : r < 0.82
          ? emerald.clone().lerp(slate, 0.4)
          : slate;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(livePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular luminous particle sprite (prevents blocky square WebGL points)
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sCtx = spriteCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(255,255,255,0.75)');
      grad.addColorStop(0.7, 'rgba(255,255,255,0.18)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(spriteCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.85 : 1.05,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 2. Wireframe Systems Core (Icosahedron + Orbital Gyro Rings)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(isMobile ? 0 : 14, isMobile ? 6 : 2, -10);

    const icoGeo = new THREE.IcosahedronGeometry(8.5, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const icoMat = new THREE.LineBasicMaterial({
      color: 0xff8a00,
      transparent: true,
      opacity: 0.16,
    });
    const icoWire = new THREE.LineSegments(icoEdges, icoMat);
    coreGroup.add(icoWire);

    const innerGeo = new THREE.OctahedronGeometry(4.4, 0);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.2,
    });
    const innerWire = new THREE.LineSegments(innerEdges, innerMat);
    coreGroup.add(innerWire);

    const ringGeo1 = new THREE.TorusGeometry(11.8, 0.045, 8, 90);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.14,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.6;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(14.2, 0.04, 8, 90);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff6b00,
      transparent: true,
      opacity: 0.11,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // 3. Perspective Engineering Grid Plane
    const gridHelper = new THREE.GridHelper(130, 36, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -24;
    gridHelper.rotation.x = 0.15;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    scene.add(gridHelper);

    // Interactive State (Mouse + Scroll)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollProgress = 0;
    let smoothScroll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 7;
      targetY = (e.clientY / window.innerHeight - 0.5) * -5;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    // Render one static frame if reduced motion is requested
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (container && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }

    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth lerp for mouse and scroll
      mouseX += (targetX - mouseX) * 0.045;
      mouseY += (targetY - mouseY) * 0.045;
      smoothScroll += (scrollProgress - smoothScroll) * 0.06;

      // Scroll-reactive camera motion
      camera.position.x = mouseX;
      camera.position.y = mouseY - smoothScroll * 6;
      camera.position.z = 42 - smoothScroll * 7;
      camera.lookAt(0, -smoothScroll * 3, 0);

      // Rotate geometric core dynamically with time + scroll
      coreGroup.position.x = (isMobile ? 0 : 14) - smoothScroll * (isMobile ? 0 : 26);
      coreGroup.position.y = (isMobile ? 6 : 2) - smoothScroll * 8;
      icoWire.rotation.x = elapsed * 0.14 + smoothScroll * 2.2;
      icoWire.rotation.y = elapsed * 0.22 + smoothScroll * 3.0;
      innerWire.rotation.x = -elapsed * 0.35;
      innerWire.rotation.y = -elapsed * 0.28;
      ring1.rotation.z = elapsed * 0.2;
      ring2.rotation.z = -elapsed * 0.16;

      // Subtle traveling grid
      gridHelper.position.z = (elapsed * 1.4) % 3.6;

      // Wave oscillation on starfield
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArr[idx + 1] =
          basePositions[idx + 1] + Math.sin(elapsed * 0.65 + basePositions[idx] * 0.07) * 0.65;
      }
      posAttr.needsUpdate = true;
      particles.rotation.y = elapsed * 0.018 + smoothScroll * 0.35;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      particleGeo.dispose();
      particleTexture.dispose();
      particleMat.dispose();
      icoGeo.dispose();
      icoEdges.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerEdges.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.9 }}
    />
  );
};
