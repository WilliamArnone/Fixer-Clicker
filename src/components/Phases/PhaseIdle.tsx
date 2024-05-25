import { Html, Text, useCursor, useTexture } from "@react-three/drei";
import { simplePlaneGeometry } from "../../data/geometries";
import useResponsiveness from "../../hooks/useResponsiveness";
import { useCallback, useState } from "react";
import { useGame } from "../../hooks/useGame";
import { a, useSpring } from "@react-spring/three";
import { PlayButtonConfirm } from "../../data/audioFiles";
import {
  FONT_DESCRIPTION,
  FONT_DESCRIPTION_BOLD,
  FONT_TITLE,
} from "../../data/fonts";
import { BLUE } from "../../data/theme";

useTexture.preload("/img/Start/Enter.png");

export default function PhaseIdle() {
  const enterTexture = useTexture("/img/Start/Enter.png");
  const [scaleFactor] = useResponsiveness();
  const [enabled, setEnabled] = useState(true);

  const [hover, setHover] = useState(false);
  useCursor(hover);
  const [showCredits, setShowCredits] = useState(false);

  const [spring, api] = useSpring(() => ({
    from: {
      scale: 1,
      opacity: 1,
      color: "#ffffff",
    },
  }));

  const click = useCallback(() => {
    if (showCredits) return;
    PlayButtonConfirm();
    api.start({
      from: { scale: 1.1, color: BLUE },
      to: { color: "#ffffff", scale: 0.8, opacity: 0 },
      onResolve: () => {
        setEnabled(false);
        setTimeout(() => useGame.getState().setPhase("loading"), 1000);
      },
    });
  }, []);

  const pointerEnter = useCallback(() => {
    api.start({ color: BLUE });
  }, []);

  const pointerLeave = useCallback(() => {
    api.start({ color: "#ffffff" });
  }, []);

  return !enabled ? null : (
    <group position-z={-1} scale={scaleFactor * 0.8}>
      <group position={[0, 0.7, 0]}>
        <Text
          scale={0.1}
          maxWidth={30}
          position={[0, 0.3, 0]}
          font={FONT_TITLE}
        >
          <a.meshBasicMaterial
            color={"yellow"}
            transparent
            opacity={spring.opacity}
          />
          WARNING
        </Text>
        <Text
          scale={0.06}
          maxWidth={30}
          textAlign="center"
          font={FONT_DESCRIPTION}
        >
          <a.meshBasicMaterial
            transparent
            opacity={spring.opacity}
            color={"yellow"}
          />
          The following content contains flashing lights and rapid image
          transitions that may cause discomfort or trigger seizures for
          individuals with photosensitive epilepsy. Viewer discretion is
          advised.
        </Text>
      </group>

      <Text
        scale={0.1}
        maxWidth={30}
        position={[0, -0.8, 0]}
        font={FONT_DESCRIPTION_BOLD}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={() => setShowCredits(true)}
      >
        <a.meshBasicMaterial
          color={BLUE}
          transparent
          opacity={spring.opacity}
        />
        CREDITS
      </Text>

      {showCredits && (
        <Html
          center
          className="text-sm lg:w-max lg:text-md bg-zinc-800 flex flex-col p-5 rounded-md space-y-11"
        >
          <div className="flex flex-col space-y-5 max-h-96 overflow-y-scroll p-5">
            <h2 className="self-center text-md md:text-lg mb-4 font-bold">
              MUSIC & SFXs
            </h2>
            <span>
              The Hidden One by DavidKBD - Pink Bloom Pack --
              https://davidkbd.itch.io/pink-bloom-synthwave-music-pack
            </span>
            <span>
              E Guitar Glitch by Rizzard -- https://freesound.org/s/560784/ --
              License: Creative Commons 0
            </span>
            <span>
              Synth Stab 1 by Erokia -- https://freesound.org/s/422517/ --
              License: Attribution 4.0
            </span>
            <span>
              Sci-Fi Sound Effect - Designed Circuits - Sfx 02 by GregorQuendel
              -- https://freesound.org/s/732604/ -- License: Attribution
              NonCommercial 4.0
            </span>
            <span>
              electronic hit.mp3 by Rvgerxini -- https://freesound.org/s/479945/
              -- License: Creative Commons 0
            </span>
            <span>
              Button_Hover by BaggoNotes -- https://freesound.org/s/721504/ --
              License: Creative Commons 0
            </span>
            <span>
              Sci-Fi Two-Part Click by Jofae -- https://freesound.org/s/382574/
              -- License: Creative Commons 0
            </span>
            <span>
              SFX_COMPUTER_KEYBOARD_TYPING by 1LOVE --
              https://freesound.org/s/669828/ -- License: Attribution 4.0
            </span>
            <span>
              down bass qgsound by QG-Sound -- https://freesound.org/s/575862/
              -- License: Attribution NonCommercial 4.0
            </span>
            <span>
              Future computer HZA 01-08-2021.wav by hz37 --
              https://freesound.org/s/581759/ -- License: Creative Commons 0
            </span>
            <span>
              Button_Click2 by BaggoNotes -- https://freesound.org/s/721503/ --
              License: Creative Commons 0
            </span>
            <span>
              Tech Glitch 14 Hi Error by The-Sacha-Rush --
              https://freesound.org/s/657812/ -- License: Creative Commons 0
            </span>
          </div>
          <button onClick={() => setShowCredits(false)}>Close</button>
        </Html>
      )}

      <a.group scale={spring.scale}>
        <mesh
          scale={[1.8, 0.5, 1]}
          geometry={simplePlaneGeometry}
          onPointerEnter={pointerEnter}
          onPointerLeave={pointerLeave}
          onPointerUp={click}
        >
          <a.meshBasicMaterial
            transparent
            map={enterTexture}
            color={spring.color}
            opacity={spring.opacity}
          />
        </mesh>
      </a.group>
    </group>
  );
}
