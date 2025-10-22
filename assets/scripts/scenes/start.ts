import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

@ccclass("start")
export class start extends Component {
    onClickStartBtn() {
        director.loadScene("main");
    }
}
