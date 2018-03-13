import {BodyView, DefaultBodyView} from "./body-view";
import {Callout} from "./callout";

export class Body {

    private _view:BodyView;

    constructor(private _callout:Callout) {

        this._view = new DefaultBodyView(_callout);
    }

    public get view():BodyView {
        return this._view;
    }


    public get bounds():ClientRect {
        return this._view.bounds;
    }




}