"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SeatMapAdminMenu_1 = require("./SeatMapAdminMenu");
var SeatMapFloor_1 = require("./SeatMapFloor");
function SeatMapBackdrop() {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(SeatMapAdminMenu_1.default, null),
        react_1.default.createElement(SeatMapFloor_1.default, null)));
}
exports.default = SeatMapBackdrop;
//# sourceMappingURL=SeatMapBackdrop.js.map