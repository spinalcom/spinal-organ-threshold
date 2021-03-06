import AlarmTypes from "./AlarmTypes";
declare class AlarmService {
    ALARM_CONTEXT_NAME: string;
    MIN_ALARM_TYPES_RELATION: string;
    MAX_ALARM_TYPES_RELATION: string;
    NORMAL_ALARM_TYPES_RELATION: string;
    ENDPOINT_TO_ALARM_RELATION: string;
    constructor();
    createContextIfNotExist(): Promise<spinal.Model>;
    addToContext(endpointId: string, alarmId: string, alarmType: any): Promise<boolean>;
    getAllAlarm(nodeId: string): Promise<any>;
    _addToRelation(contextId: string, endpointId: string, alarmId: string, relationName: string): Promise<any>;
    isInAlarm(nodeId: string): boolean;
    activeAlarm(nodeId: string): void;
    disableAlarm(nodeId: string): void;
}
declare const alarmService: AlarmService;
export { alarmService, AlarmTypes };
