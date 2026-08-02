"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const FALLBACK_MODEL_URL =
  "https://srnpiccxpucvujhdcgxw.supabase.co/storage/v1/object/public/car-models/question_mark.glb";

interface ModelProps {
  modelPath: string;
}

function Model({ modelPath }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

interface CarCardProps {
  car: {
    brand: string;
    model: string;
    year: number;
    hp: number;
    torque: number;
    displacement: number;
    weight: number;
    topSpeed: number;
    modelUrl: string;
  };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 py-2 last:border-b-0">
      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}

export default function CarCard({ car }: CarCardProps) {
  const [resolvedModelUrl, setResolvedModelUrl] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const loader = new GLTFLoader();

    setResolvedModelUrl(null);

    loader.load(
      car.modelUrl,
      () => {
        if (!isCancelled) {
          setResolvedModelUrl(car.modelUrl);
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
  }, [car.modelUrl]);

  return (
    <div className="w-[560px] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-lg">
      <div className="flex h-[250px]">
        <div className="min-w-0 flex-1">
          {resolvedModelUrl ? (
            <Canvas
              dpr={[1, 1]}
              gl={{ antialias: true, alpha: true }}
              camera={{ position: [3, 0.3, 3], fov: 45 }}
            >
              <Suspense fallback={null}>
                <Stage
                  intensity={0.6}
                  environment="sunset"
                  adjustCamera={1.1}
                >
                  <Model modelPath={resolvedModelUrl} />
                </Stage>
              </Suspense>
            </Canvas>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Loading model...
            </div>
          )}
        </div>

        <aside className="w-56 border-l border-zinc-700 bg-zinc-950/60 px-4 py-3 text-zinc-300">
          <div className="grid grid-cols-2 gap-2 border-b border-white/10 py-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Power</p>
              <p className="mt-1 text-sm font-medium text-zinc-100">{car.hp} HP</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Torque</p>
              <p className="mt-1 text-sm font-medium text-zinc-100">{car.torque} Nm</p>
            </div>
          </div>
          <InfoRow label="Disp." value={`${car.displacement} L`} />
          <InfoRow label="Weight" value={`${car.weight} kg`} />
          <InfoRow label="Top speed" value={`${car.topSpeed} km/h`} />
        </aside>
      </div>

      <div className="flex items-end justify-between gap-4 border-t border-zinc-700 px-4 py-3 text-zinc-200">
        <p className="text-lg font-semibold leading-tight">
          {car.brand} {car.model}
        </p>
        <div className="text-lg font-medium">
          {car.year}
        </div>
      </div>
    </div>
  );
}
