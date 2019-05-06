import { Model, spinalCore, Lst } from "spinal-core-connectorjs_type";
import { AlarmTypes } from "../services/AlarmServices";
import { Guuid } from "../classes/Utilities";

export default class AlarmModel extends Model {
  constructor(alarmType?: any) {
    super();
    this.add_attr({
      id: Guuid("AlarmModel"),
      beginDate: Date.now(),
      endDate: Date.now(),
      values: new Lst(),
      alarmType:
        typeof alarmType === "undefined" ? AlarmTypes.normal : alarmType
    });
  }

  addValues(date, value) {
    this.values.push({ time: date, value: value });
  }
}

spinalCore.register_models([AlarmModel]);
