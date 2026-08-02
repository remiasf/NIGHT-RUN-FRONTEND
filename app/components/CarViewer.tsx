"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const FALLBACK_MODEL_URL =
  "https://srnpiccxpucvujhdcgxw.supabase.co/storage/v1/object/public/car-models/question_mark.glb";

interface ModelProps {
  modelPath: string;
  scale?: number;
}

function Model({ modelPath, scale }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={scale} />;
}

interface CarViewerProps {
  modelPath: string;
  scale?: number;
  environment?: string;
  fullHeight?: boolean;
}

export default function CarViewer({ modelPath, scale = 1, environment = "city", fullHeight = false }: CarViewerProps) {
  const [resolvedModelUrl, setResolvedModelUrl] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const loader = new GLTFLoader();

    setResolvedModelUrl(null);

    loader.load(
      modelPath,
      () => {
        if (!isCancelled) {
          setResolvedModelUrl(modelPath);
        }
      },
      undefined,
      () => {
        loader.load(
          FALLBACK_MODEL_URL,
          () => {
            if (!isCancelled) {
              setResolvedModelUrl(FALLBACK_MODEL_URL);
            }
          },
          undefined,
          () => {
            if (!isCancelled) {
              setResolvedModelUrl("");
            }
          },
        );
      },
    );

    return () => {
      isCancelled = true;
    };
  }, [modelPath]);

  return (
    <div
      className={`w-full cursor-grab active:cursor-grabbing ${
        fullHeight ? "h-full min-h-[560px]" : "h-[620px]"
      }`}
    >
      {resolvedModelUrl ? (
        <Canvas dpr={[1, 2]} camera={{ position: [4, 1, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

          <Suspense fallback={null}>
            <Stage
              intensity={0.5}
              environment={environment}
              adjustCamera={0.8}
              shadows="contact"
            >
              <Model modelPath={resolvedModelUrl} scale={scale} />
            </Stage>
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.9}
          />
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          {resolvedModelUrl === "" ? "Model unavailable" : "Loading model..."}
        </div>
      )}
    </div>
  );
}