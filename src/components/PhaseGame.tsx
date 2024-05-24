import { Suspense, useEffect, useRef } from "react";
import MissionList from "./MissionList";
import RunnerList from "./RunnerList";
import EuroDollar from "./EuroDollar";
import AddButton from "./AddButton";
import { MissionRef } from "./MissionButton";
import useAddRunner from "../hooks/useAddRunner";
import useAddMission from "../hooks/useAddMission";
import { useGame } from "../hooks/useGame";
import useResponsiveness from "../hooks/useResponsiveness";

export default function PhaseGame() {
  const [phase, setPhase] = useGame((state) => [state.phase, state.setPhase]);
  const addMissionButtonCallback = useAddMission();
  const addRunnerButtonCallback = useAddRunner();

  useEffect(() => {
    if (phase === "intro")
      setTimeout(() => {
        setPhase("game");
      }, 2000);
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
            <EuroDollar position-y={1.3} scale={0.4} position-x={-0.1} />
            <AddButton
              callback={addMissionButtonCallback}
              position={[-deltaPosition, 0.7, 1]}
            />
            <AddButton
              callback={addRunnerButtonCallback}
              position={[deltaPosition, 0.7, 1]}
            />
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
