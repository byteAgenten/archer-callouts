export class BodySection {

    private _el:HTMLElement;

    constructor(private _name:string) {
        this._el = document.createElement('section');
        this._el.setAttribute('class', 'ac-body-section');
    }


    get el(): HTMLElement {
        return this._el;
    }

    get name(): string {
        return this._name;
    }

    public set content(value:string) {

        this._el.innerHTML = value;
    }

    public get content():string {
        return this._el.innerHTML;
    }
}