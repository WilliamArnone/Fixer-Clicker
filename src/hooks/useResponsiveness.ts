import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo } from "react";

export default function useResponsiveness() {
  /**
   * CONTROLS
   */
  const { scaleFactor, scaleMin, widthFactor, widthMin } = useControls(
    "Resolution",
    {
      scaleFactor: { value: 0.16, min: 0, max: 2 },
      scaleMin: { value: 0.38, min: 0, max: 2 },
      widthFactor: { value: 1.3, min: 0, max: 2 },
      widthMin: { value: 0.72, min: 0, max: 2 },
    },
  );

  /**
   * RESPONSIVENESS
   */
  const { size } = useThree();
  return useMemo(() => {
    return [
      (size.width / size.height) * scaleFactor + scaleMin,
      (size.width / size.height) * widthFactor + widthMin,
    ];
  }, [size, scaleFactor, widthFactor, scaleMin, widthMin]);
}
