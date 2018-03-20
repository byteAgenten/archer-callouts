import {Anchor} from "./anchor";
import {ConnectorView, DefaultConnectorView} from "./connector-view";
import {Callout} from "./callout";
import {WeldingSeamView, DefaultWeldingSeamView} from "./welding-seam-view";
export class Connector {

    private _anchor:Anchor ;
    private _view:ConnectorView;
    private _weldingSeamView:WeldingSeamView;


    constructor(private _callout:Callout) {
        this._anchor = new Anchor(_callout);
        this._view = new DefaultConnectorView(_callout);
        this._weldingSeamView = new DefaultWeldingSeamView(_callout);
    }


     get view(): ConnectorView {
        return this._view;
    }


    get weldingSeamView(): WeldingSeamView {
        return this._weldingSeamView;
    }

    get anchor(): Anchor {
        return this._anchor;
    }

    get callout():Callout {
        return this.callout;
    }

    set anchor(value: Anchor) {
        this._anchor = value;
    }

    updatePosition() {


        //this.anchor.updatePosition();
        //this._view.update();
        //this._weldingSeamView.update();
    }

    public show():void {
        this.anchor.show();
        this._view.show();
        this._weldingSeamView.show();
        this.updatePosition();

    }

    public hide():void {
        this.anchor.hide();
        this._view.hide();
        this._weldingSeamView.hide();
    }
}