import { Suspense, useEffect, useRef } from "react";
import MissionList from "../MissionList";
import RunnerList from "../RunnerList";
import { MissionRef } from "../MissionButton";
import useResponsiveness from "../../hooks/useResponsiveness";
import GameHeader from "../GameHeader";
import GameOverScreen from "../GameOverScreen";

export default function PhaseGame() {
  const selectedMissions = useRef<MissionRef[]>([]);
  useEffect(() => {
    selectedMissions.current = [];
  }, []);

  const [scaleRatio, deltaPosition] = useResponsiveness();

  return (
    <group rotation-x={-0.55} scale={scaleRatio} position-y={4.9}>
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

      <GameOverScreen />
    </group>
  );
}
