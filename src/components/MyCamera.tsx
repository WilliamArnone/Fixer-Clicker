import { PerspectiveCamera as PCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect } from "react";
import { Vector3 } from "three";
import { PerspectiveCamera } from "three";
import { useGame } from "../hooks/useGame";

interface MyCameraProps extends React.ComponentProps<typeof PCamera> {}

export default function MyCamera(props: MyCameraProps) {
  const phase = useGame((state) => state.phase);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (phase === "intro" && camera instanceof PerspectiveCamera) {
      console.log("Hello");

      camera.fov = 170;
      camera.updateProjectionMatrix();
    }
  }, [phase]);

  const { cameraPosition, targetPosition, moveFactor } = useControls("Camera", {
    cameraPosition: {
      value: { x: 0, y: 3.3, z: 3.5 },
    },
    targetPosition: { value: { x: 0, y: 1.5, z: -3 } },
    moveFactor: {
      value: { x: 1, y: 0.0 },
    },
  });

  useFrame(({ camera, pointer, size }, delta) => {
    if (camera instanceof PerspectiveCamera && camera.fov > 70.1) {
      camera.fov += (70 - camera.fov) * delta * 0.7;

      if (camera.fov < 70.1) camera.fov = 70;

      camera.updateProjectionMatrix();
    }

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
