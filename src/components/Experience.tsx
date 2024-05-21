import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import Game from "./Game";
import { BG_COLOR } from "../data/theme";

export default function Experience() {
  return (
    <>
      <color attach={"background"} args={[BG_COLOR]} />
      <fog attach={"fog"} args={[BG_COLOR, 1, 20]} />

      <Game />

      <EffectComposer>
        <Bloom luminanceThreshold={1.1} mipmapBlur />
        <ToneMapping />
      </EffectComposer>
    </>
  );
}
