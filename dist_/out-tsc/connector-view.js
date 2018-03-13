var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
export var ConnectorView = (function () {
    function ConnectorView(_callout) {
        this._callout = _callout;
    }
    ConnectorView.prototype.show = function () {
        this._callout.container.appendChild(this._connectorEl);
    };
    ConnectorView.prototype.hide = function () {
        this._connectorEl.remove();
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
        this._lineWidth = -1;
        this._rad = 0;
        this._scaleX = 0;
        this._connectorEl = document.createElement('div');
        this._connectorEl.setAttribute('class', 'ac-connector default');
        this._lineEl = document.createElement('div');
        this._lineEl.setAttribute('class', 'line');
        this._connectorEl.appendChild(this._lineEl);
    }
    DefaultConnectorView.prototype.animate = function (fadeIn) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var startTime = Date.now();
            var endTime = startTime + 200;
            var loop = function () {
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
                _this.updateStyles();
            };
            requestAnimationFrame(loop);
        });
    };
    DefaultConnectorView.prototype.fadeIn = function () {
        this._scaleX = 0;
        this.updateStyles();
        this.show();
        return this.animate(true);
    };
    DefaultConnectorView.prototype.fadeOut = function () {
        var _this = this;
        return this.animate(false).then(function () {
            _this.hide();
        });
    };
    Object.defineProperty(DefaultConnectorView.prototype, "lineWidth", {
        get: function () {
            return this._lineWidth;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculates the rotation degree 0=right, PI/2=top, PI=left, 1.5PI=bottom, 2PI = right
     */
    DefaultConnectorView.prototype.calcRad = function () {
        var weldingPoint = this._callout.body.view.weldingPoint;
        //let anchorBounds = this._callout.connector.anchor.view.bounds;
        this._anchorCenterPoint = this._callout.connector.anchor.view.center;
        /*
        this._anchorCenterPoint = new Point(
            anchorBounds.left + anchorBounds.width / 2,
            anchorBounds.top + anchorBounds.height / 2
        );
        */
        var a = weldingPoint.x - this._anchorCenterPoint.x;
        var b = weldingPoint.y - this._anchorCenterPoint.y;
        var connectorLength = Math.sqrt(a * a + b * b);
        this._lineEl.style.width = (connectorLength + this.lineWidth) + 'px';
        var rad = Math.asin((weldingPoint.y - this._anchorCenterPoint.y) / connectorLength);
        if (a < 0)
            rad = (-1 * Math.PI / 2) - (Math.PI / 2 + rad);
        this._rad = rad;
    };
    DefaultConnectorView.prototype.update = function () {
        this.calcRad();
        this.updateStyles();
    };
    DefaultConnectorView.prototype.updateStyles = function () {
        this._lineEl.style.transform = 'rotate(' + this._rad + 'rad) scaleX(' + this._scaleX + ')';
        this._connectorEl.style.left = (this._anchorCenterPoint.x) + 'px';
        this._connectorEl.style.top = this._anchorCenterPoint.y + 'px';
    };
    DefaultConnectorView.prototype.show = function () {
        _super.prototype.show.call(this);
        if (this._lineWidth < 0)
            this._lineWidth = this._lineEl.getBoundingClientRect().height;
    };
    return DefaultConnectorView;
}(ConnectorView));
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/connector-view.js.map