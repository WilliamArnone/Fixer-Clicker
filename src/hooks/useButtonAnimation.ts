import { SpringValue, useTransition } from "@react-spring/three";

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
  return useTransition<any, ButtonAnimationStyles>(buttons, {
    from: (_, index) => ({
      xOffset: DISTANCE_ENTER_BUTTON * direction,
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
      xOffset: DISTANCE_ENTER_BUTTON * direction,
      opacity: 0,
    },
  });
}
