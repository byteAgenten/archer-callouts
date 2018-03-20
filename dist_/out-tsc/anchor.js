import { DefaultAnchorView } from "./anchor-view";
export var Anchor = (function () {
    function Anchor(_callout) {
        this._callout = _callout;
        this._shelterRadius = 50;
        this._view = new DefaultAnchorView(_callout);
    }
    Object.defineProperty(Anchor.prototype, "element", {
        get: function () {
            return this._element;
        },
        set: function (value) {
            this._element = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Anchor.prototype, "shelterRadius", {
        get: function () {
            return this._shelterRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Anchor.prototype, "view", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Anchor.prototype.show = function () {
        this._view.fadeIn();
    };
    Anchor.prototype.hide = function () {
        this._view.fadeOut();
    };
    Anchor.prototype.isTooClose = function (bounds) {
        var centerPoint = this.view.center;
        return false;
    };
    return Anchor;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/anchor.js.map