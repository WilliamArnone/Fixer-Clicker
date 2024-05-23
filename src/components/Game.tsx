import MatrixCity from "./MatrixCity";
import { useControls } from "leva";
import { BG_COLOR } from "../data/theme";
import { animated } from "@react-spring/three";
import MissionList from "./MissionList";
import RunnerList from "./RunnerList";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import MyCamera from "./MyCamera";
import useGameController from "../hooks/useGameController";
import { MissionRef } from "./MissionButton";

export default function Game() {
  /**
   * CONTROLS
   */
  const { scaleFactor, scaleMin, widthFactor, widthMin } = useControls(
    "Resolution",
    {
      scaleFactor: { value: 0.16, min: 0, max: 2 },
      scaleMin: { value: 0.38, min: 0, max: 2 },
      widthFactor: { value: 1.3, min: 0, max: 2 },
      widthMin: { value: 0.72, min: 0, max: 2 },
    },
  );

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
    return [
      (size.width / size.height) * scaleFactor + scaleMin,
      (size.width / size.height) * widthFactor + widthMin,
    ];
  }, [size, scaleFactor, widthFactor, scaleMin, widthMin]);

  return (
    <>
      <MyCamera>
        {phase === "loading" && (
          <animated.mesh position-z={-1} scale={10}>
            <planeGeometry />
            <meshBasicMaterial color={BG_COLOR} />
          </animated.mesh>
        )}
      </MyCamera>

      {phase === "game" && (
        <Suspense>
          <group rotation-x={-0.2} scale={scaleRatio} position-y={buttonHeight}>
            <group>
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
          </group>
        </Suspense>
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
