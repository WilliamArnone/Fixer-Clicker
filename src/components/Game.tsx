import MatrixCity from "./MatrixCity";
import { useControls } from "leva";
import { BG_COLOR } from "../data/theme";
import { animated } from "@react-spring/three";
import MissionList from "./MissionList";
import RunnerList from "./RunnerList";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import MyCamera from "./MyCamera";
import useGameController from "../hooks/useGameController";
import { MissionRef } from "./MissionButton";
import { OrbitControls } from "@react-three/drei";

export default function Game() {
  /**
   * CONTROLS
   */
  const { color } = useControls("Matrix City", {
    color: { value: "#1e56ff" },
  });

  const { buttonHeight } = useControls("Game UI", {
    buttonHeight: { value: 3.8 },
  });

  /**
   * LOGIC
   */
  const phase = useGameController();
  const selectedMissions = useRef<MissionRef[]>([]);
  useEffect(() => {
    selectedMissions.current = [];
  }, []);

  /**
   * RESPONSIVENESS
   */
  const { size } = useThree();
  const [scaleRatio, deltaPosition] = useMemo(() => {
    return [1, size.width * 0.001];
  }, [size]);

  return (
    <>
      <MyCamera makeDefault fov={70}>
        {phase === "intro" && (
          <animated.mesh position-z={-1} scale={10}>
            <planeGeometry />
            <meshBasicMaterial color={BG_COLOR} />
          </animated.mesh>
        )}
      </MyCamera>

      {phase === "game" && (
        <group rotation-x={-0.2}>
          <MissionList
            rotation-y={0.1}
            position-y={buttonHeight}
            position-x={-deltaPosition}
            name="Missions"
            ref={selectedMissions}
          />
          <RunnerList
            rotation-y={-0.1}
            position-y={buttonHeight}
            position-x={deltaPosition}
            name="Runners"
            ref={selectedMissions}
          />
        </group>
      )}

      <MatrixCity
        model="city1"
        rotation-x={-Math.PI * 0.5 * 0}
        position-y={0}
        color={color}
      />
    </>
  );
}
