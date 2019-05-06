import { Ptr, spinalCore } from "spinal-core-connectorjs_type";
import config from "./config";

import {
  ENDPOINT_CONTEXT_NAME,
  ENDPOINT_RELATION
} from "spinal-env-viewer-threshold/dist/service";

import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";

import SpinalEndpoint from "./classes/SpinalEndpoint";
import { alarmService, ALARM_CONTEXT_NAME } from "./services/AlarmServices";

class Main {
  url: string;
  filePath: string;
  nodeMap: Map<string, SpinalEndpoint> = new Map();

  constructor() {
    this.url = `http://${config.user}:${config.password}@${config.host}:${
      config.port
    }/`;

    this.filePath = config.path;

    spinalCore.load(spinalCore.connect(this.url), this.filePath, _file => {
      this.getContext(_file).then(ref => {
        if (ref) {
          ref.bind(() => {
            this.createMap(ref).then(() => {
              this.bindAllItem();
            });
          });
        } else {
          console.log("Error !!!");
        }
      });
    });
  }

  getGraph(_file: any) {
    if (_file.graph instanceof Ptr) {
      return _file.graph.load();
    }

    return Promise.resolve(_file.graph);
  }

  async getContext(_file: any): Promise<spinal.Model> {
    let _graph = await this.getGraph(_file);

    if (typeof _graph !== "undefined") {
      await SpinalGraphService.setGraph(_graph);

      let context = SpinalGraphService.getContext(ENDPOINT_CONTEXT_NAME);

      console.log("context", context);

      if (typeof context === "undefined") return;

      return context._getRelation(
        ENDPOINT_RELATION,
        SPINAL_RELATION_PTR_LST_TYPE
      ).children;
    } else {
      return;
    }
  }

  createMap(ref: spinal.Model) {
    return ref.load().then(async children => {
      for (let loop = 0; loop < children.length; loop++) {
        const node = children[loop];
        const id = node.info.id.get();

        if (typeof this.nodeMap.get(id) === "undefined") {
          (<any>SpinalGraphService)._addNode(node);
          let info = SpinalGraphService.getInfo(id);
          let spinalEndpoint = new SpinalEndpoint(info);
          await spinalEndpoint.init(info);
          this.nodeMap.set(id, spinalEndpoint);
        }
      }
      return;
    });
  }

  bindAllItem() {
    this.nodeMap.forEach(value => {
      value.bindElement();
    });
  }
}

let main = new Main();

export { alarmService, ALARM_CONTEXT_NAME };
