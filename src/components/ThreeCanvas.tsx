import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return; // WebGL not supported
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. Interactive Starfield / Particle Cloud
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const orangeColor = new THREE.Color('#FF6B00');
    const cyanColor = new THREE.Color('#00F0FF');
    const whiteColor = new THREE.Color('#FFFFFF');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const mixed = Math.random() < 0.6 ? orangeColor : Math.random() < 0.85 ? cyanColor : whiteColor;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const pMaterial = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // 2. Central Wireframe Cyber Icosahedron
    const geoIcosa = new THREE.IcosahedronGeometry(9, 1);
    const wireIcosa = new THREE.WireframeGeometry(geoIcosa);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff6b00,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const icosaMesh = new THREE.LineSegments(wireIcosa, lineMaterial);
    icosaMesh.position.set(14, 2, -5);
    scene.add(icosaMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(4, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    icosaMesh.add(innerMesh);

    // Mouse Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      camera.position.y = -scrollProgress * 25;
      icosaMesh.rotation.y = scrollProgress * Math.PI * 4;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize Handler
    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Adjust mesh position for mobile
      if (window.innerWidth < 768) {
        icosaMesh.position.set(0, -6, -10);
        icosaMesh.scale.set(0.65, 0.65, 0.65);
      } else {
        icosaMesh.position.set(14, 2, -5);
        icosaMesh.scale.set(1, 1, 1);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      particles.rotation.y = elapsed * 0.03 + currentMouseX * 0.2;
      particles.rotation.x = elapsed * 0.015 - currentMouseY * 0.2;

      icosaMesh.rotation.x = elapsed * 0.15 + currentMouseY * 0.3;
      icosaMesh.rotation.y = elapsed * 0.2 + currentMouseX * 0.3;
      innerMesh.rotation.y = -elapsed * 0.3;

      camera.position.x = currentMouseX * 4;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      geometry.dispose();
      pMaterial.dispose();
      geoIcosa.dispose();
      lineMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
