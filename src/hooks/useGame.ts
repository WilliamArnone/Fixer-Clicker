import { create } from "zustand";
import { missionNames } from "../data/missionNames";
import { randInt } from "three/src/math/MathUtils.js";
import { RunnerData, characters } from "../data/characters";
import { PlayMissionFailed } from "../data/audioFiles";
import {
  MissionDifficulty,
  getMissionDifficulty,
  getMissionPrice,
  getMissionReward,
} from "../data/economy";

type GamePhase = "loading" | "intro" | "game";

export type MissionData = {
  name: string;
  reward: number;
  difficulty: MissionDifficulty;
};

interface GameState {
  phase: GamePhase;
  eurodollars: number;
  runnerPool: RunnerData[];
  runners: RunnerData[];
  missionPool: string[];
  missions: MissionData[];
  glitch: boolean;
  glitchTimeout: number;
}

interface GameAction {
  setPhase: (newPhase: GamePhase) => void;
  addRunner: (pay: boolean) => RunnerData;
  removeRunner: (runner: RunnerData) => void;
  addMission: (pay: boolean) => MissionData;
  removeMission: (mission: MissionData) => void;
  triggerGlitch: () => void;
}

const createNewAvalableRunner = (runners: RunnerData[]) =>
  characters.filter((runner) => runners.findIndex((r) => r === runner) === -1);
const createNewAvalableMissions = (missions: MissionData[]) =>
  missionNames.filter(
    (mission) => missions.findIndex((m) => m.name === mission) === -1,
  );

export const useGame = create<GameState & GameAction>((set) => ({
  phase: "loading",
  eurodollars: 500,
  runnerPool: [...characters],
  runners: [],
  missionPool: [...missionNames],
  missions: [],
  glitch: false,

  setPhase: (newPhase: GamePhase) => set(() => ({ phase: newPhase })),

  addRunner: (pay: boolean) => {
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
        eurodollars:
          state.eurodollars - (pay ? getMissionPrice(state.eurodollars) : 0),
      };
    });

    return newRunner;
  },

  removeRunner: (runner) =>
    set((state) => ({
      runners: state.runners.filter((r) => r !== runner),
    })),

  addMission: (pay: boolean) => {
    let newMission: MissionData = null!;

    set((state) => {
      //if all the missions are active do nothing
      if (state.missions.length === missionNames.length) return {};

      //if the available mission list is empty create e new one with only the available names
      const newPool =
        state.missionPool.length === 0
          ? createNewAvalableMissions(state.missions)
          : state.missionPool;

      const missionIndex = randInt(0, newPool.length - 1);
      newMission = {
        name: newPool[missionIndex],
        difficulty: getMissionDifficulty(),
        reward: 0,
      };
      newMission.reward = getMissionReward(
        state.eurodollars,
        newMission.difficulty,
      );

      newPool.splice(missionIndex, 1);

      return {
        missions: [...state.missions, newMission],
        missionPool: newPool,
        eurodollars:
          state.eurodollars - (pay ? getMissionPrice(state.eurodollars) : 0),
      };
    });

    return newMission;
  },

  removeMission: (mission) =>
    set((state) => ({
      missions: state.missions.filter((miss) => miss !== mission),
      eurodollars: state.eurodollars + mission.reward,
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
