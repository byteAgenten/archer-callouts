import { Anchor } from "./anchor";
import { DefaultConnectorView } from "./connector-view";
import { DefaultWeldingSeamView } from "./welding-seam-view";
export var Connector = (function () {
    function Connector(_callout) {
        this._callout = _callout;
        this._anchor = new Anchor(_callout);
        this._view = new DefaultConnectorView(_callout);
        this._weldingSeamView = new DefaultWeldingSeamView(_callout);
    }
    Object.defineProperty(Connector.prototype, "view", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "weldingSeamView", {
        get: function () {
            return this._weldingSeamView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "anchor", {
        get: function () {
            return this._anchor;
        },
        set: function (value) {
            this._anchor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "callout", {
        get: function () {
            return this.callout;
        },
        enumerable: true,
        configurable: true
    });
    Connector.prototype.updatePosition = function () {
        this.anchor.updatePosition();
        this._view.update();
        this._weldingSeamView.update();
    };
    Connector.prototype.show = function () {
        this.anchor.show();
        this._view.show();
        this._weldingSeamView.show();
        this.updatePosition();
    };
    Connector.prototype.hide = function () {
        this.anchor.hide();
        this._view.hide();
        this._weldingSeamView.hide();
    };
    return Connector;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/connector.js.map