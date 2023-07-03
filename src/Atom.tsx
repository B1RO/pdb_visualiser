export interface Atom {
    recordType: string;
    atomSerial: number;
    atomName: string;
    altLoc: string;
    resName: string;
    chainID: string;
    resSeq: number;
    x: number;
    y: number;
    z: number;
    occupancy: number;
    tempFactor: number;
    element: string;
    charge: string;
}
