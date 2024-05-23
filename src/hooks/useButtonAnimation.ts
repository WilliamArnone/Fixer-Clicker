import { SpringValue, useTransition } from "@react-spring/three";
import { useThree } from "@react-three/fiber";

export type ButtonAnimationStyles = {
  yOffset: SpringValue<number>;
  xOffset: SpringValue<number>;
  opacity: SpringValue<number>;
};

export const DISTANCE_BETWEEN_BUTTON = 0.5;
export const DISTANCE_ENTER_BUTTON = 0.2;

export default function useButtonsAnimations(
  buttons: any[],
  direction: number,
) {
  const size = useThree((state) => state.size);
  const amount = Math.min(size.width / size.height, 1);

  return useTransition<any, ButtonAnimationStyles>(buttons, {
    from: (_, index) => ({
      xOffset: DISTANCE_ENTER_BUTTON * direction * amount,
      yOffset: -index * DISTANCE_BETWEEN_BUTTON,
      opacity: 0,
    }),
    enter: (_, index) => ({
      xOffset: 0,
      yOffset: -index * DISTANCE_BETWEEN_BUTTON,
      opacity: 1,
    }),
    update: (_, index) => ({
      xOffset: 0,
      yOffset: -index * DISTANCE_BETWEEN_BUTTON,
    }),
    leave: {
      xOffset: DISTANCE_ENTER_BUTTON * direction * amount,
      opacity: 0,
    },
  });
}
