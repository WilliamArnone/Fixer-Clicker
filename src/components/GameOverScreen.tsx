import { a, useSpring } from "@react-spring/three";
import { useGame } from "../hooks/useGame";
import { getMissionPrice, getRunnerPrice } from "../data/economy";
import { Text, useCursor, useTexture } from "@react-three/drei";
import { FONT_DESCRIPTION, FONT_TITLE } from "../data/fonts";
import { simplePlaneGeometry } from "../data/geometries";
import { useCallback, useEffect, useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { PlayButtonConfirm } from "../data/audioFiles";

export default function GameOverScreen() {
  const missions = useGame((state) => state.missions);
  const runners = useGame((state) => state.runners);
  const eurodollars = useGame((state) => state.eurodollars);

  const [hover, setHover] = useState(false);
  useCursor(hover);

  const baseTexture = useTexture("/img/GameOver/Base.png");
  const buttonTexture = useTexture("/img/GameOver/Button.png");

  const [groupStyle, groupApi] = useSpring(() => ({
    yOffset: -1.2,
    opacity: 1,
  }));
  const [buttonStyle, buttonApi] = useSpring(() => ({
    color: "#ff0000",
    scale: 1,
    zDistance: 0.15,
  }));

  const show =
    (missions.length === 0 || runners.length === 0) &&
    eurodollars < getMissionPrice(eurodollars) &&
    eurodollars < getRunnerPrice(eurodollars);

  useEffect(() => {
    if (show) {
      groupApi.start({
        from: {
          yOffset: -2,
          opacity: 0,
        },
        to: {
          yOffset: -1.2,
          opacity: 1,
        },
      });
    }
  }, [show]);

  const prevent = useCallback((e: ThreeEvent<any>) => {
    e.stopPropagation();
  }, []);

  const pointerEnter = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(true);
    buttonApi.start({
      color: "#ff7777",
      scale: 1,
      zDistance: 0.1,
    });
  }, []);
  const pointerLeave = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(false);
    buttonApi.start({
      color: "#ff0000",
      scale: 1,
      zDistance: 0.15,
    });
  }, []);
  const click = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    PlayButtonConfirm();
    buttonApi.start({
      from: {
        color: "#ffffff",
        scale: 0.9,
        zDistance: 0.05,
      },
      to: {
        color: "#ff0000",
        scale: 1.2,
        zDistance: 0.15,
      },
      onResolve: () => useGame.getState().reset(),
    });
  }, []);

  return (
    <>
      {show && (
        <a.group position-z={2} position-y={groupStyle.yOffset} scale={3}>
          <mesh
            geometry={simplePlaneGeometry}
            scale={[1.1, 0.5, 1]}
            onPointerEnter={prevent}
            onPointerLeave={prevent}
            onPointerUp={prevent}
          >
            <a.meshBasicMaterial
              transparent
              depthWrite={false}
              map={baseTexture}
              opacity={groupStyle.opacity}
            />
          </mesh>
          <a.group scale={buttonStyle.scale}>
            <mesh
              geometry={simplePlaneGeometry}
              scale={[0.4, 0.15, 1]}
              position={[0, -0.1, 0.1]}
              onPointerEnter={pointerEnter}
              onPointerLeave={pointerLeave}
              onPointerUp={click}
            >
              <a.meshBasicMaterial
                transparent
                depthWrite={false}
                map={buttonTexture}
                opacity={groupStyle.opacity}
                color={buttonStyle.color}
              />
            </mesh>
            <a.group position-z={buttonStyle.zDistance}>
              <Text scale={0.07} font={FONT_TITLE} position={[0, -0.1, 0]}>
                <a.meshBasicMaterial transparent opacity={groupStyle.opacity} />
                Restart
              </Text>
            </a.group>
          </a.group>

          <Text scale={0.08} font={FONT_DESCRIPTION} position={[0, 0.1, 0.07]}>
            <a.meshBasicMaterial transparent opacity={groupStyle.opacity} />
            You ran out of eurodollars...
          </Text>
        </a.group>
      )}
    </>
  );
}
