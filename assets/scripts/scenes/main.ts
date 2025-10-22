import { _decorator, Component, find } from "cc";
import { BGUtil } from "../utils/tool";
const { ccclass } = _decorator;

@ccclass("Main")
export class Main extends Component {
    protected onLoad(): void {
        BGUtil.init(find("Canvas-GAME/bg/bg0"));
    }

    onDestroy(): boolean {
        BGUtil.destroy();
        return true;
    }
}
