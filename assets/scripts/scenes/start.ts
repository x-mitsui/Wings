import { _decorator, Component, director } from "cc";
import { AudioManager } from "../mgr/AudioManager";
const { ccclass } = _decorator;

@ccclass("Start")
export class Start extends Component {
    onClickStartBtn() {
        AudioManager.inst.playOneShot("sounds/button");
        director.loadScene("main");
    }
}
