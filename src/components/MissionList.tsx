import { useGame } from "../hooks/useGame";
import { Text } from "@react-three/drei";
import { useControls } from "leva";
import useButtonsAnimations from "../hooks/useButtonAnimation";
import { forwardRef } from "react";
import MissionButton, { MissionRef } from "./MissionButton";

interface MissionListProps extends React.ComponentPropsWithoutRef<"group"> {
  name: string;
}

const MissionList = forwardRef<MissionRef[], MissionListProps>(
  ({ name, ...props }, ref) => {
    const missions = useGame((state) => state.missions);

    const { titlePosition, buttonStartPosition } = useControls({
      titlePosition: { value: [0, 0, 1.3] },
      buttonStartPosition: { value: [0, -0.4, 1] },
    });

    const transitions = useButtonsAnimations(missions, 1);

    return (
      <group {...props}>
        <Text position={titlePosition} scale={0.1} fontSize={2}>
          {name}
        </Text>
        <group position={buttonStartPosition}>
          {transitions((style, mission) => (
            <MissionButton mission={mission} style={style} ref={ref} />
          ))}
        </group>
      </group>
    );
  },
);

export default MissionList;
