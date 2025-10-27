import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

export type EntityState = {
    ySpeed: number;
};
@ccclass("Entity")
export class Entity<T> extends Component {
    state: T = {} as T;
    init(data: T) {
        if (data) {
            this.state = { ...data }; // 浅拷贝一下
        }
    }
}
