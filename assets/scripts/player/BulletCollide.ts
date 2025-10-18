import { _decorator, Collider2D, Component, Contact2DType, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BulletCollide")
export class BulletCollide extends Component {
    collider: Collider2D = null;
    onLoad(): void {
        this.collider = this.getComponent(Collider2D);
    }
    start() {
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            // collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {
        console.log("onBeginContact");
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            // collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
}
