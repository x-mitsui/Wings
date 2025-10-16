import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Body")
export class Body extends Component {
    @property
    speed = 300;
    start() {}

    update(deltaTime: number) {
        this.node.position = this.node.position.add3f(0, this.speed * deltaTime, 0);
    }
}
