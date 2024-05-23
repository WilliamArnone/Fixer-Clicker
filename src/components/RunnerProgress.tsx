import { Matrix4, PlaneGeometry } from "three";
import { ButtonAnimationStyles } from "../hooks/useButtonAnimation";
import React, { forwardRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { a, useSpring, config } from "@react-spring/three";

interface RunnerProgressProps extends React.ComponentPropsWithoutRef<"group"> {
  style: ButtonAnimationStyles;
}

const barGeometry = new PlaneGeometry(1, 1);
barGeometry.translate(0.5, 0, 0);
const translation = new Matrix4();
translation.makeShear(0, 0, 1, 0, 0, 0);
barGeometry.applyMatrix4(translation);

const RunnerProgress = forwardRef<number, RunnerProgressProps>(
  ({ style, ...props }, ref) => {
    const [amount, setAmount] = useState(0);

    const blink = useSpring({
      from: { opacity: 1 },
      to: { opacity: 0 },
      //to: [{ opacity: 0 }, { opacity: 1 }],
      config: { mass: 50, friction: 26, tension: 155, clamp: true },
      loop: true,
    });

    useFrame(() => {
      if (!ref || typeof ref === "function" || ref.current === null) return;

      const newAmount = Math.floor(ref.current / 2);
      if (amount != newAmount) setAmount(newAmount);
    });

    return (
      <group {...props}>
        {[...Array(amount)].map((_, index) => (
          <mesh position-x={index * 1.1} key={index}>
            <primitive object={barGeometry} />
            <a.meshBasicMaterial opacity={style.opacity} />
          </mesh>
        ))}
        <mesh position-x={amount * 1.1}>
          <primitive object={barGeometry} />
          <a.meshBasicMaterial
            transparent
            depthWrite={false}
            opacity={blink.opacity}
          />
        </mesh>
      </group>
    );
  },
);

export default RunnerProgress;
