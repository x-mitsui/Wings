import { _decorator, Component, director } from "cc";
import { AudioManager } from "../mgr/AudioManager";
const { ccclass } = _decorator;

@ccclass("Start")
export class Start extends Component {
    protected start(): void {
        // 游戏中退到Start场景，需要停止背景音乐；但停止音乐操作放在onLoad中不生效，所以放在这里
        AudioManager.inst.stop();
    }
    onClickStartBtn() {
        AudioManager.inst.playOneShot("sounds/button");
        director.loadScene("main");
    }
}
