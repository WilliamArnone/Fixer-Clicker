import { create } from "zustand";

interface GameState {
  mission: number;
  setMission: () => void;
}

export const useGame = create<GameState>((set) => ({
  mission: 0,
  setMission: () => set((state) => ({ mission: state.mission++ })),
}));
