import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EnemyState")
export class EnemyState extends Component {
    @property
    kind = 0;
    @property
    hp = 1;
    @property
    speed = 300;
}
