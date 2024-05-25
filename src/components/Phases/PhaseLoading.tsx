import { Text } from "@react-three/drei";
import { FONT_DESCRIPTION } from "../../data/fonts";
import useResponsiveness from "../../hooks/useResponsiveness";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { code } from "../../data/loginCode";
import { Group } from "three";
import {
  PlayLoadingTech,
  PlayLoadingTyping,
  StopLoadingSounds,
} from "../../data/audioFiles";
import { useGame } from "../../hooks/useGame";
const animate = async () => {
  PlayLoadingTyping();

  await new Promise((resolve) => setTimeout(resolve, 4600));

  PlayLoadingTech();
  PlayLoadingTyping();

  await new Promise((resolve) => setTimeout(resolve, 7500));

  StopLoadingSounds();

  useGame.getState().setPhase("intro");
};

export default function PhaseLoading() {
  const [scaleFactor] = useResponsiveness();
  const [chars, setChars] = useState(0);
  const charRef = useRef(0);
  const textRef = useRef<Group>(null!);

  useEffect(() => {
    animate();
  }, []);

  useFrame((_, delta) => {
    const speed = chars < 40 ? 10 : chars < 700 ? 100 : 1000;
    const yOffset = chars < 300 ? 0 : chars < 700 ? 0.2 : 1;

    charRef.current += delta * speed;
    const newChars = Math.floor(charRef.current);
    if (newChars !== chars) setChars(newChars);

    textRef.current.position.y += yOffset * delta;
  });

  return (
    <group position-z={-1} scale={scaleFactor * 0.8}>
      <Text
        position-x={-0.85}
        anchorX={"left"}
        anchorY={"top"}
        font={FONT_DESCRIPTION}
        scale={0.05}
        ref={textRef}
        color={"#8fabff"}
      >
        {code.substring(0, chars)}
      </Text>
    </group>
  );
}
