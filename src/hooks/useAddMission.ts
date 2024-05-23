import { SpringRef } from "@react-spring/three";
import { useGame } from "./useGame";
import { AddButtonCallbackStyleRef } from "../components/AddButton";
import { useCallback } from "react";

export default function useAddMission() {
  const eurodollars = useGame((state) => state.eurodollars);
  const addMission = useGame((state) => state.addMission);

  const addMissionCallback = useCallback(
    (springAPI: SpringRef<AddButtonCallbackStyleRef>) => {
      if (eurodollars > 100) {
        springAPI.start({
          from: { color: "#ffff00", zDistance: 0.01 },
          to: { color: "#ffffff", zDistance: 0.06 },
        });

        addMission();
      } else {
        //play error sound
        springAPI.start({
          from: { color: "#ff0000", zDistance: 0.01 },
          to: { color: "#ffffff", zDistance: 0.06 },
        });
      }
    },
    [eurodollars, addMission],
  );

  return addMissionCallback;
}
