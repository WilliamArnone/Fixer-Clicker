varying vec3 vNormal;
varying vec3 vPosition;

varying vec2 vUV;

void main(){
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * viewMatrix * modelPosition;

	vPosition = position;//modelPosition.xyz;
	vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
	vUV = uv;
}