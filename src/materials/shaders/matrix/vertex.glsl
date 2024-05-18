varying vec3 vNormal;
varying vec3 vPosition;

varying vec2 vUV;

#include <fog_pars_vertex>

void main(){
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);
	vec4 mvPosition = viewMatrix * modelPosition;
	gl_Position = projectionMatrix * mvPosition;

	vPosition = position;//modelPosition.xyz;
	vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
	vUV = uv;
	
	#include <fog_vertex>
}