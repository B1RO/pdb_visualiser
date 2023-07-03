import React, {useEffect, useState} from 'react';
import './App.css';
import {Scene} from './Scene';
import {Vector3} from "three";
import MatrixComponent from "./Heatmap";
import styled from "styled-components";
import {Atom} from "./Atom";
import {getAverageResidueCoordinates} from "./GetAverageResidueCoordinates";
import {ProteinIdentifierInputPage} from "./ProteinIdentifierInputPage";


function parseAtomLine(line: string): Atom {
    const recordType = line.substring(0, 6).trim();
    const atomSerial = parseInt(line.substring(6, 11).trim());
    const atomName = line.substring(12, 16).trim();
    const altLoc = line.substring(16, 17).trim();
    const resName = line.substring(17, 20).trim();
    const chainID = line.substring(21, 22).trim();
    const resSeq = parseInt(line.substring(22, 26).trim());
    const x = parseFloat(line.substring(30, 38).trim());
    const y = parseFloat(line.substring(38, 46).trim());
    const z = parseFloat(line.substring(46, 54).trim());
    const occupancy = parseFloat(line.substring(54, 60).trim());
    const tempFactor = parseFloat(line.substring(60, 66).trim());
    const element = line.substring(76, 78).trim();
    const charge = line.substring(78, 80).trim();

    return {
        recordType,
        atomSerial,
        atomName,
        altLoc,
        resName,
        chainID,
        resSeq,
        x,
        y,
        z,
        occupancy,
        tempFactor,
        element,
        charge
    };
}


function fetchPDB(identifier: string): Promise<Atom[]> {
    return fetch(`https://files.rcsb.org/download/${identifier}.pdb`)
        .then(response => response.text())
        .then(pdbText => {
            const atomLines = pdbText.split('\n').filter(line => line.startsWith('ATOM '));
            return atomLines.map(parseAtomLine);
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}


function distance(a: Vector3, b: Vector3): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2));
}


function distanceMatrix(coordinates: Array<Vector3>): Array<Array<number>> {
    let matrix: Array<Array<number>> = new Array<Array<number>>();
    for (let i = 0; i < coordinates.length; i++) {
        matrix[i] = []
        for (let j = 0; j < coordinates.length; j++) {
            matrix[i][j] = distance(coordinates[i], coordinates[j])
        }
    }
    return matrix
}


const RootDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

const Column = styled.div`
  width: 50vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

function ProteinVisualisation({atoms}: { atoms: Array<Atom> }) {
    let matrix = distanceMatrix(getAverageResidueCoordinates(atoms));
    return <RootDiv>
        <Column>
            <Scene atoms={atoms}/> :
        </Column>
        <Column>
            <MatrixComponent width={600} height={600} matrix={matrix}/>
        </Column>
    </RootDiv>
}


function App() {
    const [identifier, setIdentifier] = useState<string | null>(null)
    const [atoms, setAtoms] = useState<Array<Atom>>([]);

    useEffect(() => {
        if (identifier != null) {
            fetchPDB(identifier)
                .then(data => {
                    setAtoms(data)
                });
        }
    }, [identifier]);


    if (identifier == null) {
        return <ProteinIdentifierInputPage onSelectProteinIdentifier={identifier => setIdentifier(identifier)}/>
    } else if (atoms.length == 0) {
        return <div>Loading</div>;
    } else {
        return <ProteinVisualisation atoms={atoms}/>
    }

}

export default App;
