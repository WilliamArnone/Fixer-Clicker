import { useEffect } from "react";
import { useGame } from "./useGame";

export default function useGameController() {
  const addMission = useGame((state) => state.addMission);
  const addRunner = useGame((state) => state.addRunner);
  const [phase, setPhase] = useGame((state) => [state.phase, state.setPhase]);

  useEffect(() => {
    if (phase === "loading") {
      setTimeout(() => {
        setPhase("intro");
      }, 2000);
    }

    if (phase === "intro") {
      setTimeout(() => {
        setPhase("game");
      }, 2000);
    }

    if (phase === "game") {
      addMission();
      addMission();
      addMission();
      addRunner();
      addRunner();
    }
  }, [phase]);

  return phase;
}
