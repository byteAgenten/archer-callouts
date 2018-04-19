var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Point, addClass } from "./utils";
export var ConnectorView = (function () {
    function ConnectorView(_callout) {
        this._callout = _callout;
        this._layoutData = new ConnectorLayoutData();
    }
    ConnectorView.prototype.addToStage = function () {
        this._callout.container.appendChild(this._connectorEl);
        if (this._callout.config.customClass != null)
            addClass(this._connectorEl, this._callout.config.customClass);
        this.hide();
        this._connectorEl.style.transform = 'scale(1)';
    };
    ConnectorView.prototype.removeFromStage = function () {
        this._connectorEl.remove();
    };
    ConnectorView.prototype.show = function () {
        this._connectorEl.style.visibility = 'visible';
    };
    ConnectorView.prototype.hide = function () {
        this._connectorEl.style.visibility = 'hidden';
    };
    Object.defineProperty(ConnectorView.prototype, "lineWidth", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    return ConnectorView;
}());
export var DefaultConnectorView = (function (_super) {
    __extends(DefaultConnectorView, _super);
    function DefaultConnectorView(_callout) {
        _super.call(this, _callout);
        this._lineWidth = 2;
        this._scaleX = 0;
        this._connectorEl = document.createElement('div');
        this._connectorEl.setAttribute('class', 'ac-connector default');
        this._lineEl = document.createElement('div');
        this._lineEl.setAttribute('class', 'line');
        this._connectorEl.appendChild(this._lineEl);
    }
    DefaultConnectorView.prototype.calculateLayout = function () {
        this._layoutData.startPoint = this._callout.connector.anchor.view.layoutData.rect.center;
        this._layoutData.endPoint = this._callout.connector.weldingSeamView.layoutData.weldPoint;
        //console.log('startPoint');
        //console.log(this._layoutData.startPoint);
        //console.log('endPoint');
        //console.log(this._layoutData.endPoint);
        //console.log('start');
        //console.log(this._layoutData.startPoint);
        //console.log('end');
        //console.log(this._layoutData.endPoint);
        var a2b = this._layoutData.endPoint.sub(this._layoutData.startPoint);
        this._layoutData.length = Math.sqrt(a2b.x * a2b.x + a2b.y * a2b.y);
        var angle = Math.asin(a2b.y / this._layoutData.length);
        if (a2b.x < 0)
            angle = (-1 * Math.PI / 2) - (Math.PI / 2 + angle);
        this._layoutData.angle = angle;
    };
    DefaultConnectorView.prototype.updateLayout = function () {
        this._lineEl.style.width = (this._layoutData.length + this.lineWidth) + 'px';
        this._connectorEl.style.left = this._layoutData.startPoint.x + 'px';
        this._connectorEl.style.top = this._layoutData.startPoint.y + 'px';
        this.setScale(1);
    };
    DefaultConnectorView.prototype.setScale = function (scaleX) {
        this._lineEl.style.transform = 'rotate(' + this._layoutData.angle + 'rad) scaleX(' + scaleX + ')';
    };
    DefaultConnectorView.prototype.animate = function (fadeIn) {
        var _this = this;
        console.log('connector fadeIn()');
        return new Promise(function (resolve, reject) {
            var startTime = Date.now();
            var endTime = startTime + 400;
            var firstRun = true;
            var loop = function () {
                if (firstRun) {
                    _this.show();
                    firstRun = false;
                }
                var now = Date.now();
                if (now < endTime) {
                    var ratio = (now - startTime) / (endTime - startTime);
                    _this._scaleX = fadeIn ? ratio : 1 - ratio;
                    requestAnimationFrame(loop);
                }
                else {
                    _this._scaleX = fadeIn ? 1 : 0;
                    resolve();
                }
                _this.setScale(_this._scaleX);
            };
            requestAnimationFrame(loop);
        });
    };
    DefaultConnectorView.prototype.fadeIn = function () {
        return this.animate(true);
    };
    DefaultConnectorView.prototype.fadeOut = function () {
        var _this = this;
        return this.animate(false).then(function () {
            _this.removeFromStage();
        });
    };
    Object.defineProperty(DefaultConnectorView.prototype, "lineWidth", {
        get: function () {
            return this._lineWidth;
        },
        enumerable: true,
        configurable: true
    });
    DefaultConnectorView.prototype.addToStage = function () {
        _super.prototype.addToStage.call(this);
        if (this._lineWidth < 0)
            this._lineWidth = this._lineEl.getBoundingClientRect().height;
    };
    DefaultConnectorView.prototype.show = function () {
        _super.prototype.show.call(this);
        this._lineEl.style.visibility = 'visible';
    };
    DefaultConnectorView.prototype.hide = function () {
        _super.prototype.hide.call(this);
        this._lineEl.style.visibility = 'hidden';
    };
    return DefaultConnectorView;
}(ConnectorView));
export var ConnectorLayoutData = (function () {
    function ConnectorLayoutData(startPoint, endPoint, angle, length) {
        if (startPoint === void 0) { startPoint = null; }
        if (endPoint === void 0) { endPoint = null; }
        if (angle === void 0) { angle = 0; }
        if (length === void 0) { length = 0; }
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.angle = angle;
        this.length = length;
        if (this.startPoint == null)
            this.startPoint = new Point();
        if (this.endPoint == null)
            this.endPoint = new Point();
    }
    return ConnectorLayoutData;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/connector-view.js.map