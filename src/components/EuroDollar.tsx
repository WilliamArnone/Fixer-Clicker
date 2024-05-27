import React, { useEffect, useRef } from "react";
import { useGame } from "../hooks/useGame";
import { Text } from "@react-three/drei";
import { a, useSpring, config } from "@react-spring/three";
import { FONT_TITLE } from "../data/fonts";

function numberWithSpacesFloat(x: number) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

function EuroDollarsToLabel(eurodollars: number) {
  if (eurodollars < 1000) return eurodollars.toString();
  else if (eurodollars < 1000000)
    return `${numberWithSpacesFloat(Math.floor(eurodollars / 100) / 10)}K`;
  else
    return `${numberWithSpacesFloat(Math.floor(eurodollars / 100000) / 10)}B`;
}

export default function EuroDollar(
  props: React.ComponentPropsWithoutRef<"group">,
) {
  const eurodollars = useGame((state) => state.eurodollars);
  const prevEuroDollars = useRef(eurodollars);

  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.slow,
  });

  const [anim, api] = useSpring(() => ({ from: { color: "#ffffff" }, to: {} }));

  useEffect(() => {
    if (eurodollars > prevEuroDollars.current) {
      api.start({
        from: { color: "#00ff00" },
        to: { color: "#ffffff" },
        config: config.slow,
      });
    } else if (eurodollars < prevEuroDollars.current) {
      api.start({
        from: { color: "#ff0000" },
        to: { color: "#ffffff" },
        config: config.slow,
      });
    }
    prevEuroDollars.current = eurodollars;
  }, [eurodollars]);
  return (
    <group {...props}>
      <Text font={FONT_TITLE} characters="0123456789€$">
        {EuroDollarsToLabel(eurodollars)} €$
        <a.meshBasicMaterial opacity={style.opacity} color={anim.color} />
      </Text>
    </group>
  );
}
