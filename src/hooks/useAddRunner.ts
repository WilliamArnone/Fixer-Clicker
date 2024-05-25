import { useCallback } from "react";
import { useGame } from "./useGame";
import { SpringRef } from "@react-spring/three";
import {
  AddButtonCallbackStyleRef,
  clickDistance,
  idleDistance,
} from "../components/AddButton";
import { PlayAdd, PlayError } from "../data/audioFiles";

export default function useAddRunner() {
  const eurodollars = useGame((state) => state.eurodollars);
  const addRunner = useGame((state) => state.addRunner);

  const addRunnerCallback = useCallback(
    (springAPI: SpringRef<AddButtonCallbackStyleRef>) => {
      if (eurodollars >= 100) {
        PlayAdd();
        springAPI.start({
          from: { color: "#ffff00", zDistance: clickDistance },
          to: { color: "#ffffff", zDistance: idleDistance },
        });

        addRunner(true);
      } else {
        PlayError();
        springAPI.start({
          from: { color: "#ff0000", zDistance: clickDistance },
          to: { color: "#ffffff", zDistance: idleDistance },
        });
      }
    },
    [eurodollars, addRunner],
  );

  return addRunnerCallback;
}
