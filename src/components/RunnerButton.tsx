import { a, animated, useSpring } from "@react-spring/three";
import { Float, Text, useTexture } from "@react-three/drei";
import { ButtonAnimationStyles } from "../hooks/useButtonAnimation";
import { forwardRef, useCallback, useRef, useState } from "react";
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
import { FONT_DESCRIPTION, FONT_TITLE } from "../data/fonts";

type RunnerButtonProps = {
  index: number;
  data: RunnerData;
  style: ButtonAnimationStyles;
};

type RunnerPhase = "idle" | "hover" | "active" | "dying";

const baseGeometry = new PlaneGeometry(15, 4.5);
const overlayTopGeometry = new PlaneGeometry(5, 1.5);
const overlayBottomGeometry = new PlaneGeometry(15, 1.5);
const overlayCornerGeometry = new PlaneGeometry(0.4, 0.4);

const planeGeometry = new PlaneGeometry(1, 1);
planeGeometry.translate(0.5, 0, 0);

const AText = animated(Text);

const PROGRESS_SPEED = 1;
const MAX_PROGRESS = 10;

const RunnerButton = forwardRef<MissionRef[], RunnerButtonProps>(
  ({ style, data }, ref) => {
    const [phase, setPhase] = useState<RunnerPhase>("idle");
    const [myMissions, setMyMissions] = useState<MissionRef[]>([]);
    const [myColor, _] = useState(
      () => `hsl(${Math.floor(Math.random() * 240 + 60)}, 100%, 60%)`,
    );

    const removeMission = useGame((state) => state.removeMission);

    const interactionStyle = useSpring({
      xOffset: phase === "idle" ? 0 : phase === "hover" ? -2 : -3.5,
      overlay1Z: phase === "hover" ? 0.6 : phase === "active" ? 0.1 : 1,
      overlay2Z: phase === "hover" ? 0.9 : phase === "active" ? 0.3 : 1.2,
      overlay3Z: phase === "hover" ? 1 : phase === "active" ? 0.5 : 1.5,
    });

    /**
     * TEXTURES
     */

    const baseTexture = useTexture("/img/Runner/Base.png");

    const overlayCornerTexture = useTexture("/img/Runner/OverlayCorner.png");
    const overlayTopTexture = useTexture("/img/Runner/OverlayTop.png");
    const overlayBottomTexture = useTexture("/img/Runner/OverlayBottom.png");

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

      if (phase === "active" || phase === "dying") return;

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
        <mesh
          onPointerEnter={pointerEnter}
          onPointerLeave={pointerLeave}
          geometry={baseGeometry}
        >
          <meshBasicMaterial visible={false} />
        </mesh>

        <a.mesh
          position-x={interactionStyle.xOffset}
          onPointerDown={click}
          geometry={baseGeometry}
        >
          <a.meshBasicMaterial
            transparent
            color={myColor}
            opacity={style.opacity}
            map={baseTexture}
          />

          <Float rotationIntensity={0} speed={3} floatingRange={[0, 0.2]}>
            <a.mesh
              geometry={overlayTopGeometry}
              position={[5, 1.2, 0]}
              position-z={interactionStyle.overlay3Z}
            >
              <a.meshBasicMaterial
                transparent
                color={myColor}
                opacity={style.opacity}
                map={overlayTopTexture}
                depthWrite={false}
              />
            </a.mesh>
          </Float>

          <Float rotationIntensity={0} speed={3} floatingRange={[0, 0.2]}>
            <a.mesh
              geometry={overlayBottomGeometry}
              position={[0, -2, 0]}
              position-z={interactionStyle.overlay3Z}
            >
              <a.meshBasicMaterial
                transparent
                color={myColor}
                opacity={style.opacity}
                depthWrite={false}
                map={overlayBottomTexture}
              />

              {phase !== "active" && (
                <Text
                  fontSize={0.85}
                  maxWidth={13}
                  font={FONT_TITLE}
                  position={[0, 0, 0.5]}
                >
                  <a.meshBasicMaterial
                    color={"white"}
                    opacity={style.opacity}
                  />
                  READY
                </Text>
              )}

              {phase === "active" && (
                <Text
                  fontSize={0.85}
                  maxWidth={13}
                  font={FONT_TITLE}
                  position={[-3, 0, 0.5]}
                >
                  <a.meshBasicMaterial
                    color={"white"}
                    opacity={style.opacity}
                  />
                  PROGRESS
                </Text>
              )}

              <mesh
                scale={[0, 0, 0]}
                ref={progressBar}
                position={[-5.5, -2, 1]}
                geometry={planeGeometry}
              >
                <meshBasicMaterial color={"white"} />
              </mesh>
            </a.mesh>
          </Float>

          <Float rotationIntensity={0} speed={3} floatingRange={[0, 0.2]}>
            <a.mesh
              geometry={overlayCornerGeometry}
              position={[-7.4, 2.2, 0]}
              position-z={interactionStyle.overlay1Z}
            >
              <a.meshBasicMaterial
                transparent
                color={myColor}
                opacity={style.opacity}
                depthWrite={false}
                map={overlayCornerTexture}
              />
            </a.mesh>
          </Float>

          <Float rotationIntensity={0} speed={3} floatingRange={[0, 0.2]}>
            <a.mesh
              geometry={overlayCornerGeometry}
              position={[7.6, -2.6, 0]}
              position-z={interactionStyle.overlay1Z}
              rotation-z={Math.PI}
            >
              <a.meshBasicMaterial
                transparent
                color={myColor}
                opacity={style.opacity}
                map={overlayCornerTexture}
              />
            </a.mesh>
          </Float>

          <AText
            fontSize={0.85}
            maxWidth={13}
            position-z={interactionStyle.overlay2Z}
            font={FONT_TITLE}
            position={[-2, 1.3, 0]}
          >
            <a.meshBasicMaterial color={"white"} opacity={style.opacity} />
            {data.name}
          </AText>

          <AText
            position={[-0.3, -0.3, 0]}
            fontSize={0.5}
            maxWidth={13}
            position-z={interactionStyle.overlay2Z}
            font={FONT_DESCRIPTION}
          >
            <a.meshBasicMaterial color={"white"} opacity={style.opacity} />
            {data.description}
          </AText>
        </a.mesh>
      </a.group>
    );
  },
);

export default RunnerButton;
