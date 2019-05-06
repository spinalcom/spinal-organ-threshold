import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";
import AlarmTypes from "./AlarmTypes";

const ALARM_CONTEXT_NAME = ".AlarmContext";
const MIN_ALARM_TYPES_RELATION = "hasMinAlarm";
const MAX_ALARM_TYPES_RELATION = "hasMaxAlarm";
const NORMAL_ALARM_TYPES_RELATION = "hasNormalAlarm";

class AlarmService {
  constructor() {
    // this.createContextIfNotExist();
  }

  createContextIfNotExist(): Promise<spinal.Model> {
    let context = SpinalGraphService.getContext(ALARM_CONTEXT_NAME);

    if (typeof context === "undefined") {
      return SpinalGraphService.addContext(ALARM_CONTEXT_NAME);
    }
    return Promise.resolve(context);
  }

  addToContext(alarmId: string, alarmType: any): Promise<boolean> {
    return this.createContextIfNotExist().then(context => {
      let relationName = "hasNormalAlarm";
      switch (alarmType) {
        case AlarmTypes.maxThreshold:
          relationName = MAX_ALARM_TYPES_RELATION;
          break;
        case AlarmTypes.minThreshold:
          relationName = MIN_ALARM_TYPES_RELATION;
          break;
        case AlarmTypes.normal:
          relationName = NORMAL_ALARM_TYPES_RELATION;
          break;
      }

      return SpinalGraphService.addChild(
        context.info.id.get(),
        alarmId,
        relationName,
        SPINAL_RELATION_PTR_LST_TYPE
      );
    });
  }
}

const alarmService = new AlarmService();

export { alarmService, ALARM_CONTEXT_NAME, AlarmTypes };
