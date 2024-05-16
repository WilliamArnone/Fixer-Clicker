import { Object3DNode, extend } from "@react-three/fiber";
import { MatrixMaterial } from "./materials/MatrixMaterial";

extend({MatrixMaterial})

declare module "@react-three/fiber" {
	interface ThreeElements {
		matrixMaterial: Object3DNode<MatrixMaterial, typeof MatrixMaterial>;
	}
}