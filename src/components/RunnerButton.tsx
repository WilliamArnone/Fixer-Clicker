import { a, animated, useSpring } from "@react-spring/three";
import { Float, Text, useCursor, useTexture } from "@react-three/drei";
import { ButtonAnimationStyles } from "../hooks/useButtonAnimation";
import { forwardRef, useCallback, useRef, useState } from "react";
import { RunnerData } from "../data/characters";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { MissionRef } from "./MissionButton";
import { PlaneGeometry } from "three";
import { useGame } from "../hooks/useGame";
import {
  PlayButtonConfirm,
  PlayButtonHover,
  PlayMissionCompleted,
} from "../data/audioFiles";
import { FONT_DESCRIPTION, FONT_TITLE } from "../data/fonts";
import { DEFAULT_BUTTON_BG } from "../data/theme";
import RunnerProgress from "./RunnerProgress";
import { getIsDead } from "../data/economy";

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

useTexture.preload("/img/Runner/Base.png");
useTexture.preload("/img/Runner/OverlayCorner.png");
useTexture.preload("/img/Runner/OverlayTop.png");
useTexture.preload("/img/Runner/OverlayBottom.png");

const RunnerButton = forwardRef<MissionRef[], RunnerButtonProps>(
  ({ style, data }, ref) => {
    const [phase, setPhase] = useState<RunnerPhase>("idle");
    const [myMissions, setMyMissions] = useState<MissionRef[]>([]);
    const [myColor, setMyColor] = useState(
      () => `hsl(${Math.floor(Math.random() * 240 + 60)}, 100%, 40%)`,
    );

    const [hover, setHover] = useState(false);
    useCursor(hover);

    const removeMission = useGame((state) => state.removeMission);
    const removeRunner = useGame((state) => state.removeRunner);
    const triggerGlitch = useGame((state) => state.triggerGlitch);

    const size = useThree((state) => state.size);
    const amount = Math.min((size.width / size.height) * 0.5, 1);

    const interactionStyle = useSpring({
      xOffset: (phase === "idle" ? 0 : phase === "hover" ? -2 : -3.5) * amount,
      overlay1Z: phase === "hover" ? 0.8 : phase === "idle" ? 1.5 : 0.1,
      overlay2Z: phase === "hover" ? 1.2 : phase === "idle" ? 2 : 0.3,
      overlay3Z: phase === "hover" ? 1.6 : phase === "idle" ? 2.5 : 0.5,
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

    const progress = useRef(0);
    useFrame((_, delta) => {
      if (phase !== "active") {
        progress.current = 0;
        return;
      }

      let newprogress = progress.current + delta * PROGRESS_SPEED;

      if (newprogress >= MAX_PROGRESS) {
        newprogress = 0;

        const missions = [...myMissions];
        const missionRef = missions[0];

        if (getIsDead(missionRef.mission.difficulty)) {
          triggerGlitch();

          for (const ref of missions) {
            ref.setColor(DEFAULT_BUTTON_BG);
            ref.setPhase("idle");
          }

          setPhase("dying");
          setMyColor("#ff0000");

          setTimeout(() => {
            removeRunner(data);
          }, 3000);
        } else {
          missions.splice(0, 1);

          removeMission(missionRef.mission);
          PlayMissionCompleted();

          if (missions.length === 0) setPhase("idle");

          setMyMissions(missions);
        }
      }

      progress.current = newprogress;
    });

    /**
     * EVENT HANDLERS
     */

    const pointerEnter = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setPhase((phase: RunnerPhase) => {
        if (phase !== "idle") return phase;

        PlayButtonHover();
        setHover(true);
        return "hover";
      });
    }, []);

    const pointerLeave = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setPhase((phase: RunnerPhase) => {
        setHover(false);
        if (phase !== "hover") return phase;

        return "idle";
      });
    }, []);

    const click = useCallback(
      (e: ThreeEvent<PointerEvent>) => {
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
          setHover(false);
          for (const missionRef of ref.current) {
            missionRef.setPhase("assigned");
            missionRef.setColor(myColor);
          }
          ref.current = [];
        }
      },
      [phase],
    );

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

              {phase !== "dying" && phase !== "active" && (
                <Text
                  fontSize={0.85}
                  maxWidth={13}
                  font={FONT_TITLE}
                  position={[0, 0, 0.5]}
                  characters="abcdefghijklmnopqrstuvwxyz,."
                >
                  <a.meshBasicMaterial
                    color={"white"}
                    opacity={style.opacity}
                  />
                  READY
                </Text>
              )}

              {phase === "dying" && (
                <Text
                  fontSize={0.85}
                  maxWidth={13}
                  font={FONT_TITLE}
                  position={[0, 0, 0.5]}
                  characters="abcdefghijklmnopqrstuvwxyz,."
                >
                  <a.meshBasicMaterial
                    color={"white"}
                    opacity={style.opacity}
                  />
                  DEAD
                </Text>
              )}

              {phase === "active" && (
                <Text
                  fontSize={0.85}
                  maxWidth={13}
                  font={FONT_TITLE}
                  position={[-3, 0, 0.5]}
                  characters="abcdefghijklmnopqrstuvwxyz,."
                >
                  <a.meshBasicMaterial
                    color={"white"}
                    opacity={style.opacity}
                  />
                  PROGRESS
                  <RunnerProgress ref={progress} style={style} position-x={4} />
                </Text>
              )}
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
