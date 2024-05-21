import { a } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { ButtonAnimationStyles } from "../hooks/useButtonAnimation";
import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { useSpring } from "@react-spring/web";
import { RunnerData } from "../data/characters";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { MissionRef } from "./MissionButton";
import { Mesh, PlaneGeometry } from "three";
import { useGame } from "../hooks/useGame";
import {
  PlayButtonConfirm,
  PlayButtonHover,
  PlayMissionCompleted,
} from "../data/audioFiles";

type RunnerButtonProps = {
  index: number;
  data: RunnerData;
  style: ButtonAnimationStyles;
};

type RunnerPhase = "idle" | "hover" | "active";

const progressBarGeometry = new PlaneGeometry(1, 1);
progressBarGeometry.translate(0.5, 0, 0);

const PROGRESS_SPEED = 1;
const MAX_PROGRESS = 10;

const RunnerButton = forwardRef<MissionRef[], RunnerButtonProps>(
  ({ index, style, data }, ref) => {
    const [phase, setPhase] = useState<RunnerPhase>("idle");
    const [myMissions, setMyMissions] = useState<MissionRef[]>([]);
    const myColor = useMemo(
      () => `hsl(${Math.floor((index * 110) % 360)}, 100%, 60%)`,
      [],
    );
    console.log(myColor);
    const removeMission = useGame((state) => state.removeMission);

    const interactionStyle = useSpring({
      xOffset: phase === "idle" ? 0 : phase === "hover" ? -1.5 : -2,
    });

    /**
     * LOGIC
     */

    const progressBar = useRef<Mesh>(null);
    useFrame((_, delta) => {
      if (!progressBar === null || progressBar.current === null) return;

      if (phase !== "active") {
        progressBar.current.scale.x = 0;
        return;
      }

      let progress = progressBar.current.scale.x + delta * PROGRESS_SPEED;

      if (progress >= MAX_PROGRESS) {
        progress = 0;

        const missions = [...myMissions];
        const missionRef = missions[0];
        missions.splice(0, 1);

        removeMission(missionRef.mission);
        PlayMissionCompleted();

        if (missions.length === 0) setPhase("idle");

        setMyMissions(missions);
      }

      progressBar.current.scale.x = progress;
    });

    /**
     * EVENT HANDLERS
     */

    const pointerEnter = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (phase === "idle") PlayButtonHover();
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
        PlayButtonConfirm();
        for (const missionRef of ref.current) {
          missionRef.setPhase("assigned");
          missionRef.setColor(myColor);
        }
        ref.current = [];
      }
    }, []);

    return (
      <a.group
        position-x={style.xOffset}
        position-y={style.yOffset}
        scale={0.1}
      >
        <mesh onPointerEnter={pointerEnter} onPointerLeave={pointerLeave}>
          <planeGeometry args={[15, 4.5]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        <a.mesh position-x={interactionStyle.xOffset} onPointerDown={click}>
          <planeGeometry args={[15, 4.5]} />
          <a.meshBasicMaterial
            transparent
            color={myColor}
            opacity={style.opacity}
          />
          <Text fontSize={1} maxWidth={13} position-z={0.1}>
            <a.meshBasicMaterial color={"white"} opacity={style.opacity} />
            {data.name}
          </Text>
          <mesh
            scale={[0, 1, 1]}
            ref={progressBar}
            position={[-5.5, -2, 1]}
            geometry={progressBarGeometry}
          >
            <meshBasicMaterial color={"white"} />
          </mesh>
        </a.mesh>
      </a.group>
    );
  },
);

export default RunnerButton;
