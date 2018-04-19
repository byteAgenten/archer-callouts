import "./callout-manager.scss";
import { Callout } from "./callout";
export var CalloutManager = (function () {
    function CalloutManager() {
        this.callouts = [];
    }
    CalloutManager.prototype.create = function (container, config) {
        if (container === void 0) { container = null; }
        if (config === void 0) { config = null; }
        return new Callout(container, config);
    };
    return CalloutManager;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/callout-manager.js.map