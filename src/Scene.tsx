import React from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera, ContactShadows, Tube} from "@react-three/drei";
import {CatmullRomCurve3, Curve, CurvePath, LineCurve3, Vector3} from "three";
import {Atom} from "./Atom";
import {ProteinCurve} from "./ProteinCurve";
import {ProteinAtoms} from "./ProteinAtoms";

interface SceneProps {
    atoms: Array<Atom>;
}


export function Scene({atoms}: SceneProps) {

    return (
        <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 5]}/>
            <ambientLight intensity={0.5}/>
            <directionalLight
                castShadow
                position={[2.5, 8, 5]}
                intensity={1.5}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            <ContactShadows
                rotation-x={Math.PI / 2}
                position={[0, -0.8, 0]}
                opacity={0.6}
                width={10}
                height={10}
                blur={1}
                far={1}
            />
            <ProteinCurve atoms={atoms}/>
            <ProteinAtoms atoms={atoms}/>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true}/>
        </Canvas>
    );
}
