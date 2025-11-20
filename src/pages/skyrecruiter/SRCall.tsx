
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {useEffect, useRef, useState} from "react";
import "./SRCall.css";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import { Altair } from "./components/altair/Altair";
import ControlTray from "./components/control-tray/ControlTray";
import cn from "classnames";
import { LiveClientOptions } from "./types";

function SRCall() {
  // this video reference is used for displaying the active stream, whether that is the webcam or screen capture
  // feel free to style as you see fit
  const videoRef = useRef<HTMLVideoElement>(null);
  // either the screen capture, the video or null, if null we hide it
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiOptions, setApiOptions] = useState<LiveClientOptions>({apiKey: ""})

  useEffect(() => {
    fetch("http://localhost:5008/token").then(async res => {
      const token = (await res.json()).token.value;
      console.log(token)
      setApiKey(token);
    })
  }, []);

  useEffect(() => {
    if(apiKey?.length) setApiOptions({
      apiKey: apiKey
    })
  }, [apiKey]);

  return (
    <>
      {apiKey?.length && apiKey.length > 0 && <LiveAPIProvider options={apiOptions}>
        <div className="streaming-console">
          {/*<SidePanel />*/}
          <main>
            <div className="main-app-area">
              <span className="waiting-to-join">
                Waiting for you to join the call ...
              </span>
              {/* APP goes here */}
              <Altair />
              <video
                  className={cn("stream", {
                    hidden: !videoRef.current || !videoStream,
                  })}
                  ref={videoRef}
                  autoPlay
                  playsInline
              />
            </div>

            <ControlTray
                videoRef={videoRef}
                supportsVideo={true}
                onVideoStreamChange={setVideoStream}
                enableEditingSettings={true}
            >
              {/* put your own buttons here */}
            </ControlTray>
          </main>
        </div>
      </LiveAPIProvider>}
    </>
  );
}

export default SRCall;
