import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import Game from "./Game";
import Camera from "./Camera";

export default function Experience() {
  return (
    <>
      <color attach={"background"} args={["#1c1c1c"]} />
      <fog attach={"fog"} args={["#1c1c1c", 1, 20]} />

      <Camera />
      <Game />

      <EffectComposer>
        <Bloom luminanceThreshold={1.1} mipmapBlur />

        <ToneMapping />
      </EffectComposer>
    </>
  );
}
