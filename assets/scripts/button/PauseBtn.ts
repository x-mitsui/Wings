import { _decorator, Component } from "cc";
import { GameManager } from "../mgr/GameManager";
import { AudioManager } from "../mgr/AudioManager";
const { ccclass } = _decorator;

@ccclass("PauseBtn")
export class PauseBtn extends Component {
    onClick() {
        AudioManager.inst.playOneShot("sounds/button");
        GameManager.inst.gamePause();
        this.node.parent.getChildByName("resumeBtn").active = true;
        this.node.active = false;
    }
}
