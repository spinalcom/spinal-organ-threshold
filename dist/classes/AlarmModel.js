"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const Utilities_1 = require("./Utilities");
const Utilities_2 = require("./Utilities");
class AlarmModel extends spinal_core_connectorjs_type_1.Model {
    constructor(alarmType) {
        super();
        this.add_attr({
            id: Utilities_2.Guuid("AlarmModel"),
            beginDate: Date.now(),
            endDate: Date.now(),
            alarmType: typeof alarmType === "undefined" ? Utilities_1.AlarmTypes.normal : alarmType
        });
    }
}
exports.default = AlarmModel;
spinal_core_connectorjs_type_1.spinalCore.register_models([AlarmModel]);
//# sourceMappingURL=AlarmModel.js.map