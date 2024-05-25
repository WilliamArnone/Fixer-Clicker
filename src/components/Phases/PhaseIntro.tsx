import { useEffect, useRef } from "react";
import { PlayBass } from "../../data/audioFiles";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";

export default function PhaseIntro() {
  const camera = useThree((state) => state.camera);

  const startFov = useRef(
    camera instanceof PerspectiveCamera ? camera.fov : 70,
  );

  useEffect(() => {
    PlayBass();
    if (camera instanceof PerspectiveCamera) {
      camera.fov = 170;
      camera.updateProjectionMatrix();
    }
  }, []);

  useFrame(({ camera }, delta) => {
    if (camera instanceof PerspectiveCamera && camera.fov > 70.1) {
      camera.fov += (startFov.current - camera.fov) * Math.min(1, delta * 2.5);

      if (camera.fov < startFov.current + 0.1) camera.fov = startFov.current;

      camera.updateProjectionMatrix();
    }
  });

  return null;
}
