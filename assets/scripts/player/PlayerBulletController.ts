import { OBJECT_POOL_KEY_BULLET0, OBJECT_POOL_KEY_BULLET1 } from "./../utils/CONST";
import { _decorator, Component, error, log, Node, UITransform } from "cc";
import { BGUtil } from "../utils/tool";
import { BulletDirection, PlayerLevel, PlayerBulletState } from "./types";
import { ObjectPoolManager } from "../mgr/ObjectPoolManager";
import { DataManager } from "../mgr/DataManager";
import { PlayerState } from "./PlayerState";
import { Entity } from "../utils/Entity";
import { AudioManager } from "../mgr/AudioManager";
const { ccclass, property } = _decorator;

/**
 * 前提：子弹是不断发射的
 * 1. 装载 -- spawn
 * 2. 发射 -- fire
 */
@ccclass("PlayerBulletController")
export class PlayerBulletController extends Component {
    /** NOTE: 一级属性， */

    // 子弹父容器
    @property(Node)
    bulletContainer: Node = null;
    // spawnRate 子弹生成间隔
    @property
    spawnRate = 0.5;
    /** NOTE: 二级属性， */
    // 主角
    player: Node = null;

    /** NOTE: 三级属性， */
    // // 主角等级
    // playerLvl = PlayerLevel.Lvl0;
    // 位置节点
    posNodes: Map<string, Node> = new Map();
    // 子弹集合
    bullets: Node[] = [];
    // 子弹发射计时器
    spawnTimer = 0;
    ////////////////////////////////////////
    protected onLoad() {}
    // 注入player属性
    inject(player: Node) {
        this.player = player;
        // player的子节点就是用来标记子弹发射位置的节点
        const children = player.children;
        children.forEach((child) => this.posNodes.set(child.name, child));
    }

    update(deltaTime: number) {
        if (this.spawnTimer > this.spawnRate) {
            this.spawnTimer = 0;
            this.fire();
        } else {
            this.spawnTimer += deltaTime;
        }
        this.updatePositions(deltaTime);
    }

    // 根据不同位置生成子弹
    fire() {
        const playerState = this.player.getComponent(PlayerState);
        let objPoolKey = "";
        let cfgIndex = 0;
        if (playerState.level === PlayerLevel.Lvl0) {
            objPoolKey = OBJECT_POOL_KEY_BULLET0;
            cfgIndex = 0;
        } else {
            objPoolKey = OBJECT_POOL_KEY_BULLET1;
            cfgIndex = 1;
        }

        const bulletCfg = DataManager.inst.getConfigs("bullet");
        const configs = bulletCfg[cfgIndex];
        const { posNodeNames } = configs;
        AudioManager.inst.playOneShot("sounds/bullet");
        posNodeNames.forEach((posNodeName) => {
            const bullet = ObjectPoolManager.inst.get(objPoolKey);
            if (!bullet) error("something is wrong with object pool--key:", objPoolKey);
            this.bullets.push(bullet);
            this.bulletContainer.addChild(bullet);
            const posNode = this.posNodes.get(posNodeName);
            bullet.setWorldPosition(posNode.worldPosition);
        });
    }

    updatePositions(deltaTime: number) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            const bulletState = bullet.getComponent(Entity<PlayerBulletState>).state;
            if (!bullet.active) {
                this.bullets.splice(i, 1);
                continue;
            }
            const y =
                (bulletState.direction === BulletDirection.UP
                    ? bulletState.ySpeed
                    : -bulletState.ySpeed) * deltaTime;
            bullet.position = bullet.position.add3f(0, y, 0);
            const worldPosY = bullet.worldPosition.y;
            if (
                worldPosY > BGUtil.topBorder + bullet.getComponent(UITransform).height / 2 ||
                worldPosY < BGUtil.bottomBorder - bullet.getComponent(UITransform).height / 2
            ) {
                this.bullets.splice(i, 1);
                ObjectPoolManager.inst.put(bulletState.objPoolKey, bullet);
            }
        }
    }
}
