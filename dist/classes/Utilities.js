"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
function Guuid(_constructor) {
    return (_constructor +
        "-" +
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4() +
        "-" +
        Date.now().toString(16));
}
exports.Guuid = Guuid;
//# sourceMappingURL=Utilities.js.map