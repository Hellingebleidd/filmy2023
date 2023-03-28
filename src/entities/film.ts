
import { Clovek } from "./clovek";
import { Postava } from "./postava";

export class Film {
    constructor(
        public id: number,
        public nazov: string,
        public slovenskyNazov: string,
        public rok: number,
        public imdbID: string,
        public reziser: Clovek[],
        public postava: Postava[],
        public poradieVRebricku: { [nazovRebriscka: string]: number }
    ) { }
}