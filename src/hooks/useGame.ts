import { create } from "zustand";
import { missionNames } from "../data/missionNames";
import { randInt } from "three/src/math/MathUtils.js";
import { RunnerData, characters } from "../data/characters";
import { PlayMissionFailed } from "../data/audioFiles";

type GamePhase = "loading" | "intro" | "game";

interface GameState {
  phase: GamePhase;
  eurodollars: number;
  runnerPool: RunnerData[];
  runners: RunnerData[];
  missionPool: string[];
  missions: string[];
  glitch: boolean;
  glitchTimeout: number;
}

interface GameAction {
  setPhase: (newPhase: GamePhase) => void;
  addRunner: () => RunnerData;
  removeRunner: (runner: RunnerData) => void;
  addMission: () => string;
  removeMission: (mission: string, difficulty: number) => void;
  triggerGlitch: () => void;
}

const createNewAvalableRunner = (runners: RunnerData[]) =>
  characters.filter((runner) => runners.findIndex((r) => r === runner) === -1);
const createNewAvalableMissions = (missions: string[]) =>
  missionNames.filter(
    (mission) => missions.findIndex((m) => m === mission) === -1,
  );

export const useGame = create<GameState & GameAction>((set) => ({
  phase: "loading",
  eurodollars: 150,
  runnerPool: [...characters],
  runners: [],
  missionPool: [...missionNames],
  missions: [],
  glitch: false,

  setPhase: (newPhase: GamePhase) => set(() => ({ phase: newPhase })),

  addRunner: () => {
    let newRunner: RunnerData = null!;

    set((state) => {
      //if all the missions are active do nothing
      if (state.runners.length === characters.length) return {};

      //if the available mission list is empty create e new one with only the available names
      const newPool =
        state.runnerPool.length === 0
          ? createNewAvalableRunner(state.runners)
          : state.runnerPool;

      const runnerIndex = randInt(0, newPool.length - 1);
      (newRunner = newPool[runnerIndex]), newPool.splice(runnerIndex, 1);

      return {
        runners: [...state.runners, newRunner],
        runnerPool: newPool,
      };
    });

    return newRunner;
  },

  removeRunner: (runner) =>
    set((state) => ({
      runners: state.runners.filter((r) => r !== runner),
    })),

  addMission: () => {
    let newMission: string = null!;

    set((state) => {
      //if all the missions are active do nothing
      if (state.missions.length === missionNames.length) return {};

      //if the available mission list is empty create e new one with only the available names
      const newPool =
        state.missionPool.length === 0
          ? createNewAvalableMissions(state.missions)
          : state.missionPool;

      const missionIndex = randInt(0, newPool.length - 1);
      (newMission = newPool[missionIndex]), newPool.splice(missionIndex, 1);

      return {
        missions: [...state.missions, newMission],
        missionPool: newPool,
      };
    });

    return newMission;
  },

  removeMission: (mission, difficulty) =>
    set((state) => ({
      missions: state.missions.filter((miss) => miss !== mission),
      eurodollars: state.eurodollars + 50 * Math.pow(2, difficulty + 1),
    })),

  glitchTimeout: -1,

  triggerGlitch: () =>
    set((state) => {
      clearTimeout(state.glitchTimeout);
      PlayMissionFailed();

      return {
        glitch: true,
        glitchTimeout: setTimeout(() => {
          set(() => ({ glitch: false, glitchTimeout: -1 }));
        }, 2000),
      };
    }),
}));
