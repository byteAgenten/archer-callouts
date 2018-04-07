import "./callout-manager.scss";
import { Callout } from "./callout";
export var CalloutManager = (function () {
    function CalloutManager() {
        this.callouts = [];
    }
    CalloutManager.prototype.create = function (container) {
        if (container === void 0) { container = null; }
        return new Callout(container);
    };
    return CalloutManager;
}());
//# sourceMappingURL=/Users/matthias/Development/Projects/archer-callouts/src/callout-manager.js.map