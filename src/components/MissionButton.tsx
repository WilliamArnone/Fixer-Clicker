import { a } from "@react-spring/three";
import { Text, meshBounds } from "@react-three/drei";
import { DoubleSide } from "three";
import { ButtonAnimationStyles } from "../hooks/useButtonAnimation";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useSpring } from "@react-spring/web";
import { ThreeEvent } from "@react-three/fiber";

export type MissionRef = {
  mission: string;
  setPhase: React.Dispatch<React.SetStateAction<MissionPhase>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

type MissionButtonProps = {
  mission: string;
  style: ButtonAnimationStyles;
};

type MissionPhase = "idle" | "hover" | "selected" | "assigned";

const MissionButton = forwardRef<MissionRef[], MissionButtonProps>(
  ({ style, mission }, ref) => {
    const [phase, setPhase] = useState<MissionPhase>("idle");
    const [color, setColor] = useState<string>("#ffffff");

    const interactionStyle = useSpring({
      xOffset: phase === "idle" ? 0 : phase === "hover" ? 2 : 5,
    });

    /**
     * EVENT HANDLERS
     */

    const pointerEnter = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setPhase((phase: MissionPhase) => (phase === "idle" ? "hover" : phase));
    }, []);
    const pointerLeave = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setPhase((phase: MissionPhase) => (phase === "hover" ? "idle" : phase));
    }, []);

    const click = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      setPhase((phase: MissionPhase) => {
        switch (phase) {
          case "selected":
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current = ref.current.filter(
                (miss) => miss.mission != mission,
              );
            }
            return "idle";
          case "hover":
          case "idle":
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.push({ mission, setColor, setPhase });
            }

            return "selected";

          default:
            return phase;
        }
      });
    }, []);

    return (
      <a.mesh
        rotation-x={-0.1}
        position-x={style.xOffset}
        position-y={style.yOffset}
        scale={0.1}
        onPointerEnter={pointerEnter}
        onPointerLeave={pointerLeave}
        onPointerUp={click}
      >
        <planeGeometry args={[15, 4.5]} />
        <meshBasicMaterial visible={false} />

        <a.mesh position-x={interactionStyle.xOffset}>
          <planeGeometry args={[15, 4.5]} />
          <a.meshBasicMaterial
            transparent
            side={DoubleSide}
            opacity={style.opacity}
            color={color}
          />
          <Text fontSize={1} maxWidth={13} position-z={0.1}>
            <a.meshBasicMaterial color={"red"} opacity={style.opacity} />
            {mission}
          </Text>
        </a.mesh>
      </a.mesh>
    );
  },
);

export default MissionButton;
