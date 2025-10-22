import { _decorator, Component } from "cc";
import { GameManager } from "../utils/GameManager";
const { ccclass } = _decorator;

@ccclass("PauseBtn")
export class PauseBtn extends Component {
    onClick() {
        GameManager.instance.gamePause();
        this.node.parent.getChildByName("resumeBtn").active = true;
        this.node.active = false;
    }
}
