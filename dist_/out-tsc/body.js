import { DefaultBodyView } from "./body-view";
export var Body = (function () {
    function Body(_callout) {
        this._callout = _callout;
        this._view = new DefaultBodyView(_callout);
    }
    Object.defineProperty(Body.prototype, "view", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "bounds", {
        get: function () {
            return this._view.bounds;
        },
        enumerable: true,
        configurable: true
    });
    return Body;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/body.js.map