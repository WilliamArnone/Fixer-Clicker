import {
  AdditiveBlending,
  Color,
  DoubleSide,
  ShaderMaterial,
  Uniform,
} from "three";

import fragmentShader from "./shaders/matrix/fragment.glsl";
import vertexShader from "./shaders/matrix/vertex.glsl";

export class MatrixMaterial extends ShaderMaterial {
  constructor() {
    super();

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.side = DoubleSide;
    this.transparent = true;
    this.depthWrite = false;
    this.fog = true;
    this.blending = AdditiveBlending;
    this.uniforms = {
      uTime: new Uniform<number>(0),
      uColor: new Uniform<Color>(new Color()),

      fogColor: new Uniform(new Color()),
      fogDensity: new Uniform(0),
      fogNear: new Uniform(0),
      fogFar: new Uniform(0),
    };
  }

  set color(color: string) {
    this.uniforms.uColor.value.set(color);
  }
}
