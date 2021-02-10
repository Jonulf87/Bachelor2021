"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function SeatMapAdminMenu(props) {
    var _a = react_1.useState(), seatRow = _a[0], setSeatRow = _a[1];
    return (react_1.default.createElement("div", { className: "addingMenu" },
        react_1.default.createElement("form", null,
            react_1.default.createElement("label", null,
                "Antall seter p\u00E5 rad:",
                react_1.default.createElement("input", { type: "text", id: "numberOfSeats" })),
            react_1.default.createElement("button", { type: "submit" }, "Legg til rad"))));
}
exports.default = SeatMapAdminMenu;
//# sourceMappingURL=SeatMapAdminMenu.js.map