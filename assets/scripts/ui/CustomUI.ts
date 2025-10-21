import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CustomUI")
export class CustomUI extends Component {
    label: Label = null;

    // 继承的类要注意super.onLoad()
    protected onLoad(): void {
        this.label = this.node.getChildByName("count").getComponent(Label);
    }

    setLabelText(text: string) {
        this.label.string = text;
    }
}
