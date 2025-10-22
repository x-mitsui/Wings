import { _decorator, Component, find } from "cc";
import { BgUtil } from "../utils/tool";
const { ccclass } = _decorator;

@ccclass("main")
export class main extends Component {
    protected onLoad(): void {
        BgUtil.init(find("Canvas-GAME/bg/bg0"));
    }

    onDestroy(): boolean {
        BgUtil.destroy();
        return true;
    }
}
