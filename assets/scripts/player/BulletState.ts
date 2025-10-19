import { _decorator, Component } from "cc";
const { ccclass } = _decorator;

@ccclass("BulletState")
export class BulletState extends Component {
    isHitten = false;
}
