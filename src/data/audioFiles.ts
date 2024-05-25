const song = new Audio(
  "/audio/DavidKBD - Pink Bloom Pack - 07 - The Hidden One.ogg",
);
const buttonHover = new Audio("/audio/Hover.ogg");
const buttonSelect = new Audio("/audio/Select.ogg");
const buttonDeselect = new Audio("/audio/Deselect.ogg");
const buttonConfirm = new Audio("/audio/Confirm.ogg");
const missionComplete = new Audio("/audio/Completed.ogg");
const missionFailed = new Audio("/audio/Fail.ogg");
const Error = new Audio("/audio/Error.ogg");
const Add = new Audio("/audio/Add.ogg");
const Bass = new Audio("/audio/Intro.ogg");
const LoadingTech = new Audio("/audio/LoadingTech.ogg");
const LoadingTyping = new Audio("/audio/LoadingTyping.ogg");

buttonHover.load();
buttonSelect.load();
buttonDeselect.load();
buttonConfirm.load();
missionComplete.load();
missionFailed.load();
Error.load();
Add.load();
Bass;
LoadingTech.load();
LoadingTyping.load();
song.load();

buttonHover.volume = 0.6;
buttonSelect.volume = 0.4;
buttonDeselect.volume = 0.4;
buttonConfirm.volume = 0.6;
missionComplete.volume = 0.6;
missionFailed.volume = 0.4;
Error.volume = 0.5;
Add.volume = 0.5;
Bass.volume = 1;
LoadingTech.volume = 0.5;
LoadingTyping.volume = 0.5;
song.volume = 0.2;

export const PlaySong = () => {
  song.play();
  song.addEventListener("timeupdate", function () {
    var buffer = 0.44;
    if (song.currentTime > this.duration - buffer) {
      this.currentTime = 0;
      this.play();
    }
  });
};
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

export const PlayError = () => {
  Error.pause();
  Error.currentTime = 0;
  Error.play();
};
export const PlayAdd = () => {
  Add.pause();
  Add.currentTime = 0;
  Add.play();
};
export const PlayBass = () => {
  Bass.pause();
  Bass.currentTime = 0;
  Bass.play();
};
export const PlayLoadingTech = () => {
  LoadingTech.pause();
  LoadingTech.currentTime = 0;
  LoadingTech.play();
};
export const PlayLoadingTyping = () => {
  LoadingTyping.pause();
  LoadingTyping.currentTime = 0;
  LoadingTyping.play();
};
