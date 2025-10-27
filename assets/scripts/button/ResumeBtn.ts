import { _decorator, Component } from "cc";
import { GameManager } from "../mgr/GameManager";
import { AudioManager } from "../mgr/AudioManager";
const { ccclass } = _decorator;

@ccclass("ResumeBtn")
export class ResumeBtn extends Component {
    onClick() {
        AudioManager.inst.playOneShot("sounds/button");
        GameManager.inst.gameResume();
        this.node.parent.getChildByName("pauseBtn").active = true;
        this.node.active = false;
    }
}
