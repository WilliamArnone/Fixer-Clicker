import {
  Bloom,
  EffectComposer,
  Glitch,
  ToneMapping,
} from "@react-three/postprocessing";
import { useGame } from "../hooks/useGame";
import { useEffect, useRef } from "react";
import { PlayMissionFailed } from "../data/audioFiles";
import { useControls } from "leva";

export default function PostProcess() {
  const missions = useGame((state) => state.missions);
  const [glitch, setGlitch] = useGame((state) => [
    state.glitch,
    state.setGlitch,
  ]);
  const prevMissions = useRef(-1);

  const { bloomTreshold, bloomIntensity } = useControls("PostProcess", {
    bloomTreshold: { value: 0.9, min: 0.1, max: 2.0 },
    bloomIntensity: { value: 0.3, min: 0.1, max: 2.0 },
  });

  useEffect(() => {
    let clearGlitch;
    if (missions.length < prevMissions.current) {
      PlayMissionFailed();
      setGlitch(true);
      const timeout = setTimeout(() => {
        setGlitch(false);
      }, 1000);
      clearGlitch = () => clearTimeout(timeout);
    }

    prevMissions.current = missions.length;

    return clearGlitch;
  }, [missions]);

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={bloomTreshold}
        intensity={bloomIntensity}
        mipmapBlur
      />
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
