import { Suspense, useEffect, useRef } from "react";
import MissionList from "./MissionList";
import RunnerList from "./RunnerList";
import { MissionRef } from "./MissionButton";
import { useGame } from "../hooks/useGame";
import useResponsiveness from "../hooks/useResponsiveness";
import { PlayBass, PlaySong } from "../data/audioFiles";
import GameHeader from "./GameHeader";

export default function PhaseGame() {
  const [phase, setPhase] = useGame((state) => [state.phase, state.setPhase]);
  const addMission = useGame((state) => state.addMission);
  const addRunner = useGame((state) => state.addRunner);

  useEffect(() => {
    if (phase === "intro") {
      /**
       * INTRO
       */
      PlayBass();
      setTimeout(() => {
        setPhase("game");
      }, 1500);
    } else if (phase === "game") {
      /**
       * GAME
       */
      addMission(false);
      addMission(false);
      addMission(false);
      addRunner(false);
      addRunner(false);
      PlaySong();
    }
  }, [phase]);

  const selectedMissions = useRef<MissionRef[]>([]);
  useEffect(() => {
    selectedMissions.current = [];
  }, []);

  const [scaleRatio, deltaPosition] = useResponsiveness();

  return (
    <>
      {phase === "game" && (
        <group rotation-x={-0.2} scale={scaleRatio} position-y={3.4}>
          <Suspense>
            <GameHeader deltaPosition={deltaPosition} />
          </Suspense>
          <MissionList
            rotation-y={0.1}
            position-x={-deltaPosition}
            name="Missions"
            ref={selectedMissions}
          />
          <RunnerList
            rotation-y={-0.1}
            position-x={deltaPosition - 0.2}
            name="Runners"
            ref={selectedMissions}
          />
        </group>
      )}
    </>
  );
}
