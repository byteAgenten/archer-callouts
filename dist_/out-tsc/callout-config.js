/**
 * Created by matthias on 18.04.18.
 */
export var CalloutConfig = (function () {
    function CalloutConfig() {
        this._xOffset = 50;
        this._yOffset = -50;
        this._anchorX = 0.5;
        this._anchorY = 0.5;
        this._userDraggingAllowed = true;
        this._offSiteIndicatorEnabled = true;
        this._tryToKeepInViewbox = true;
    }
    Object.defineProperty(CalloutConfig.prototype, "customClass", {
        get: function () {
            return this._customClass;
        },
        set: function (value) {
            this._customClass = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalloutConfig.prototype, "xOffset", {
        get: function () {
            return this._xOffset;
        },
        set: function (value) {
            this._xOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalloutConfig.prototype, "yOffset", {
        get: function () {
            return this._yOffset;
        },
        set: function (value) {
            this._yOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalloutConfig.prototype, "anchorX", {
        get: function () {
            return this._anchorX;
        },
        set: function (value) {
            this._anchorX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalloutConfig.prototype, "anchorY", {
        get: function () {
            return this._anchorY;
        },
        set: function (value) {
            this._anchorY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalloutConfig.prototype, "userDraggingAllowed", {
        get: function () {
            return this._userDraggingAllowed;
        },
        set: function (value) {
            this._userDraggingAllowed = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalloutConfig.prototype, "offSiteIndicatorEnabled", {
        get: function () {
            return this._offSiteIndicatorEnabled;
        },
        set: function (value) {
            this._offSiteIndicatorEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalloutConfig.prototype, "tryToKeepInViewbox", {
        get: function () {
            return this._tryToKeepInViewbox;
        },
        set: function (value) {
            this._tryToKeepInViewbox = value;
        },
        enumerable: true,
        configurable: true
    });
    return CalloutConfig;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/callout-config.js.map