import { useGame } from "../hooks/useGame";
import { Text } from "@react-three/drei";
import { useControls } from "leva";
import useButtonsAnimations from "../hooks/useButtonAnimation";
import RunnerButton from "./RunnerButton";
import { forwardRef } from "react";
import { MissionRef } from "./MissionButton";
import { FONT_TITLE } from "../data/fonts";

interface RunnerListProps extends React.ComponentPropsWithoutRef<"group"> {
  name: string;
}

const RunnerList = forwardRef<MissionRef[], RunnerListProps>(
  ({ name, ...props }, ref) => {
    const runners = useGame((state) => state.runners);

    const { titlePosition, buttonStartPosition } = useControls({
      titlePosition: { value: [0, 0.1, 1.3] },
      buttonStartPosition: { value: [0, 3.4, 1] },
    });

    const transitions = useButtonsAnimations(runners, -1);

    return (
      <group {...props}>
        <Text
          position={titlePosition}
          scale={0.1}
          fontSize={2.5}
          font={FONT_TITLE}
        >
          {name}
        </Text>
        <group position={buttonStartPosition} scale={1.4}>
          {transitions((style, runners, _, index) => (
            <RunnerButton
              index={index}
              data={runners}
              style={style}
              ref={ref}
            />
          ))}
        </group>
      </group>
    );
  },
);

export default RunnerList;
