import { PerspectiveCamera as PCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React from "react";
import { Vector3 } from "three";

interface MyCameraProps extends React.ComponentProps<typeof PCamera> {}

export default function MyCamera(props: MyCameraProps) {
  const { cameraPosition, targetPosition, moveFactor } = useControls("Camera", {
    cameraPosition: {
      value: { x: 0, y: 6, z: 3.5 },
    },
    targetPosition: { value: { x: 0, y: 1.5, z: -3 } },
    moveFactor: {
      value: { x: 1, y: 0.2 },
    },
  });

  useFrame(({ camera, pointer, size }) => {
    camera.position.copy({
      x: cameraPosition.x + (size.width > 768 ? pointer.x * moveFactor.x : 0),
      y: cameraPosition.y + (size.width > 768 ? pointer.y * moveFactor.y : 0),
      z: cameraPosition.z,
    });

    camera.lookAt(
      new Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
    );
  });

  return <PCamera fov={70} {...props} makeDefault />;
}
