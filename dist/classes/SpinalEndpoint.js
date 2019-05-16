"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const service_1 = require("spinal-env-viewer-threshold/dist/service");
const AlarmModel_1 = require("../models/AlarmModel");
const AlarmServices_1 = require("../services/AlarmServices");
const AlarmServices_2 = require("../services/AlarmServices");
class SpinalEndpoint {
    constructor(node, context) {
        this.node = node;
        this.alarmContext = context;
    }
    init(node) {
        return __awaiter(this, void 0, void 0, function* () {
            this.threshold = yield service_1.thresholdService.getThreshold(node.id.get());
            this.endpoint = yield node.element.load();
            this.alarm = yield this._getLastAlarm();
            if (this.alarm) {
                this.alarmType = this.alarm.alarmType.get();
            }
        });
    }
    bindElement() {
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
    getAlarmType() {
        let min = this.threshold.min.activated.get()
            ? this.threshold.min.value.get()
            : undefined;
        let max = this.threshold.max.activated.get()
            ? this.threshold.max.value.get()
            : undefined;
        let value = this.endpoint.currentValue.get();
        if (min && value <= min) {
            AlarmServices_2.alarmService.activeAlarm(this.node.id.get()); //activer l'alarme
            this._addToInAlarmList();
            return AlarmServices_1.AlarmTypes.minThreshold;
        }
        else if (max && value >= max) {
            AlarmServices_2.alarmService.activeAlarm(this.node.id.get()); //activer l'alarme
            this._addToInAlarmList();
            return AlarmServices_1.AlarmTypes.maxThreshold;
        }
        else {
            AlarmServices_2.alarmService.disableAlarm(this.node.id.get()); // desactiver l'alarme
            this._removeToInAlarmList();
            return AlarmServices_1.AlarmTypes.normal;
        }
    }
    unBindElement() {
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
            this.alarm = new AlarmModel_1.default(alarmType);
            let alarmNodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: `Alarm - ${Date.now()}`,
                type: alarmType
            }, this.alarm);
            AlarmServices_2.alarmService.addToContext(this.node.id.get(), alarmNodeId, alarmType);
        }
    }
    _getLastAlarm() {
        let id = this.node.id.get();
        return AlarmServices_2.alarmService.getAllAlarm(id).then(children => {
            if (children.length === 0)
                return;
            return children[children.length - 1].element.load();
        });
    }
    _addToInAlarmList() {
        if (this.alarmContext && this.alarmContext.info.inAlarmList) {
            for (let index = 0; index < this.alarmContext.info.inAlarmList.length; index++) {
                const element = this.alarmContext.info.inAlarmList[index];
                if (element.get() === this.node.id.get())
                    return;
            }
            this.alarmContext.info.inAlarmList.push(this.node.id.get());
        }
        else {
            this.alarmContext.info.add_attr({
                inAlarmList: [this.node.id.get()]
            });
        }
    }
    _removeToInAlarmList() {
        if (this.alarmContext && this.alarmContext.info.inAlarmList) {
            for (let index = 0; index < this.alarmContext.info.inAlarmList.length; index++) {
                const element = this.alarmContext.info.inAlarmList[index];
                if (element.get() === this.node.id.get()) {
                    this.alarmContext.info.inAlarmList.splice(index, 1);
                }
            }
        }
    }
}
exports.default = SpinalEndpoint;
//# sourceMappingURL=SpinalEndpoint.js.map