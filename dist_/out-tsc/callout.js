import { Connector } from "./connector";
import { Body } from "./body";
export var Callout = (function () {
    function Callout(container) {
        this._visible = false;
        console.log('New callout');
        this._container = container != null ? container : document.body;
        this._connector = new Connector(this);
        this._body = new Body(this);
    }
    Object.defineProperty(Callout.prototype, "container", {
        get: function () {
            return this._container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Callout.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    Callout.prototype.bind = function (element) {
        this._connector.anchor.element = element;
    };
    Callout.prototype.updatePosition = function (bodyDrag) {
        if (bodyDrag === void 0) { bodyDrag = false; }
        if (!bodyDrag)
            this._body.view.updatePosition();
        this._connector.updatePosition();
    };
    Callout.prototype.show = function () {
        var _this = this;
        this.updatePosition();
        this.connector.anchor.view.fadeIn().then(function () {
            return _this.connector.view.fadeIn();
        }).then(function () {
            return _this.connector.weldingSeamView.fadeIn();
        }).then(function () {
            console.log('yyy');
        });
        //this._connector.show();
        this._body.view.show();
        this._visible = true;
    };
    Callout.prototype.hide = function () {
        var _this = this;
        this.connector.weldingSeamView.fadeOut().then(function () {
            return _this.connector.view.fadeOut();
        }).then(function () {
            return _this.connector.anchor.view.fadeOut();
        });
        this.body.view.hide();
        this._visible = false;
    };
    Object.defineProperty(Callout.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        enumerable: true,
        configurable: true
    });
    Callout.prototype.destory = function () {
    };
    Object.defineProperty(Callout.prototype, "connector", {
        get: function () {
            return this._connector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Callout.prototype, "anchorBounds", {
        get: function () {
            return this._connector.anchor.element.getBoundingClientRect();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Callout.prototype, "sections", {
        get: function () {
            return this._body.view.sections;
        },
        enumerable: true,
        configurable: true
    });
    return Callout;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/callout.js.map