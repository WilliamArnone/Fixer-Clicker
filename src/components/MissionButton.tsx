import { a, animated, useSpring } from "@react-spring/three";
import { Float, Text, useCursor, useTexture } from "@react-three/drei";
import { DoubleSide, Mesh, PlaneGeometry, Texture } from "three";
import { ButtonAnimationStyles } from "../hooks/useButtonAnimation";
import { forwardRef, useCallback, useRef, useState } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { DEFAULT_BUTTON_BG } from "../data/theme";
import {
  PlayButtonDeselect,
  PlayButtonHover,
  PlayButtonSelect,
} from "../data/audioFiles";
import { FONT_DESCRIPTION_BOLD } from "../data/fonts";
import { MissionData } from "../hooks/useGame";
import { MissionDifficulty } from "../data/economy";

export type MissionRef = {
  mission: MissionData;
  setPhase: React.Dispatch<React.SetStateAction<MissionPhase>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

type MissionButtonProps = {
  mission: MissionData;
  style: ButtonAnimationStyles;
};

type MissionPhase = "idle" | "hover" | "selected" | "assigned";

const AText = animated(Text);

const baseGeometry = new PlaneGeometry(15, 4.5);
const overlayCornerGeometry = new PlaneGeometry(2, 2);
const overlayAimGeometry = new PlaneGeometry(3, 3);

useTexture.preload("/img/Mission/Base1.png");
useTexture.preload("/img/Mission/Base2.png");
useTexture.preload("/img/Mission/OverlayCorner.png");
useTexture.preload("/img/Mission/OverlayAim.png");

const MissionButton = forwardRef<MissionRef[], MissionButtonProps>(
  ({ style, mission }, ref) => {
    const [phase, setPhase] = useState<MissionPhase>("idle");
    const [color, setColor] = useState<string>(DEFAULT_BUTTON_BG);
    const [hover, setHover] = useState(false);
    useCursor(hover);

    const size = useThree((state) => state.size);
    const amount = Math.min((size.width / size.height) * 0.5, 1);

    const aim1 = useRef<Mesh>(null!);
    const aim2 = useRef<Mesh>(null!);

    /**
     * ANIMATIONS
     */

    const interactionStyle = useSpring({
      xOffset: (phase === "idle" ? 0 : phase === "hover" ? 2 : 3.5) * amount,
      overlay1Z: phase === "hover" ? 0.8 : phase === "idle" ? 1.5 : 0.2,
      overlay2Z: phase === "hover" ? 1.2 : phase === "idle" ? 2 : 0.5,
      overlay3Z: phase === "hover" ? 1.6 : phase === "idle" ? 2.5 : 0.8,
      overlayAim: phase === "hover" ? 3 : phase === "idle" ? 4 : 2,
    });

    useFrame((_, delta) => {
      if (phase === "assigned") {
        aim1.current.rotation.z += delta;
        aim2.current.rotation.z -= delta * 2;
      }
    });

    /**
     * TEXTURES
     */

    const baseTextureEasy = useTexture("/img/Mission/Base1.png");
    const baseTextureHard = useTexture("/img/Mission/Base2.png");
    const overlayCornerTexture = useTexture("/img/Mission/OverlayCorner.png");
    const overlayAimTexture = useTexture("/img/Mission/OverlayAim.png");

    const baseMissionTexture : Texture = mission.difficulty === MissionDifficulty.Easy
                ? baseTextureEasy
                : baseTextureHard;
    /**
     * EVENT HANDLERS
     */

    const pointerEnter = useCallback(
      (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setPhase((phase: MissionPhase) => {
          setHover(phase !== "assigned");

          if (phase === "idle") PlayButtonHover();

          if (phase !== "idle") return phase;

          return "hover";
        });
      },
      [phase],
    );
    const pointerLeave = useCallback((e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setPhase((phase: MissionPhase) => {
        setHover(false);
        if (phase !== "hover") return phase;

        return "idle";
      });
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
            PlayButtonDeselect();
            return "idle";
          case "hover":
          case "idle":
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.push({
                mission,
                setColor,
                setPhase,
              });
            }
            PlayButtonSelect();
            return "selected";

          default:
            return phase;
        }
      });
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
          onPointerUp={click}
          geometry={baseGeometry}
        >
          <a.meshBasicMaterial
            transparent
            side={DoubleSide}
            opacity={style.opacity}
            color={color}
            depthWrite={false}
            map={baseMissionTexture as any}
          />

          <Float rotationIntensity={0} speed={3} floatingRange={[0, 0.2]}>
            <a.mesh
              geometry={overlayCornerGeometry}
              position={[-6.4, 1.3, 0]}
              position-z={interactionStyle.overlay3Z}
            >
              <a.meshBasicMaterial
                transparent
                side={DoubleSide}
                opacity={style.opacity}
                color={color}
                depthWrite={false}
                map={overlayCornerTexture as any}
              />
            </a.mesh>
          </Float>

          <Float rotationIntensity={0} speed={3} floatingRange={[0, 0.2]}>
            <a.mesh
              geometry={overlayCornerGeometry}
              position={[-6.4, -1.3, 0]}
              rotation-z={Math.PI / 2}
              position-z={interactionStyle.overlay3Z}
            >
              <a.meshBasicMaterial
                transparent
                side={DoubleSide}
                opacity={style.opacity}
                color={color}
                depthWrite={false}
                map={overlayCornerTexture as any}
              />
            </a.mesh>
          </Float>

          <a.mesh
            geometry={overlayAimGeometry}
            position={[6.4, 1, 0]}
            position-z={interactionStyle.overlayAim}
            scale={1.5}
            ref={aim1}
            // rotation-z={aimRotation.rotationClock}
          >
            <a.meshBasicMaterial
              transparent
              side={DoubleSide}
              depthWrite={false}
              opacity={style.opacity}
              color={color}
              map={overlayAimTexture as any}
            />
            <a.mesh
              geometry={overlayAimGeometry}
              position-z={interactionStyle.overlay1Z}
              scale={0.5}
              ref={aim2}
              // rotation-z={aimRotation.rotationCounterClock}
            >
              <a.meshBasicMaterial
                transparent
                side={DoubleSide}
                depthWrite={false}
                opacity={style.opacity}
                color={color}
                map={overlayAimTexture as any}
              />
            </a.mesh>
          </a.mesh>

          <AText
            fontSize={1}
            maxWidth={13}
            font={FONT_DESCRIPTION_BOLD}
            position-z={interactionStyle.overlay2Z}
            fontWeight={3000}
          >
            <a.meshBasicMaterial color={"white"} opacity={style.opacity} />
            {mission.name}
          </AText>
        </a.mesh>
      </a.group>
    );
  },
);

export default MissionButton;
