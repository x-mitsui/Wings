import { _decorator, Component, find, log, screen, view } from "cc";
import { BGUtil, printSizes } from "../utils/tool";
import { AudioManager } from "../mgr/AudioManager";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    protected onLoad() {
        BGUtil.init(find("Canvas-GAME/bg/bg0"));
        AudioManager.inst.play("sounds/bg/game_music", 0.5);
    }

    protected start(): void {
        printSizes();
    }

    onDestroy(): boolean {
        BGUtil.destroy();
        return true;
    }
}
