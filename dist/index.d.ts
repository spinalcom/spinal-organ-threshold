import SpinalEndpoint from "./classes/SpinalEndpoint";
import { alarmService } from "./services/AlarmServices";
declare class Main {
    url: string;
    filePath: string;
    nodeMap: Map<string, SpinalEndpoint>;
    context: any;
    relationBindProcess: spinal.Process;
    constructor();
    getGraph(_file: any): any;
    getContext(_file: any): Promise<spinal.Model>;
    createMap(ref: spinal.Model): any;
    bindAllItem(): void;
}
export { alarmService };
export default Main;
