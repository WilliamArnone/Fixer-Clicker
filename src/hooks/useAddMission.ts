import { SpringRef } from "@react-spring/three";
import { useGame } from "./useGame";
import {
  AddButtonCallbackStyleRef,
  clickDistance,
  idleDistance,
} from "../components/AddButton";
import { useCallback } from "react";
import { PlayAdd, PlayError } from "../data/audioFiles";

export default function useAddMission() {
  const eurodollars = useGame((state) => state.eurodollars);
  const addMission = useGame((state) => state.addMission);

  const addMissionCallback = useCallback(
    (springAPI: SpringRef<AddButtonCallbackStyleRef>) => {
      if (eurodollars >= 100) {
        PlayAdd();
        springAPI.start({
          from: { color: "#ffff00", zDistance: clickDistance },
          to: { color: "#ffffff", zDistance: idleDistance },
        });

        addMission(true);
      } else {
        PlayError();
        springAPI.start({
          from: { color: "#ff0000", zDistance: clickDistance },
          to: { color: "#ffffff", zDistance: idleDistance },
        });
      }
    },
    [eurodollars, addMission],
  );

  return addMissionCallback;
}
