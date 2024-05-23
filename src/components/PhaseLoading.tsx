import { animated } from "@react-spring/three";
import { BG_COLOR } from "../data/theme";
import { useGame } from "../hooks/useGame";
import { useEffect } from "react";

export default function PhaseLoading() {
  const [phase, setPhase] = useGame((state) => [state.phase, state.setPhase]);

  useEffect(() => {
    setPhase("intro");
  }, []);

  return (
    <>
      {phase === "loading" && (
        <animated.mesh position-z={-1} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={BG_COLOR} />
        </animated.mesh>
      )}
    </>
  );
}
