import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";
import AlarmTypes from "./AlarmTypes";

class AlarmService {
  ALARM_CONTEXT_NAME: string = ".AlarmContext"; // ".AlarmContext" pour le rendre invisible
  MIN_ALARM_TYPES_RELATION: string = "hasMinAlarm";
  MAX_ALARM_TYPES_RELATION: string = "hasMaxAlarm";
  NORMAL_ALARM_TYPES_RELATION: string = "hasNormalAlarm";
  ENDPOINT_TO_ALARM_RELATION: string = "hasAlarm";

  constructor() {
    // this.createContextIfNotExist();
  }

  createContextIfNotExist(): Promise<spinal.Model> {
    let context = SpinalGraphService.getContext(this.ALARM_CONTEXT_NAME);

    if (typeof context === "undefined") {
      return SpinalGraphService.addContext(this.ALARM_CONTEXT_NAME);
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
      let relationName = this.NORMAL_ALARM_TYPES_RELATION;

      switch (alarmType) {
        case AlarmTypes.maxThreshold:
          relationName = this.MAX_ALARM_TYPES_RELATION;
          break;
        case AlarmTypes.minThreshold:
          relationName = this.MIN_ALARM_TYPES_RELATION;
          break;
        case AlarmTypes.normal:
          relationName = this.NORMAL_ALARM_TYPES_RELATION;
          break;
      }

      return this._addToRelation(contextId, endpointId, alarmId, relationName);
    });
  }

  getAllAlarm(nodeId: string): Promise<any> {
    return SpinalGraphService.getChildren(nodeId, [
      this.ENDPOINT_TO_ALARM_RELATION
    ]);
  }

  _addToRelation(
    contextId: string,
    endpointId: string,
    alarmId: string,
    relationName: string
  ) {
    return SpinalGraphService.addChildInContext(
      endpointId,
      alarmId,
      contextId,
      this.ENDPOINT_TO_ALARM_RELATION,
      SPINAL_RELATION_PTR_LST_TYPE
    ).then(el => {
      if (el) {
        return SpinalGraphService.getChildren(contextId, []).then(children => {
          for (let index = 0; index < children.length; index++) {
            const elementId = children[index].id.get();
            if (elementId === endpointId) return;
          }

          return SpinalGraphService.addChildInContext(
            contextId,
            endpointId,
            contextId,
            relationName,
            SPINAL_RELATION_PTR_LST_TYPE
          );
        });
      }
      return false;
    });
  }
}

const alarmService = new AlarmService();

export { alarmService, AlarmTypes };
