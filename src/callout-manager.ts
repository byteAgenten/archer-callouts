import "./callout-manager.scss";
import {Callout} from "./callout";


export class CalloutManager {

    private callouts: Array<Callout> = [];

    constructor() {
    }

    public create(): Callout {
        return new Callout();
    }
}