import { useGame } from "../hooks/useGame";
import { Text } from "@react-three/drei";
import useButtonsAnimations from "../hooks/useButtonAnimation";
import RunnerButton from "./RunnerButton";
import { Suspense, forwardRef } from "react";
import { MissionRef } from "./MissionButton";
import { FONT_TITLE } from "../data/fonts";

interface RunnerListProps extends React.ComponentPropsWithoutRef<"group"> {
  name: string;
}

const RunnerList = forwardRef<MissionRef[], RunnerListProps>(
  ({ name, ...props }, ref) => {
    const runners = useGame((state) => state.runners);

    const transitions = useButtonsAnimations(runners, -1);

    return (
      <group {...props}>
        <Text
          position={[0, 0.1, 1.3]}
          scale={0.1}
          fontSize={2.5}
          font={FONT_TITLE}
          characters="abcdefghijklmnopqrstuvwxyz,."
        >
          {name}
        </Text>
        <Suspense>
          <group position={[0, -0.4, 1]} scale={1.4}>
            {transitions((style, runners, _, index) => (
              <RunnerButton
                index={index}
                data={runners}
                style={style}
                ref={ref}
              />
            ))}
          </group>
        </Suspense>
      </group>
    );
  },
);

export default RunnerList;
