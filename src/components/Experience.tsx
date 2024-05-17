import { OrbitControls } from "@react-three/drei";

import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import MatrixCity from "./MatrixCity";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <MatrixCity
        model="city1"
        rotation-x={-Math.PI * 0.5 * 0}
        position-y={0}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={1.1} mipmapBlur />

        <ToneMapping />
      </EffectComposer>
    </>
  );
}
