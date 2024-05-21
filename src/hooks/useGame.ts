import { create } from "zustand";
import { missionNames } from "../data/missionNames";
import { randInt } from "three/src/math/MathUtils.js";
import { RunnerData, characters } from "../data/characters";

type GamePhase = "intro" | "game";
//type MissionState = "idle" | "hover" | "selected" | "assigned";

interface GameState {
  phase: GamePhase;
  runnerPool: RunnerData[];
  runners: RunnerData[];
  missionPool: string[];
  missions: string[];
}

interface GameAction {
  setPhase: (newPhase: GamePhase) => void;
  addRunner: () => RunnerData;
  removeRunner: (runner: RunnerData) => void;
  addMission: () => string;
  removeMission: (mission: string) => void;
}

const createNewAvalableRunner = (runners: RunnerData[]) =>
  characters.filter((runner) => runners.findIndex((r) => r === runner) === -1);
const createNewAvalableMissions = (missions: string[]) =>
  missionNames.filter(
    (mission) => missions.findIndex((m) => m === mission) === -1,
  );

export const useGame = create<GameState & GameAction>((set) => ({
  phase: "game",
  runnerPool: [...characters],
  runners: [],
  missionPool: [...missionNames],
  missions: [],

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

  // setMissionState: (mission, missionState) =>
  //   set((state) => ({
  //     missions: state.missions.map((miss) =>
  //       miss !== mission ? miss : { ...mission, state: missionState },
  //     ),
  //   })),

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

  // setMissionState: (mission, missionState) =>
  //   set((state) => ({
  //     missions: state.missions.map((miss) =>
  //       miss !== mission ? miss : { ...mission, state: missionState },
  //     ),
  //   })),

  removeMission: (mission) =>
    set((state) => ({
      missions: state.missions.filter((miss) => miss !== mission),
    })),
}));
