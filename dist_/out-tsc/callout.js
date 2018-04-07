import { Connector } from "./connector";
import { Body } from "./body";
import { relBounds, Rect } from "./utils";
import { OffSiteIndicator } from "./offsite-indicator";
export var Callout = (function () {
    function Callout(container) {
        this._visible = false;
        this.isInViewPort = null;
        console.log('New callout');
        this._container = container != null ? container : document.body;
        this._connector = new Connector(this);
        this._body = new Body(this);
        this._offSiteIndicator = new OffSiteIndicator(this);
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
    Object.defineProperty(Callout.prototype, "offSiteHtml", {
        get: function () {
            return this._offSiteIndicator.html;
        },
        set: function (html) {
            this._offSiteIndicator.html = html;
        },
        enumerable: true,
        configurable: true
    });
    Callout.prototype.calculateLayout = function (bodyDrag) {
        this._connector.anchor.view.calculateLayout();
        if (!bodyDrag)
            this._body.view.calculateLayout();
        this._connector.weldingSeamView.calculateLayout();
        this._connector.view.calculateLayout();
    };
    Callout.prototype.updatePosition = function (bodyDrag) {
        if (bodyDrag === void 0) { bodyDrag = false; }
        this.calculateLayout(bodyDrag);
        var isAnchorInViewPort = this.isAnchorInViewPort();
        if (isAnchorInViewPort != this.isInViewPort) {
            if (isAnchorInViewPort) {
                this._connector.anchor.view.show();
                this._connector.view.show();
                this._connector.weldingSeamView.show();
                this.body.view.show();
                this._offSiteIndicator.hide();
            }
            else {
                this._connector.view.hide();
                this._connector.anchor.view.hide();
                this._connector.weldingSeamView.hide();
                this.body.view.hide();
                this._offSiteIndicator.addToStage();
                this._offSiteIndicator.calculateLayout();
                this._offSiteIndicator.show();
            }
            this.isInViewPort = isAnchorInViewPort;
        }
        if (isAnchorInViewPort) {
            this._connector.anchor.view.updateLayout();
            this._connector.view.updateLayout();
            this._connector.weldingSeamView.updateLayout();
            if (!bodyDrag)
                this.body.view.updateLayout();
        }
        else {
            this._offSiteIndicator.calculateLayout();
            this._offSiteIndicator.updateLayout();
        }
    };
    Callout.prototype.isAnchorInViewPort = function () {
        var anchorRect = this._connector.anchor.view.layoutData.rect;
        var containerRect = Rect.fromBounds(relBounds(this._container, this._container));
        //console.log(containerRect);
        //console.log(anchorRect);
        //console.log('_______________')
        return containerRect.contains(anchorRect);
    };
    Callout.prototype.show = function () {
        var _this = this;
        this._body.view.addToStage();
        this._connector.anchor.view.addToStage();
        this._connector.view.addToStage();
        this._connector.weldingSeamView.addToStage();
        this.updatePosition();
        this.connector.anchor.view.fadeIn().then(function () {
            return _this.connector.view.fadeIn();
        }).then(function () {
            return _this.connector.weldingSeamView.fadeIn();
        }).then(function () {
            return _this._body.view.fadeIn();
        });
        //this._connector.show();
        this._visible = true;
    };
    Callout.prototype.hide = function () {
        var _this = this;
        this.body.view.fadeOut().then(function () {
            return _this.connector.weldingSeamView.fadeOut();
        }).then(function () {
            return _this.connector.view.fadeOut();
        }).then(function () {
            return _this.connector.anchor.view.fadeOut();
        }).then(function () {
            _this.connector.anchor.view.removeFromStage();
        });
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