import {Atom} from "./Atom";
import {Vector3} from "three";

function averageCoordinates(coordinates: Vector3[], numElements: number): Vector3[] {
    const averagedCoordinates: Vector3[] = [];

    for (let i = 0; i < coordinates.length; i += numElements) {
        const elements = coordinates.slice(i, i + numElements);
        const summed: Vector3 = elements.reduce(
            (acc: Vector3, curr: Vector3) => new Vector3(acc.x + curr.x, acc.y + curr.y, acc.z + curr.z)
        );

        averagedCoordinates.push(new Vector3(summed.x / numElements, summed.y / numElements, summed.z / numElements));
    }

    return averagedCoordinates;
}

function groupAtomsByResSeq(atoms: Atom[]): Map<number, Atom[]> {
    const groupedAtoms = new Map<number, Atom[]>();

    atoms.forEach(atom => {
        if (groupedAtoms.has(atom.resSeq)) {
            groupedAtoms.get(atom.resSeq)!.push(atom);
        } else {
            groupedAtoms.set(atom.resSeq, [atom]);
        }
    });

    return groupedAtoms;
}

function calculateAverageCoordinates(atoms: Atom[]): Vector3 {
    const sum = new Vector3();

    atoms.forEach(atom => {
        sum.add(new Vector3(atom.x, atom.y, atom.z));
    });

    const count = atoms.length;
    sum.divideScalar(count);

    return sum;
}

export function getAverageResidueCoordinates(atoms: Array<Atom>) {
    const groupedAtoms = groupAtomsByResSeq(atoms);
    const averageCoordinates: Vector3[] = [];
    return [...groupedAtoms.values()].map((atoms => calculateAverageCoordinates(atoms)))
}
