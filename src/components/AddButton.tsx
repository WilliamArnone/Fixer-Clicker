import { a, useSpring, SpringRef, config } from "@react-spring/three";
import { useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React, { Suspense, useCallback, useEffect } from "react";
import { PlaneGeometry } from "three";

const planeGeometry = new PlaneGeometry(0.5, 0.5);

export type AddButtonCallbackStyleRef = {
  opacity: number;
  color: string;
  zDistance: number;
};

export type AddButtonCallback = (
  springAPI: SpringRef<AddButtonCallbackStyleRef>,
) => void;

interface AddButtonProps extends React.ComponentPropsWithoutRef<"group"> {
  callback: AddButtonCallback;
}

useTexture.preload("/img/Generic/AddButtonBase.png");
useTexture.preload("/img/Generic/AddButtonOverlay.png");
export default function AddButton({ callback, ...props }: AddButtonProps) {
  const baseTexture = useTexture("/img/Generic/AddButtonBase.png");
  const overlayTexture = useTexture("/img/Generic/AddButtonOverlay.png");

  console.log("Add button re rendered");

  const [spring, api] = useSpring(() => ({
    from: { opacity: 0, color: "#ffffff", zDistance: 0.06 },
  }));

  useEffect(() => {
    api.start({ opacity: 1, config: config.slow });
  }, []);

  const pointerEnter = () => {
    api.start({ zDistance: 0.03 });
  };
  const pointerLeave = () => {
    api.start({ zDistance: 0.06 });
  };

  const pointerUP = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (callback) callback(api);
    },
    [callback, api],
  );

  return (
    <Suspense>
      <group {...props}>
        <mesh
          geometry={planeGeometry}
          onPointerUp={pointerUP}
          onPointerEnter={pointerEnter}
          onPointerLeave={pointerLeave}
        >
          <a.meshBasicMaterial
            transparent
            depthWrite={false}
            color={spring.color}
            map={baseTexture}
            opacity={spring.opacity}
          ></a.meshBasicMaterial>
        </mesh>
        <a.mesh geometry={planeGeometry} position-z={spring.zDistance}>
          <a.meshBasicMaterial
            transparent
            depthWrite={false}
            color={spring.color}
            map={overlayTexture}
          ></a.meshBasicMaterial>
        </a.mesh>
      </group>
    </Suspense>
  );
}
