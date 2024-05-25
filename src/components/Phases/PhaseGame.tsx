import { Suspense, useEffect, useRef } from "react";
import MissionList from "../MissionList";
import RunnerList from "../RunnerList";
import { MissionRef } from "../MissionButton";
import useResponsiveness from "../../hooks/useResponsiveness";
import GameHeader from "../GameHeader";

export default function PhaseGame() {
  const selectedMissions = useRef<MissionRef[]>([]);
  useEffect(() => {
    selectedMissions.current = [];
  }, []);

  const [scaleRatio, deltaPosition] = useResponsiveness();

  return (
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
  );
}
