import {
    _decorator,
    Component,
    error,
    find,
    instantiate,
    Node,
    Prefab,
    Sprite,
    SpriteFrame,
    UITransform
} from "cc";
import { BGUtil, loadJSONPromise } from "../../utils/tool";
import { BulletConfig, BulletCurrentLvlConfig, BulletDirection, PlayerLevel } from "./types";
import { PlayerState } from "../PlayerState";
import { GameManager } from "../../utils/GameManager";
const { ccclass, property } = _decorator;

/**
 * 前提：子弹是不断发射的
 * 1. 装载 -- spawn
 * 2. 发射 -- fire
 */
@ccclass("PlayerBulletManager")
export class PlayerBulletManager extends Component {
    /** NOTE: 一级属性， */
    // 子弹预制体
    @property({ type: Prefab })
    bulletPrefab: Prefab = null;
    // 子弹皮肤
    @property({ type: [SpriteFrame] })
    bulletSkinSpriteFrames: SpriteFrame[] = [];
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
    // 主角等级
    playerLvl = PlayerLevel.Lvl0;
    // 位置节点
    posNodes: Map<string, Node> = new Map();
    // 子弹集合
    bullets: Node[] = [];
    // 子弹发射计时器
    spawnTimer = 0;
    // 子弹配置
    bulletPlayerConfig: BulletConfig["player"] = null;
    // 子弹当前等级配置
    bulletCurLvlConfig: BulletCurrentLvlConfig = null;
    ////////////////////////////////////////
    protected async onLoad(): Promise<void> {
        const bulletConfig = (await loadJSONPromise("configs/bullet")) as BulletConfig;
        this.bulletPlayerConfig = bulletConfig.player;
    }
    // 注入player属性
    inject(player: Node) {
        this.player = player;
        const children = player.children;
        children.forEach((child) => this.posNodes.set(child.name, child));
    }

    update(deltaTime: number) {
        if (!this.bulletPlayerConfig) return;
        if (this.spawnTimer > this.spawnRate) {
            this.spawnTimer = 0;
            this.fire();
        } else {
            this.spawnTimer += deltaTime;
        }
        this.updatePositions(deltaTime);
    }

    // 根据类型生成一发子弹
    spawn(cfg: BulletCurrentLvlConfig) {
        const bullet = instantiate(this.bulletPrefab);
        bullet.getComponent(Sprite).spriteFrame =
            this.bulletSkinSpriteFrames[cfg.skinSpriteFrameID];
        return bullet;
    }
    // 根据不同位置生成子弹
    fire() {
        const cfg = this.getBulletCurrentLvlConfig();
        if (!cfg) return;
        cfg.posNodes.forEach((posNode) => {
            const bullet = this.spawn(cfg);
            if (!bullet) error("bullet skin Prefab is null");
            this.bullets.push(bullet);
            this.bulletContainer.addChild(bullet);
            bullet.setWorldPosition(posNode.worldPosition);
        });
    }
    getBulletCurrentLvlConfig(): BulletCurrentLvlConfig {
        const playerLvl = this.player.getComponent(PlayerState).level;
        console.log("playerLvl:", playerLvl, this.playerLvl);
        if (this.playerLvl === playerLvl && this.bulletCurLvlConfig) return this.bulletCurLvlConfig;
        this.playerLvl = playerLvl;
        const rawCfg = this.bulletPlayerConfig[playerLvl];
        this.bulletCurLvlConfig = {
            ...rawCfg,
            posNodes: rawCfg.posNodeNames.map((name) => this.posNodes.get(name))
        };
        return this.bulletCurLvlConfig;
    }

    updatePositions(deltaTime: number) {
        const cfg = this.bulletCurLvlConfig;
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (!bullet.isValid) {
                this.bullets.splice(i, 1);
                continue;
            }
            const y = (cfg.direction === BulletDirection.UP ? cfg.speed : -cfg.speed) * deltaTime;
            bullet.position = bullet.position.add3f(0, y, 0);
            const wPosY = bullet.worldPosition.y;
            if (
                wPosY > BGUtil.bgTopBorder + bullet.getComponent(UITransform).height / 2 ||
                wPosY < BGUtil.bgBottomBorder - bullet.getComponent(UITransform).height / 2
            ) {
                this.bullets.splice(i, 1);
                bullet.destroy();
            }
        }
    }
}
