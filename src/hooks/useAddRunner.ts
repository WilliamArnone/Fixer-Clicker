import { useCallback } from "react";
import { useGame } from "./useGame";
import { SpringRef } from "@react-spring/three";
import { AddButtonCallbackStyleRef } from "../components/AddButton";

export default function useAddRunner() {
  const eurodollars = useGame((state) => state.eurodollars);
  const addRunner = useGame((state) => state.addRunner);

  const addRunnerCallback = useCallback(
    (springAPI: SpringRef<AddButtonCallbackStyleRef>) => {
      if (eurodollars > 100) {
        springAPI.start({
          from: { color: "#ffff00", zDistance: 0.01 },
          to: { color: "#ffffff", zDistance: 0.06 },
        });

        addRunner();
      } else {
        //play error sound
        springAPI.start({
          from: { color: "#ff0000", zDistance: 0.01 },
          to: { color: "#ffffff", zDistance: 0.06 },
        });
      }
    },
    [eurodollars, addRunner],
  );

  return addRunnerCallback;
}
