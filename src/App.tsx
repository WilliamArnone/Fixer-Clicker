import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";

import Experience from "./components/Experience";

import "./App.css";
import { Leva } from "leva";

const DEBUG = window.location.hash === "#debug";

function App() {
  return (
    <div className="absolute w-full h-screen p-0 top-0 left-0 ">
      <Leva oneLineLabels hidden={!DEBUG} />

      <Canvas>
        <Experience />
        {DEBUG && <Perf position={"top-left"} />}
      </Canvas>
    </div>
  );
}

export default App;
