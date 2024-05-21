import Game from "./Game";
import { BG_COLOR } from "../data/theme";
import PostProcess from "./PostProcess";

export default function Experience() {
  return (
    <>
      <color attach={"background"} args={[BG_COLOR]} />
      <fog attach={"fog"} args={[BG_COLOR, 1, 20]} />

      <Game />
      <PostProcess />
    </>
  );
}
