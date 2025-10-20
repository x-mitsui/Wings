import {
    _decorator,
    Animation,
    Collider2D,
    Component,
    Contact2DType,
    director,
    IPhysics2DContact
} from "cc";
import { Player } from "./Player";
const { ccclass, property } = _decorator;

@ccclass("PlayerCollide")
export class PlayerCollide extends Component {
    collider: Collider2D = null;
    protected onLoad(): void {
        this.collider = this.getComponent(Collider2D);
    }
    start() {
        if (!this.collider) return;
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact
    ) {
        const player = selfCollider.node;
        const playerComp = player.getComponent(Player);
        const playerAnimation = player.getComponent(Animation);
        const enemy = otherCollider.node;
        console.log("enemy collide player111", !enemy || !enemy.isValid);
        if (!player || !player.isValid || !enemy || !enemy.isValid || playerComp.isHitten) return;
        playerComp.isHitten = true;

        if (!enemy.name.includes("enemy")) return;
        console.log("enemy collide player");
        this.scheduleOnce(() => {
            playerComp.hp -= 1;
            if (playerComp.hp <= 0) {
                playerAnimation.on(
                    Animation.EventType.FINISHED,
                    this.playerDownCallback.bind(this)
                );
                playerAnimation.play("player_down");
            } else {
                playerAnimation.on(
                    Animation.EventType.FINISHED,
                    this.playerHittenCallback.bind(this)
                );
                playerAnimation.play("player_hit");
            }
        }, 0);
    }

    playerHittenCallback() {
        this.node.getComponent(Player).isHitten = false;
    }

    playerDownCallback() {
        console.log("game over");
        director.pause();
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}
