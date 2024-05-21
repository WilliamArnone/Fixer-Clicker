import { useEffect } from "react";
import { useGame } from "./useGame";

export default function useGameController() {
  const addMission = useGame((state) => state.addMission);
  const addRunner = useGame((state) => state.addRunner);
  const phase = useGame((state) => state.phase);

  useEffect(() => {
    addMission();
    addMission();
    addMission();
    addRunner();
    addRunner();
  }, []);

  return phase;
}
