import { useGame } from "../hooks/useGame";
import { Text } from "@react-three/drei";
import useButtonsAnimations from "../hooks/useButtonAnimation";
import { forwardRef } from "react";
import MissionButton, { MissionRef } from "./MissionButton";
import { FONT_TITLE } from "../data/fonts";

interface MissionListProps extends React.ComponentPropsWithoutRef<"group"> {
  name: string;
}

const MissionList = forwardRef<MissionRef[], MissionListProps>(
  ({ name, ...props }, ref) => {
    const missions = useGame((state) => state.missions);

    const transitions = useButtonsAnimations(missions, 1);

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
        <group position={[0, -0.4, 1]} scale={1.2}>
          {transitions((style, mission) => (
            <MissionButton mission={mission} style={style} ref={ref} />
          ))}
        </group>
      </group>
    );
  },
);

export default MissionList;
