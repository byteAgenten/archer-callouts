/**
 * Created by matthias on 18.04.18.
 */
export class CalloutConfig {

    private _customClass:string;

    private _offsetX:number = 50;

    private _offsetY:number = -50;

    private _anchorX:number = 0.5;

    private _anchorY:number = 0.5;

    private _userDraggingAllowed:boolean = true;

    private _offSiteIndicatorEnabled:boolean = true;

    private _tryToKeepInViewbox:boolean = true;


    get customClass(): string {
        return this._customClass;
    }

    set customClass(value: string) {
        this._customClass = value;
    }


    get offsetX(): number {
        return this._offsetX;
    }

    set offsetX(value: number) {
        this._offsetX = value;
    }

    get offsetY(): number {
        return this._offsetY;
    }

    set offsetY(value: number) {
        this._offsetY = value;
    }

    get anchorX(): number {
        return this._anchorX;
    }

    set anchorX(value: number) {
        this._anchorX = value;
    }

    get anchorY(): number {
        return this._anchorY;
    }

    set anchorY(value: number) {
        this._anchorY = value;
    }

    get userDraggingAllowed(): boolean {
        return this._userDraggingAllowed;
    }

    set userDraggingAllowed(value: boolean) {
        this._userDraggingAllowed = value;
    }

    get offSiteIndicatorEnabled(): boolean {
        return this._offSiteIndicatorEnabled;
    }

    set offSiteIndicatorEnabled(value: boolean) {
        this._offSiteIndicatorEnabled = value;
    }

    get tryToKeepInViewbox(): boolean {
        return this._tryToKeepInViewbox;
    }

    set tryToKeepInViewbox(value: boolean) {
        this._tryToKeepInViewbox = value;
    }
}