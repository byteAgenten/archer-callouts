import "./callout-manager.scss";
import {Callout} from "./callout";


export class CalloutManager {

    private callouts: Array<Callout> = [];

    constructor() {
    }

    public create(container:HTMLElement= null): Callout {
        return new Callout(container);
    }
}