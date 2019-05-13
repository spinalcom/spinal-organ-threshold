import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";
import { Model, BindProcess } from "spinal-core-connectorjs_type";

import {
  RELATION_NAME as endpoint_to_threshold,
  thresholdService,
  ENDPOINT_RELATION as context_to_endpoint
} from "spinal-env-viewer-threshold/dist/service";

import AlarmModel from "../models/AlarmModel";
import { AlarmTypes } from "../services/AlarmServices";

import { alarmService } from "../services/AlarmServices";

export default class SpinalEndpoint {
  endpoint: any;
  threshold: any;
  node: any;
  bindProcess: Map<spinal.Model, spinal.Process>;
  tempModel: spinal.Model;
  alarmType: any;
  alarm: AlarmModel;

  constructor(node: spinal.Model) {
    this.node = node;
  }

  async init(node: spinal.Model) {
    this.threshold = await thresholdService.getThreshold(node.id.get());
    this.endpoint = await node.element.load();
    this.alarm = await this._getLastAlarm();

    if (this.alarm) {
      this.alarmType = this.alarm.alarmType.get();
    }
  }

  bindElement(): void {
    if (typeof this.bindProcess === "undefined") {
      this.bindProcess = new Map();

      let endpointValue = this.endpoint.currentValue;
      let endpointProcess = endpointValue.bind(() => {
        this.bindMethod();
      });

      let thresholdProcess = this.threshold.bind(() => {
        this.bindMethod();
      });

      this.bindProcess.set(endpointValue, endpointProcess);
      this.bindProcess.set(this.threshold, thresholdProcess);
    }
  }

  getAlarmType(): any {
    let min = this.threshold.min.activated.get()
      ? this.threshold.min.value.get()
      : undefined;
    let max = this.threshold.max.activated.get()
      ? this.threshold.max.value.get()
      : undefined;
    let value = this.endpoint.currentValue.get();

    if (min && value <= min) {
      return AlarmTypes.minThreshold;
    } else if (max && value >= max) {
      return AlarmTypes.maxThreshold;
    } else {
      return AlarmTypes.normal;
    }
  }

  unBindElement(): void {
    this.bindProcess.forEach((value, keys) => {
      keys.unbind(value);
      this.bindProcess.delete(keys);
    });
  }

  bindMethod() {
    let alarmType = this.getAlarmType();

    if (this.alarm) {
      let date = Date.now();
      this.alarm.endDate.set(date);
      if (alarmType === this.alarmType) {
        this.alarm.addValues(date, this.endpoint.currentValue.get());
      }
    }

    if (alarmType !== this.alarmType) {
      this.alarmType = alarmType;
      this.alarm = new AlarmModel(alarmType);

      let alarmNodeId = SpinalGraphService.createNode(
        {
          name: `Alarm - ${Date.now()}`,
          type: alarmType
        },
        this.alarm
      );

      alarmService.addToContext(this.node.id.get(), alarmNodeId, alarmType);
    }
  }

  _getLastAlarm(): Promise<any> {
    let id = this.node.id.get();
    return alarmService.getAllAlarm(id).then(children => {
      if (children.length === 0) return;

      return children[children.length - 1].element.load();
    });
  }
}
