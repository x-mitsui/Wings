import { _decorator, Component, director } from "cc";
const { ccclass } = _decorator;

@ccclass("Start")
export class Start extends Component {
    onClickStartBtn() {
        director.loadScene("main");
    }
}
