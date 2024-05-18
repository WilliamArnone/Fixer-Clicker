import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Vector3 } from "three";

export default function Camera() {
  const { cameraPosition, targetPosition, moveFactor } = useControls("Camera", {
    cameraPosition: {
      value: { x: 0, y: 3, z: 3.5 },
    },
    targetPosition: { value: { x: 0, y: 1.5, z: -3 } },
    moveFactor: {
      value: { x: 1, y: 0.3 },
    },
  });

  useFrame(({ camera, mouse }) => {
    camera.position.copy({
      x: cameraPosition.x + mouse.x * moveFactor.x,
      y: cameraPosition.y + mouse.y * moveFactor.y,
      z: cameraPosition.z,
    });

    camera.lookAt(
      new Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
    );
  });
  return <>{/* <OrbitControls makeDefault /> */}</>;
}
