import {Connector} from "./connector";
import {Body} from "./body";
import {updateNotifierCheck} from "tslint/lib/updateNotifier";
import {Anchor} from "./anchor";
import {BodySection} from "./body-section";

export class Callout {

    private _container:HTMLElement;
    private _connector: Connector;
    private _body: Body;
    private _visible: boolean = false;

    constructor(container:HTMLElement) {
        console.log('New callout');
        this._container = container != null ? container : document.body;
        this._connector = new Connector(this);
        this._body = new Body(this);
    }

    get container(): HTMLElement {
        return this._container;
    }

    get body(): Body {
        return this._body;
    }

    private bind(element: HTMLElement): void {
        this._connector.anchor.element = element;
    }

    public updatePosition(bodyDrag:boolean = false): void {

        if( !bodyDrag) this._body.view.updatePosition();
        this._connector.updatePosition();
    }

    public show(): void {


        this.updatePosition();
        this.connector.anchor.view.fadeIn().then(() => {

            return this.connector.view.fadeIn();
        }).then(() => {

            return this.connector.weldingSeamView.fadeIn();
        }).then(()=> {
            console.log('yyy');
        });
        //this._connector.show();
        this._body.view.show();
        this._visible = true;
    }

    public hide(): void {

        this.connector.weldingSeamView.fadeOut().then(() => {

            return this.connector.view.fadeOut();
        }).then(() => {
            return this.connector.anchor.view.fadeOut();
        });

        this.body.view.hide();
        this._visible = false;
    }


    get visible(): boolean {
        return this._visible;
    }

    public destory(): void {

    }

    public get connector(): Connector {
        return this._connector;
    }

    public get anchorBounds() {
        return this._connector.anchor.element.getBoundingClientRect();
    }

    public get sections(): Array<BodySection> {
        return this._body.view.sections;
    }
}
