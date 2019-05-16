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
  alarmContext: spinal.Model;

  constructor(node: spinal.Model, context: spinal.Model) {
    this.node = node;
    this.alarmContext = context;
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
      alarmService.activeAlarm(this.node.id.get()); //activer l'alarme
      this._addToInAlarmList();
      return AlarmTypes.minThreshold;
    } else if (max && value >= max) {
      alarmService.activeAlarm(this.node.id.get()); //activer l'alarme
      this._addToInAlarmList();
      return AlarmTypes.maxThreshold;
    } else {
      alarmService.disableAlarm(this.node.id.get()); // desactiver l'alarme
      this._removeToInAlarmList();
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

  _addToInAlarmList() {
    if (this.alarmContext && this.alarmContext.info.inAlarmList) {
      for (
        let index = 0;
        index < this.alarmContext.info.inAlarmList.length;
        index++
      ) {
        const element = this.alarmContext.info.inAlarmList[index];
        if (element.get() === this.node.id.get()) return;
      }

      this.alarmContext.info.inAlarmList.push(this.node.id.get());
    } else {
      this.alarmContext.info.add_attr({
        inAlarmList: [this.node.id.get()]
      });
    }
  }

  _removeToInAlarmList() {
    if (this.alarmContext && this.alarmContext.info.inAlarmList) {
      for (
        let index = 0;
        index < this.alarmContext.info.inAlarmList.length;
        index++
      ) {
        const element = this.alarmContext.info.inAlarmList[index];
        if (element.get() === this.node.id.get()) {
          this.alarmContext.info.inAlarmList.splice(index, 1);
        }
      }
    }
  }
}
