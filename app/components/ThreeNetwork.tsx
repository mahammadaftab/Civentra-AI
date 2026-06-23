"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 18;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f2fe, 2, 50);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7f00ff, 2, 50);
    pointLight2.position.set(0, -10, 10);
    scene.add(pointLight2);

    // Agent Nodes definitions
    // Vision -> Severity -> Geo -> Verification -> Resolution -> Analytics
    const agentColors = [
      0x0072ff, // Vision Agent (Blue)
      0x7f00ff, // Severity Agent (Purple)
      0x00f2fe, // Geo Intelligence Agent (Cyan)
      0x3b82f6, // Verification Agent (Light Blue)
      0x8b5cf6, // Resolution Agent (Violet)
      0x06b6d4, // Analytics Agent (Cyan-Teal)
    ];

    const agentNodes = [
      { name: "Vision", pos: new THREE.Vector3(-10, 5, 0), color: agentColors[0] },
      { name: "Severity", pos: new THREE.Vector3(-6, -2, 2), color: agentColors[1] },
      { name: "Geo", pos: new THREE.Vector3(-1, 4, -1), color: agentColors[2] },
      { name: "Verification", pos: new THREE.Vector3(4, -3, 1), color: agentColors[3] },
      { name: "Resolution", pos: new THREE.Vector3(8, 3, -1), color: agentColors[4] },
      { name: "Analytics", pos: new THREE.Vector3(12, -1, 0), color: agentColors[5] },
    ];

    // Create 3D Meshes for Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGroup = new THREE.Group();

    agentNodes.forEach((node) => {
      // Inner glowing core
      const geom = new THREE.SphereGeometry(0.5, 32, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(node.pos);
      nodeGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Outer wireframe ring
      const ringGeom = new THREE.RingGeometry(0.7, 0.9, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(node.pos);
      nodeGroup.add(ring);
    });

    scene.add(nodeGroup);

    // Create Connection Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
    });

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < agentNodes.length - 1; i++) {
      linePoints.push(agentNodes[i].pos);
      linePoints.push(agentNodes[i + 1].pos);
    }
    const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
    const connectionLines = new THREE.LineSegments(lineGeom, lineMaterial);
    scene.add(connectionLines);

    // Dynamic Data Packets (flowing along connections)
    const packetCount = 8;
    interface Packet {
      mesh: THREE.Mesh;
      currentSegment: number;
      progress: number;
      speed: number;
    }
    const packets: Packet[] = [];

    const packetGeom = new THREE.SphereGeometry(0.2, 16, 16);
    for (let i = 0; i < packetCount; i++) {
      const segment = Math.floor(Math.random() * (agentNodes.length - 1));
      const progress = Math.random();
      const speed = 0.005 + Math.random() * 0.008;

      const packetMat = new THREE.MeshBasicMaterial({
        color: agentColors[segment % agentColors.length],
        transparent: true,
        opacity: 0.8,
      });
      const packetMesh = new THREE.Mesh(packetGeom, packetMat);
      
      const start = agentNodes[segment].pos;
      const end = agentNodes[segment + 1].pos;
      packetMesh.position.lerpVectors(start, end, progress);
      
      scene.add(packetMesh);
      packets.push({
        mesh: packetMesh,
        currentSegment: segment,
        progress,
        speed,
      });
    }

    // Background Neural Network Particles
    const particleCount = 250;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Distribute in a box volume around the screen
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 15;
      particleSpeeds.push((Math.random() - 0.5) * 0.02);
    }

    particleGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Glowing particle material
    const particleMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mouse Tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) / windowHalfX;
      mouseY = (event.clientY - windowHalfY) / windowHalfY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Node rotations & pulses
      nodeGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          // Ring meshes are odd indexes in our loop setup
          if (index % 2 === 1) {
            child.rotation.z += 0.01;
            const pulse = 1 + Math.sin(time * 3 + index) * 0.1;
            child.scale.set(pulse, pulse, pulse);
          } else {
            child.rotation.y += 0.005;
          }
        }
      });

      // Update Packets Flow
      packets.forEach((packet) => {
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          packet.progress = 0;
          packet.currentSegment = (packet.currentSegment + 1) % (agentNodes.length - 1);
          // Update colors to match segment agent
          if (packet.mesh.material instanceof THREE.MeshBasicMaterial) {
            packet.mesh.material.color.setHex(agentColors[packet.currentSegment % agentColors.length]);
          }
        }

        const start = agentNodes[packet.currentSegment].pos;
        const end = agentNodes[packet.currentSegment + 1].pos;
        packet.mesh.position.lerpVectors(start, end, packet.progress);
        
        // Add a slight sine wave vertical bob to packets
        packet.mesh.position.y += Math.sin(packet.progress * Math.PI) * 0.4;
      });

      // Float background particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Wobble on y axis
        positions[i * 3 + 1] += Math.sin(time + i) * 0.002;
        // Drift slowly on x axis
        positions[i * 3] += particleSpeeds[i] * 0.1;
        // Wrap around bounds
        if (Math.abs(positions[i * 3]) > 20) {
          positions[i * 3] = -positions[i * 3];
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Smooth Camera Parallax Lerp
      targetX = mouseX * 3;
      targetY = mouseY * 2;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[450px]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
