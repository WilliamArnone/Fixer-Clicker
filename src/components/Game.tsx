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

export default function Game() {
  const phase = useGame((state) => state.phase);

  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_TITLE);
  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_DESCRIPTION);
  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_DESCRIPTION_BOLD);

  usePhaseManager();

  return (
    <>
      <MyCamera>
        <Suspense>{phase === "idle" && <PhaseLoading />}</Suspense>
        <Suspense>{phase === "loading" && <PhaseLoading />}</Suspense>
      </MyCamera>

      <Suspense>{phase === "intro" && <PhaseIntro />}</Suspense>
      <Suspense>{phase === "game" && <PhaseGame />}</Suspense>

      <MatrixCity
        model="city1"
        rotation-x={-Math.PI * 0.5 * 0}
        position-y={0}
        color={"#1e56ff"}
      />
    </>
  );
}
