import {Instance, Instances} from "@react-three/drei";
import {Vector3} from "three";
import React from "react";
import {Atom} from "./Atom";
import {colorMap} from "./ColorMap";

interface ProteinAtomsProps {
    atoms: Array<Atom>;
}


export const ProteinAtoms: React.FC<ProteinAtomsProps> = ({atoms}) => {
    return (
        <Instances range={10000000000} limit={10000000}>
            <sphereGeometry/>
            <meshStandardMaterial transparent opacity={0.4}/>
            {atoms.map((atom, index) => {
                const color = colorMap[atom.resSeq % colorMap.length];
                return (
                    <Instance
                        key={index}
                        color={color}
                        scale={0.25}
                        position={new Vector3(atom.x, atom.y, atom.z)}/>
                );
            })}
        </Instances>
    );
};
