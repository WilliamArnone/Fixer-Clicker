const buttonHover = new Audio("/audio/Hover.ogg");
const buttonSelect = new Audio("/audio/Select.ogg");
const buttonDeselect = new Audio("/audio/Deselect.ogg");
const buttonConfirm = new Audio("/audio/Confirm.ogg");
const missionComplete = new Audio("/audio/Completed.ogg");
const missionFailed = new Audio("/audio/Fail.ogg");

buttonHover.load();
buttonSelect.load();
buttonDeselect.load();
buttonConfirm.load();
missionComplete.load();
missionFailed.load();

buttonHover.volume = 0.6;
buttonSelect.volume = 0.4;
buttonDeselect.volume = 0.4;
buttonConfirm.volume = 0.6;
missionComplete.volume = 0.6;
missionFailed.volume = 0.4;

export const PlayButtonHover = () => {
  if (buttonHover.currentTime > 0.0001 && buttonHover.currentTime < 0.07)
    return;

  buttonHover.pause();
  buttonHover.currentTime = 0;
  buttonHover.play();
};
export const PlayButtonSelect = () => {
  buttonSelect.pause();
  buttonSelect.currentTime = 0;
  buttonSelect.play();
};
export const PlayButtonDeselect = () => {
  buttonDeselect.pause();
  buttonDeselect.currentTime = 0;
  buttonDeselect.play();
};
export const PlayButtonConfirm = () => {
  buttonConfirm.pause();
  buttonConfirm.currentTime = 0;
  buttonConfirm.play();
};
export const PlayMissionCompleted = () => {
  missionComplete.pause();
  missionComplete.currentTime = 0;
  missionComplete.play();
};
export const PlayMissionFailed = () => {
  missionFailed.pause();
  missionFailed.currentTime = 0;
  missionFailed.play();
};
