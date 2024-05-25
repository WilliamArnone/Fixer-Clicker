import { LoaderProto, useLoader } from "@react-three/fiber";
import MatrixCity from "./MatrixCity";
import MyCamera from "./MyCamera";
import PhaseGame from "./PhaseGame";
import PhaseLoading from "./PhaseLoading";
import TroikaLoader from "../hooks/TroikaLoader";
import {
  FONT_DESCRIPTION,
  FONT_DESCRIPTION_BOLD,
  FONT_TITLE,
} from "../data/fonts";
import { Suspense } from "react";

export default function Game() {
  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_TITLE);
  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_DESCRIPTION);
  useLoader(TroikaLoader as LoaderProto<unknown>, FONT_DESCRIPTION_BOLD);

  return (
    <>
      <MyCamera>
        <PhaseLoading />
      </MyCamera>

      <Suspense>
        <PhaseGame />
      </Suspense>

      <MatrixCity
        model="city1"
        rotation-x={-Math.PI * 0.5 * 0}
        position-y={0}
        color={"#1e56ff"}
      />
    </>
  );
}
