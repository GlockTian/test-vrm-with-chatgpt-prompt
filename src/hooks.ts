import { VRM } from "@pixiv/three-vrm";
import { useCallback, useRef, useState } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";

const useVRM = (): [VRM | null, (url: string) => Promise<void>] => {
  const { current: loader } = useRef(new GLTFLoader());
  const [vrm, setVRM] = useState<VRM | null>(null);

  const loadVRM = useCallback(
    (url: string): Promise<void> => {
      console.log(url);

      loader.register((parser) => new VRMLoaderPlugin(parser)); // here we are installing VRMLoaderPlugin

      return new Promise((resolve: (_: GLTF) => void) =>
        loader.load(url, resolve)
      )
        .then((gltf) => gltf.userData.vrm)
        .then((vrm) => {
          vrm.scene.rotation.y = Math.PI;
          setVRM(vrm);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return [vrm, loadVRM];
};

const useToggle = (initialState: boolean): [boolean, () => void] => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((prev) => !prev), []);

  return [state, toggle];
};

export { useVRM, useToggle };
