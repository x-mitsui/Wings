import { _decorator, Component } from "cc";
import { GameManager } from "../utils/GameManager";
const { ccclass } = _decorator;

@ccclass("ResumeBtn")
export class ResumeBtn extends Component {
    onClick() {
        GameManager.instance.gameResume();
        this.node.parent.getChildByName("pauseBtn").active = true;
        this.node.active = false;
    }
}
