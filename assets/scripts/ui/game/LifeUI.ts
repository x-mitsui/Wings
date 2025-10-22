import { _decorator } from "cc";
import { PLAYER_CHANGE_HP } from "../../utils/CONST";
import { eventManager } from "../../utils/EventManager";
import { CustomUI } from "../CustomUI";

const { ccclass } = _decorator;

@ccclass("LifeUI")
export class LifeUI extends CustomUI {
    protected onLoad(): void {
        super.onLoad();
        eventManager.on(PLAYER_CHANGE_HP, this.onChangeHp, this);
    }

    onChangeHp(count: number): void {
        console.log("onChangeHp", count);
        this.setLabelText(count + "");
    }
}
