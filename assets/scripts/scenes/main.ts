import { _decorator, Component, find } from "cc";
import { BGUtil } from "../utils/tool";
import { AudioManager } from "../mgr/AudioManager";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    protected onLoad() {
        BGUtil.init(find("Canvas-GAME/bg/bg0"));
        AudioManager.inst.play("sounds/bg/game_music", 0.5);
    }

    onDestroy(): boolean {
        BGUtil.destroy();
        return true;
    }
}
