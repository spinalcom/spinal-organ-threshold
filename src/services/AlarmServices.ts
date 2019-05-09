import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";
import AlarmTypes from "./AlarmTypes";

const ENDPOINT_TO_ALARM_RELATION = "hasAlarm";

const ALARM_CONTEXT_NAME = "AlarmContext"; // ".AlarmContext" pour le rendre invisible
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

  addToContext(
    endpointId: string,
    alarmId: string,
    alarmType: any
  ): Promise<boolean> {
    return this.createContextIfNotExist().then(context => {
      let contextId = context.info.id.get();
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

      return SpinalGraphService.addChildInContext(
        endpointId,
        alarmId,
        contextId,
        ENDPOINT_TO_ALARM_RELATION,
        SPINAL_RELATION_PTR_LST_TYPE
      ).then(el => {
        if (el) {
          return SpinalGraphService.addChildInContext(
            contextId,
            endpointId,
            contextId,
            relationName,
            SPINAL_RELATION_PTR_LST_TYPE
          );
        }
        return false;
      });
    });
  }
}

const alarmService = new AlarmService();

export { alarmService, ALARM_CONTEXT_NAME, AlarmTypes };
