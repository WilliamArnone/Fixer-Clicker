import { Loader } from "three";
import { preloadFont } from "troika-three-text";

export default class TroikaLoader extends Loader {
  constructor(manager) {
    super(manager);
  }

  load(url, onLoad, onProgress, onError) {
    const scope = this;

    preloadFont(
      { font: url, characters: "0123456789abcdefghijklmnopqrstuvwxyz" },
      function (payload) {
        const font = payload.parameters.font;

        if (onLoad) onLoad(font);
      },
    );
  }
}
