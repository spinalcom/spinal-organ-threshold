"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const AlarmTypes_1 = require("./AlarmTypes");
exports.AlarmTypes = AlarmTypes_1.default;
class AlarmService {
    constructor() {
        this.ALARM_CONTEXT_NAME = ".AlarmContext"; // ".AlarmContext" pour le rendre invisible
        this.MIN_ALARM_TYPES_RELATION = "hasMinAlarm";
        this.MAX_ALARM_TYPES_RELATION = "hasMaxAlarm";
        this.NORMAL_ALARM_TYPES_RELATION = "hasNormalAlarm";
        this.ENDPOINT_TO_ALARM_RELATION = "hasAlarm";
        // this.createContextIfNotExist();
    }
    createContextIfNotExist() {
        let context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(this.ALARM_CONTEXT_NAME);
        if (typeof context === "undefined") {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(this.ALARM_CONTEXT_NAME);
        }
        return Promise.resolve(context);
    }
    addToContext(endpointId, alarmId, alarmType) {
        return this.createContextIfNotExist().then(context => {
            let contextId = context.info.id.get();
            let relationName = this.NORMAL_ALARM_TYPES_RELATION;
            switch (alarmType) {
                case AlarmTypes_1.default.maxThreshold:
                    relationName = this.MAX_ALARM_TYPES_RELATION;
                    break;
                case AlarmTypes_1.default.minThreshold:
                    relationName = this.MIN_ALARM_TYPES_RELATION;
                    break;
                case AlarmTypes_1.default.normal:
                    relationName = this.NORMAL_ALARM_TYPES_RELATION;
                    break;
            }
            return this._addToRelation(contextId, endpointId, alarmId, relationName);
        });
    }
    getAllAlarm(nodeId) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [
            this.ENDPOINT_TO_ALARM_RELATION
        ]);
    }
    _addToRelation(contextId, endpointId, alarmId, relationName) {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(endpointId, alarmId, contextId, this.ENDPOINT_TO_ALARM_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE).then(el => {
            if (el) {
                return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(contextId, []).then(children => {
                    for (let index = 0; index < children.length; index++) {
                        const elementId = children[index].id.get();
                        if (elementId === endpointId)
                            return;
                    }
                    return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(contextId, endpointId, contextId, relationName, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE);
                });
            }
            return false;
        });
    }
}
const alarmService = new AlarmService();
exports.alarmService = alarmService;
//# sourceMappingURL=AlarmServices.js.map