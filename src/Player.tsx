import "./player.css";

import { useEffect, useRef, useState } from "react";

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from "@vidstack/react";

import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

import { textTracks } from "./tracks";

export function Player() {
  let player = useRef<MediaPlayerInstance>(null),
    [src, setSrc] = useState("");

  useEffect(() => {
    setSrc(
      "https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine-hls/hls.m3u8"
    );

    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', paused);
      // console.log('is audio view?', '->', viewType === 'audio');
    });
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {
        emeEnabled: true,
        drmSystems: {
          "com.widevine.alpha": {
            licenseUrl: "https://cwip-shaka-proxy.appspot.com/no_auth",
          },
        },
      };
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(
    detail: MediaCanPlayDetail,
    nativeEvent: MediaCanPlayEvent
  ) {
    // ...
  }

  return (
    <>
      <MediaPlayer
        className="player"
        title="Sprite Fight"
        src={src}
        crossOrigin
        playsInline
        autoPlay
        onProviderChange={onProviderChange}
        onCanPlay={onCanPlay}
        ref={player}
      >
        <MediaProvider>
          {textTracks.map((track) => (
            <Track {...track} key={track.src} />
          ))}
        </MediaProvider>

        {/* Layouts */}
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout icons={defaultLayoutIcons}/>
      </MediaPlayer>
    </>
  );
}
