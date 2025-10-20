import { _decorator, Component } from "cc";
const { ccclass } = _decorator;

@ccclass("PlayerBulletState")
export class PlayerBulletState extends Component {
    isHitten = false;
}
