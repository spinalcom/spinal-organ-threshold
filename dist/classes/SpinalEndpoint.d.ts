import AlarmModel from "../models/AlarmModel";
export default class SpinalEndpoint {
    endpoint: any;
    threshold: any;
    node: any;
    bindProcess: Map<spinal.Model, spinal.Process>;
    tempModel: spinal.Model;
    alarmType: any;
    alarm: AlarmModel;
    alarmContext: spinal.Model;
    constructor(node: spinal.Model, context: spinal.Model);
    init(node: spinal.Model): Promise<void>;
    bindElement(): void;
    getAlarmType(): any;
    unBindElement(): void;
    bindMethod(): void;
    _getLastAlarm(): Promise<any>;
    _addToInAlarmList(): void;
    _removeToInAlarmList(): void;
}
