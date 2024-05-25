import { useEffect } from "react";
import { useGame } from "./useGame";
import { PlaySong } from "../data/audioFiles";

export default function usePhaseManager() {
  const [phase, setPhase] = useGame((state) => [state.phase, state.setPhase]);

  useEffect(() => {
    switch (phase) {
      case "idle":
        setTimeout(() => {
          setPhase("intro");
        }, 1500);
        break;

      case "loading":
        break;

      case "intro":
        /**
         * INTRO
         */
        setTimeout(() => {
          setPhase("game");
        }, 1500);
        break;

      case "game":
        /**
         * GAME
         */
        const addMission = useGame.getState().addMission;
        const addRunner = useGame.getState().addRunner;

        addMission(false);
        addMission(false);
        addMission(false);
        addRunner(false);
        addRunner(false);
        PlaySong();
        break;
    }
  }, [phase]);
}
