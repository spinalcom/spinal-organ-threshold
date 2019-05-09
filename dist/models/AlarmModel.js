"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const AlarmServices_1 = require("../services/AlarmServices");
const Utilities_1 = require("../classes/Utilities");
class AlarmModel extends spinal_core_connectorjs_type_1.Model {
    constructor(alarmType) {
        super();
        this.add_attr({
            id: Utilities_1.Guuid("AlarmModel"),
            beginDate: Date.now(),
            endDate: Date.now(),
            values: new spinal_core_connectorjs_type_1.Lst(),
            alarmType: typeof alarmType === "undefined" ? AlarmServices_1.AlarmTypes.normal : alarmType
        });
    }
    addValues(date, value) {
        this.values.push({ time: date, value: value });
    }
}
exports.default = AlarmModel;
spinal_core_connectorjs_type_1.spinalCore.register_models([AlarmModel]);
//# sourceMappingURL=AlarmModel.js.map