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
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const config_1 = require("./config");
const service_1 = require("spinal-env-viewer-threshold/dist/service");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const SpinalEndpoint_1 = require("./classes/SpinalEndpoint");
const AlarmServices_1 = require("./services/AlarmServices");
exports.alarmService = AlarmServices_1.alarmService;
class Main {
    constructor() {
        this.nodeMap = new Map();
        this.url = `http://${config_1.default.user}:${config_1.default.password}@${config_1.default.host}:${config_1.default.port}/`;
        this.filePath = config_1.default.path;
        spinal_core_connectorjs_type_1.spinalCore.load(spinal_core_connectorjs_type_1.spinalCore.connect(this.url), this.filePath, _file => {
            this.getContext(_file).then(ref => {
                if (ref) {
                    ref.bind(() => {
                        this.createMap(ref).then(() => {
                            this.bindAllItem();
                        });
                    });
                }
                else {
                    console.log("Error !!!");
                }
            });
        });
    }
    getGraph(_file) {
        if (_file.graph instanceof spinal_core_connectorjs_type_1.Ptr) {
            return _file.graph.load();
        }
        return Promise.resolve(_file.graph);
    }
    getContext(_file) {
        return __awaiter(this, void 0, void 0, function* () {
            let _graph = yield this.getGraph(_file);
            if (typeof _graph !== "undefined") {
                yield spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(_graph);
                let context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(service_1.ENDPOINT_CONTEXT_NAME);
                if (typeof context === "undefined" ||
                    !context.hasRelation(service_1.ENDPOINT_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE)) {
                    return;
                }
                return context._getRelation(service_1.ENDPOINT_RELATION, spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE).children;
            }
            else {
                return;
            }
        });
    }
    createMap(ref) {
        return ref.load().then((children) => __awaiter(this, void 0, void 0, function* () {
            for (let loop = 0; loop < children.length; loop++) {
                const node = children[loop];
                const id = node.info.id.get();
                if (typeof this.nodeMap.get(id) === "undefined") {
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(node);
                    let info = spinal_env_viewer_graph_service_1.SpinalGraphService.getInfo(id);
                    let spinalEndpoint = new SpinalEndpoint_1.default(info);
                    yield spinalEndpoint.init(info);
                    this.nodeMap.set(id, spinalEndpoint);
                }
            }
            return;
        }));
    }
    bindAllItem() {
        this.nodeMap.forEach(value => {
            value.bindElement();
        });
    }
}
exports.default = Main;
//# sourceMappingURL=index.js.map