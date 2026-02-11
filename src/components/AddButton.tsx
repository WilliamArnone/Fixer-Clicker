import { a, useSpring, SpringRef, config } from "@react-spring/three";
import { useCursor, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import React, { useCallback, useEffect, useState } from "react";
import { PlaneGeometry } from "three";

const planeGeometry = new PlaneGeometry(0.5, 0.5);

export const idleDistance = 0.15;
export const hoverDistance = 0.08;
export const clickDistance = 0.03;

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
  const [hover, setHover] = useState(false);
  useCursor(hover);

  const baseTexture = useTexture("/img/Generic/AddButtonBase.png");
  const overlayTexture = useTexture("/img/Generic/AddButtonOverlay.png");

  const [spring, api] = useSpring(() => ({
    from: { opacity: 0, color: "#ffffff", zDistance: idleDistance },
  }));

  useEffect(() => {
    api.start({ opacity: 1, config: config.slow });
  }, []);

  const pointerEnter = () => {
    setHover(true);
    api.start({ zDistance: hoverDistance });
  };
  const pointerLeave = () => {
    setHover(false);
    api.start({ zDistance: idleDistance });
  };

  const pointerUP = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (callback) callback(api);
    },
    [callback, api],
  );

  return (
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
          map={baseTexture as any}
          opacity={spring.opacity}
        ></a.meshBasicMaterial>
      </mesh>
      <a.mesh geometry={planeGeometry} position-z={spring.zDistance}>
        <a.meshBasicMaterial
          transparent
          depthWrite={false}
          color={spring.color}
          map={overlayTexture as any}
        ></a.meshBasicMaterial>
      </a.mesh>
    </group>
  );
}
