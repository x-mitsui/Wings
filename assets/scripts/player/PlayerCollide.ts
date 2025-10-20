import {
    _decorator,
    Animation,
    Collider2D,
    Component,
    Contact2DType,
    director,
    IPhysics2DContact
} from "cc";
import { PlayerState } from "./PlayerState";
import { EnemyState } from "../enemy/EnemyState";
const { ccclass } = _decorator;

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
        const playerState = player.getComponent(PlayerState);
        const playerAnimation = player.getComponent(Animation);
        const enemy = otherCollider.node;
        const enemyState = enemy.getComponent(EnemyState);
        if (!player || !player.isValid || !enemy || !enemy.isValid || playerState.isHitten) return;
        playerState.isHitten = true;

        if (!enemy.name.includes("enemy")) return;

        this.scheduleOnce(() => {
            playerState.hp -= 1;

            if (playerState.hp <= 0) {
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

            enemyState.hp--;
            if (enemyState.hp <= 0) {
                enemy.destroy();
            }
        }, 0);
    }

    playerHittenCallback() {
        this.node.getComponent(PlayerState).isHitten = false;
        this.node.getComponent(Animation).play("player_idle");
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
