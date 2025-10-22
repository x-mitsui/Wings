import { _decorator, Animation, AnimationState, Collider2D, Component, Contact2DType } from "cc";
import { PlayerBulletState } from "../player/bullet/PlayerBulletState";
import { EnemyState } from "./EnemyState";
import { GameManager } from "../utils/GameManager";
const { ccclass } = _decorator;

@ccclass("EnemyCollide")
export class EnemyCollide extends Component {
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
    /**
     * Box2D 物理引擎在执行物理计算（包括检测和响应碰撞）时，会进入一个“锁定”状态。在这个状态下，整个物理世界的数据结构被视为只读，以确保计算的准确性和稳定性。
     * 如果你在 onBeginContact回调中立即销毁刚体或碰撞体（例如直接调用 this.node.destroy()），就相当于在 Box2D 正在处理碰撞的关键时刻，强行移除了它正在计算的一个物体。
     * 这会破坏 Box2D 的内部数据完整性，从而导致引擎抛出错误
     * scheduleOnce(() => {}, 0) 的作用就是将销毁操作推迟到当前物理帧计算完成之后再执行。这里的延迟 0秒，并不意味着不延迟，而是指示引擎“在当前帧所有物理计算都结束后，
     * 下一帧开始前”执行销毁操作。这完美地避开了 Box2D 的锁定阶段，从而避免了报错。
     */
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: any) {
        const enemyNode = selfCollider.node;
        const bulletNode = otherCollider.node;

        const bulletState = bulletNode.getComponent(PlayerBulletState);
        if (!bulletNode || !bulletNode.isValid || !bulletState || bulletState.isHitten) return;
        bulletState.isHitten = true; // 防止一次碰撞多次触发onBeginContact的情况

        const enemyName = enemyNode.name;
        log("EnemyCollide onBeginContact:", enemyName);
        if (!enemyName.includes("enemy")) return;

        this.scheduleOnce(() => {
            bulletNode.destroy();
            this.takeDamageLogic(1);
        }, 0);
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    // 执行掉血逻辑
    takeDamageLogic(hp: number) {
        const state = this.node.getComponent(EnemyState);
        state.hp -= hp;
        if (state.hp > 0) {
            this.playHitAc();
        } else {
            this.playDownAc();
        }
    }

    playHitAc() {
        const animation = this.node.getComponent(Animation);
        let acName = this.node.name + "_hit";
        animation.play(acName);
    }

    playDownAc() {
        const animation = this.node.getComponent(Animation);
        const state = this.node.getComponent(EnemyState);
        state.speed = 0;
        this.node.getComponent(Collider2D).enabled = false; // 立即禁用，以免在播放动画时干扰

        const acName = this.node.name + "_down";

        GameManager.instance.currentScore += state.score;

        animation.on(Animation.EventType.FINISHED, this.playDownAcCallback.bind(this));
        animation.play(acName);
    }

    playDownAcCallback(type: Animation.EventType, state: AnimationState) {
        if (state.name === this.node.name + "_down") this.node.destroy();
    }
}
