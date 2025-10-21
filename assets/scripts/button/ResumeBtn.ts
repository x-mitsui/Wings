import { _decorator, Component } from "cc";
import { GameManager } from "../utils/GameManager";
import { GameState } from "../utils/GameManager";
const { ccclass } = _decorator;

@ccclass("ResumeBtn")
export class ResumeBtn extends Component {
    onClick() {
        GameManager.instance.state = GameState.PLAYING;
        this.node.parent.getChildByName("pauseBtn").active = true;
        this.node.active = false;
    }
}
