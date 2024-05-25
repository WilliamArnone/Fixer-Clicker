import EuroDollar from "./EuroDollar";
import AddButton from "./AddButton";
import useAddRunner from "../hooks/useAddRunner";
import useAddMission from "../hooks/useAddMission";

export default function GameHeader({
  deltaPosition,
}: {
  deltaPosition: number;
}) {
  const addMissionButtonCallback = useAddMission();
  const addRunnerButtonCallback = useAddRunner();
  return (
    <>
      <EuroDollar position-y={1.3} scale={0.4} position-x={-0.1} />
      <AddButton
        callback={addMissionButtonCallback}
        position={[-deltaPosition, 0.7, 1]}
      />
      <AddButton
        callback={addRunnerButtonCallback}
        position={[deltaPosition, 0.7, 1]}
      />
    </>
  );
}
