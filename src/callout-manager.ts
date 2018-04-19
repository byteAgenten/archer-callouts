import "./callout-manager.scss";
import {Callout} from "./callout";
import {CalloutConfig} from "./callout-config";


export class CalloutManager {

    private callouts: Array<Callout> = [];

    constructor() {
    }

    public create(container:HTMLElement= null, config:CalloutConfig = null): Callout {
        return new Callout(container, config);
    }
}