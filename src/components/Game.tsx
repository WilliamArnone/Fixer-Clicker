import MatrixCity from "./MatrixCity";

export default function Game() {
  return (
    <>
      <MatrixCity
        model="city1"
        rotation-x={-Math.PI * 0.5 * 0}
        position-y={0}
      />
    </>
  );
}
