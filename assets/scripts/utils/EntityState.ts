import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EntityState")
export class EntityState extends Component {
    @property
    kind = 0;
    @property
    speed = 300;
}
