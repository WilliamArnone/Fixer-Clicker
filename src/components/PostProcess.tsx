import {
  EffectComposer,
  Glitch,
  ToneMapping,
} from "@react-three/postprocessing";
import { useGame } from "../hooks/useGame";

export default function PostProcess() {
  const glitch = useGame((state) => state.glitch);

  return (
    <EffectComposer>
      <Glitch
        //delay={[5, 10]} // min and max glitch delay
        //duration={[0.3, 0.5]} // min and max glitch duration
        strength={[0.3, 1.0] as any} // min and max glitch strength
        //mode={GlitchMode.SPORADIC} // glitch mode
        active={glitch}
        ratio={1} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
      />
      <ToneMapping />
    </EffectComposer>
  );
}
