import MatrixCity from "./MatrixCity";
import MyCamera from "./MyCamera";
import PhaseGame from "./PhaseGame";
import PhaseLoading from "./PhaseLoading";

export default function Game() {
  return (
    <>
      <MyCamera>
        <PhaseLoading />
      </MyCamera>

      <PhaseGame />

      <MatrixCity
        model="city1"
        rotation-x={-Math.PI * 0.5 * 0}
        position-y={0}
        color={"#1e56ff"}
      />
    </>
  );
}
