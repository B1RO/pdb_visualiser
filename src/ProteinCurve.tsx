import {CatmullRomCurve3} from "three";
import React from "react";
import {Tube} from "@react-three/drei";
import {Atom} from "./Atom";
import {getAverageResidueCoordinates} from "./GetAverageResidueCoordinates";

interface ProteinCurveProps {
    atoms: Array<Atom>;
}


export function ProteinCurve({atoms} : ProteinCurveProps) {
    const coordinates = getAverageResidueCoordinates(atoms);
    let linePath = new CatmullRomCurve3(coordinates)

      return  <Tube args={[linePath, 1000, 0.5, 4, false]}>
          <meshStandardMaterial color="gray" metalness={0.5} roughness={0}/>
    </Tube>
};

