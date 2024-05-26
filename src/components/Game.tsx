import { LoaderProto, useLoader } from "@react-three/fiber";
import MatrixCity from "./MatrixCity";
import MyCamera from "./MyCamera";
import PhaseGame from "./Phases/PhaseGame";
import PhaseLoading from "./Phases/PhaseLoading";
import TroikaLoader from "../utility/TroikaLoader";
import {
  FONT_DESCRIPTION,
  FONT_DESCRIPTION_BOLD,
  FONT_TITLE,
} from "../data/fonts";
import { Suspense } from "react";
import { useGame } from "../hooks/useGame";
import PhaseIntro from "./Phases/PhaseIntro";
import usePhaseManager from "../hooks/usePhaseManager";
import PhaseIdle from "./Phases/PhaseIdle";

export default function Game() {
  const phase = useGame((state) => state.phase);

  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_TITLE);
  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_DESCRIPTION);
  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_DESCRIPTION_BOLD);

  usePhaseManager();

  return (
    <>
      <MyCamera>
        {phase === "idle" && (
          <Suspense>
            <PhaseIdle />
          </Suspense>
        )}
        {phase === "loading" && (
          <Suspense>
            <PhaseLoading />
          </Suspense>
        )}
      </MyCamera>

      {phase === "intro" && (
        <Suspense>
          <PhaseIntro />
        </Suspense>
      )}
      {phase === "game" && (
        <Suspense>
          <PhaseGame />
        </Suspense>
      )}

      <MatrixCity model="city1" rotation-x={-Math.PI * 0.5 * 0} />
    </>
  );
}
