export enum MissionDifficulty {
  Easy,
  Hard,
}

export const getMissionPrice = (money: number) => {
  if (money < 1000) return 100;
  else return Math.pow(10, Math.floor(Math.log10(money)) - 1);
};

export const getRunnerPrice = (money: number) => {
  if (money < 1000) return 100;
  else return Math.pow(10, Math.floor(Math.log10(money)) - 1);
};

export const getMissionDifficulty = () => {
  return Math.random() < 0.8 ? MissionDifficulty.Easy : MissionDifficulty.Hard;
};

export const getMissionReward = (
  money: number,
  difficulty: MissionDifficulty,
) => {
  const difficultyMultiplier = difficulty === MissionDifficulty.Easy ? 1.5 : 5;

  if (money < 1000) return 100 * difficultyMultiplier;
  else
    return (
      Math.pow(10, Math.floor(Math.log10(money)) - 1) * difficultyMultiplier
    );
};

export const getIsDead = (difficulty: MissionDifficulty) => {
  switch (difficulty) {
    case MissionDifficulty.Easy:
      return Math.random() < 0.2;
    case MissionDifficulty.Hard:
      return Math.random() < 0.7;
  }
  return false;
};
