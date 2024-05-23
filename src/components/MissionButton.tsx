import { a, animated, useSpring } from "@react-spring/three";
import { Float, Text, useTexture } from "@react-three/drei";
import { DoubleSide, PlaneGeometry } from "three";
import { ButtonAnimationStyles } from "../hooks/useButtonAnimation";
import { forwardRef, useCallback, useRef, useState } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { DEFAULT_BUTTON_BG } from "../data/theme";
import {
  PlayButtonDeselect,
  PlayButtonHover,
  PlayButtonSelect,
} from "../data/audioFiles";
import { FONT_DESCRIPTION_BOLD } from "../data/fonts";

export type MissionRef = {
  mission: string;
  difficulty: number;
  setPhase: React.Dispatch<React.SetStateAction<MissionPhase>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

type MissionButtonProps = {
  mission: string;
  style: ButtonAnimationStyles;
};

type MissionPhase = "idle" | "hover" | "selected" | "assigned";

const AText = animated(Text);

const baseGeometry = new PlaneGeometry(15, 4.5);
const overlayCornerGeometry = new PlaneGeometry(2, 2);
const overlayAimGeometry = new PlaneGeometry(3, 3);

const generateMission = () => {
  return Math.round(Math.random());
};

useTexture.preload("/img/Mission/Base1.png");
useTexture.preload("/img/Mission/Base2.png");
useTexture.preload("/img/Mission/OverlayCorner.png");
useTexture.preload("/img/Mission/OverlayAim.png");

const MissionButton = forwardRef<MissionRef[], MissionButtonProps>(
  ({ style, mission }, ref) => {
    const [phase, setPhase] = useState<MissionPhase>("idle");
    const [color, setColor] = useState<string>(DEFAULT_BUTTON_BG);

    const difficulty = useRef(generateMission());

    const size = useThree((state) => state.size);
    const amount = Math.min((size.width / size.height) * 0.5, 1);

    const interactionStyle = useSpring({
      xOffset: (phase === "idle" ? 0 : phase === "hover" ? 2 : 3.5) * amount,
      overlay1Z: phase === "hover" ? 0.6 : phase === "idle" ? 1 : 0.1,
      overlay2Z: phase === "hover" ? 0.9 : phase === "idle" ? 1.2 : 0.3,
      overlay3Z: phase === "hover" ? 1 : phase === "idle" ? 1.5 : 0.5,
    });

    /**
     * TEXTURES
     */

    const baseTexture = [
      useTexture("/img/Mission/Base1.png"),
      useTexture("/img/Mission/Base2.png"),
    ];
    const overlayCornerTexture = useTexture("/img/Mission/OverlayCorner.png");
    const overlayAimTexture = useTexture("/img/Mission/OverlayAim.png");

    /**
     * EVENT HANDLERS
     */

    const pointerEnter = useCallback(
      (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (phase === "idle") PlayButtonHover();
        setPhase((phase: MissionPhase) => (phase === "idle" ? "hover" : phase));
      },
      [phase],
    );
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
            PlayButtonDeselect();
            return "idle";
          case "hover":
          case "idle":
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.push({
                mission,
                difficulty: difficulty.current,
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
            map={baseTexture[difficulty.current]}
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
                map={overlayCornerTexture}
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
                map={overlayCornerTexture}
              />
            </a.mesh>
          </Float>

          <a.mesh
            geometry={overlayAimGeometry}
            position={[6.4, 1, 0]}
            position-z={2}
            scale={1.5}
          >
            <a.meshBasicMaterial
              transparent
              side={DoubleSide}
              depthWrite={false}
              opacity={style.opacity}
              color={color}
              map={overlayAimTexture}
            />
            <a.mesh
              geometry={overlayAimGeometry}
              position-z={interactionStyle.overlay1Z}
              scale={0.5}
            >
              <a.meshBasicMaterial
                transparent
                side={DoubleSide}
                depthWrite={false}
                opacity={style.opacity}
                color={color}
                map={overlayAimTexture}
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
            {mission}
          </AText>
        </a.mesh>
      </a.group>
    );
  },
);

export default MissionButton;
