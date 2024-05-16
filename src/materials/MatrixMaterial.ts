import { AdditiveBlending, Color, DoubleSide, ShaderMaterial, Uniform } from "three";

import fragmentShader from '../shaders/matrix/fragment.glsl'
import vertexShader from '../shaders/matrix/vertex.glsl'

export class MatrixMaterial extends ShaderMaterial{
	constructor(){
		super()

		this.vertexShader = vertexShader
		this.fragmentShader = fragmentShader
		this.side = DoubleSide
		this.transparent = true
		this.depthWrite = false
		this.blending = AdditiveBlending
		this.uniforms={
			uTime : new Uniform<number>(0),
			uColor : new Uniform<Color>(new Color())
		}
	}

	set color(color : string){
		this.uniforms.uColor.value.set(color)
	}
}