import { a } from "@react-spring/three";
import { Text, meshBounds } from "@react-three/drei";
import { DoubleSide } from "three";
import { ButtonAnimationStyles } from "../hooks/useButtonAnimation";
import { forwardRef, useCallback, useState } from "react";
import { useSpring } from "@react-spring/web";
import { RunnerData } from "../data/characters";
import { ThreeEvent } from "@react-three/fiber";
import { MissionRef } from "./MissionButton";

type RunnerButtonProps = {
  data: RunnerData;
  style: ButtonAnimationStyles;
};

type RunnerPhase = "idle" | "hover" | "active";

const RunnerButton = forwardRef<MissionRef[], RunnerButtonProps>(
  ({ style, data }, ref) => {
    const [phase, setPhase] = useState<RunnerPhase>("idle");
    const [myMissions, setMyMissions] = useState<MissionRef[]>([]);

    const interactionStyle = useSpring({
      xOffset: phase === "idle" ? 0 : phase === "hover" ? -2 : -5,
    });

    /**
     * EVENT HANDLERS
     */

    const pointerEnter = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setPhase((phase: RunnerPhase) => (phase === "idle" ? "hover" : phase));
    }, []);

    const pointerLeave = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setPhase((phase: RunnerPhase) => (phase === "hover" ? "idle" : phase));
    }, []);

    const click = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      if (phase === "active") return;

      if (
        ref &&
        typeof ref !== "function" &&
        ref.current &&
        ref.current.length > 0
      ) {
        setMyMissions([...ref.current]);
        setPhase("active");
        for (const missionRef of ref.current) {
          missionRef.setPhase("assigned");
          missionRef.setColor("#ff0000");
        }
        ref.current = [];
      }
    }, []);

    return (
      <a.mesh
        rotation-x={-0.1}
        position-x={style.xOffset}
        position-y={style.yOffset}
        scale={0.1}
        onPointerEnter={pointerEnter}
        onPointerLeave={pointerLeave}
        onPointerDown={click}
      >
        <planeGeometry args={[15, 4.5]} />
        <meshBasicMaterial visible={false} />

        <a.mesh position-x={interactionStyle.xOffset}>
          <planeGeometry args={[15, 4.5]} />
          <a.meshBasicMaterial
            transparent
            side={DoubleSide}
            opacity={style.opacity}
          />
          <Text fontSize={1} maxWidth={13} position-z={0.1}>
            <a.meshBasicMaterial color={"red"} opacity={style.opacity} />
            {data.name}
          </Text>
        </a.mesh>
      </a.mesh>
    );
  },
);

export default RunnerButton;
