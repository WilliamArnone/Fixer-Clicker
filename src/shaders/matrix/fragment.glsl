uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

varying vec2 vUV;

#include ../lib/simplexNoise2D.glsl
//#include ../lib/simplexNoise3D.glsl

void main(){
	vec2 uScale = vec2(70, .5);
	float uSquareStep = 0.4;

	vec3 normal = normalize(vNormal);
	vec3 position = vPosition;
	vec3 cameraDIr = normalize(cameraPosition - vPosition);

	float amountUp = dot(normal, vec3(0, 1, 0));
	amountUp = smoothstep(-0.6, 0.0, amountUp);

	float amountFwd = dot(normal, vec3(0, 0, 1));
	amountFwd = smoothstep(0.3, 1.0, abs(amountFwd));

	float amountSide = dot(normal, vec3(1, 0, 0));
	amountSide = smoothstep(0.3, 1.0, abs(amountFwd));

	float amount = max(max(amountUp, amountFwd), amountSide);

	//FRESNEL
	float fresnel = smoothstep(0.4, 1.0, 1.0 - abs(dot(cameraDIr, normal)));
	fresnel = pow(fresnel, 3.0);
	fresnel = clamp(fresnel, 0.0, 1.4);


	//Squares
	vec2 squarePos = position.xz;
	squarePos.y -= uTime;
	squarePos *= uScale;

	squarePos.y += simplexNoise2D(vec2(floor(squarePos.x), 0.0)) * 2.8;

	float intensity = squarePos.y;
	squarePos = floor(squarePos);
	intensity -= squarePos.y;
	intensity = pow(intensity, 5.0);
	
	float noise = simplexNoise2D(squarePos);
	noise = step(uSquareStep, noise);

	float alpha = max(noise, 0.0) * intensity;
	//float alpha = noise * intensity * amount;
	
	alpha += fresnel;
	alpha *= amount;

	//initial animation
	alpha *= 1.0 - step(uTime - 10.0, position.z);
	alpha = max(alpha, 0.0);
	alpha *= smoothstep(-0.05, 0.1, position.y);


	//if(alpha<0.0) discard;

	vec3 col = uColor / (1.0 - intensity);
	col = clamp(col, 0.0, 1.3);
	// gl_FragColor = vec4(col, alpha * (amount) * intensity);
	gl_FragColor = vec4(col * alpha, alpha);
}


	// float circle = distance(fract(squarePos), vec2(0.5));
	// circle = smoothstep(0.5, 0.0, circle);
	// circle = pow(circle, 2.0);
	// circle -= 0.1;
	// circle = clamp(circle, 0.0, 1.2);
	// circle = 1.0;