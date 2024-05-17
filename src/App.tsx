import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";

import Experience from "./components/Experience";

import "./App.css";
import { Leva } from "leva";

function App() {
  return (
    <div className="absolute w-full h-screen p-0 top-0 left-0 ">
      <Leva oneLineLabels />

      <Canvas
        camera={{
          position: [0, 0, 3],
        }}
      >
        <Experience />
        <Perf position={"top-left"} />
      </Canvas>
    </div>
  );
}

export default App;
