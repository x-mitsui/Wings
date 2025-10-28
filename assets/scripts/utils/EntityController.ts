import { _decorator, Component, log, math, Node, UITransform, Vec3 } from "cc";
import { BGUtil } from "../utils/tool";
import { OBJECT_POOL_KEY_PREFIX } from "../utils/CONST";
import { Entity, EntityState } from "./Entity";
import { ObjectPoolManager } from "../mgr/ObjectPoolManager";
const { ccclass, property } = _decorator;

@ccclass("EntityConfig")
export class EntityConfig {
    spawnRate = 1;
    objPoolKey = "";
}
@ccclass("EntityController")
export abstract class EntityController extends Component {
    entityConfigs: EntityConfig[] = [];

    /** 三级属性 */
    // 需要若干timer，依据操作的个数决定
    timers = [];
    // 记录每个敌人的spawn出生频率
    spawnRates = [];

    // 获取此类entity的总配置，用于初始化和重置entity状态
    abstract initEntityConfig();
    async start() {
        this.initEntityConfig();
        log(">>>>>>>>>>>>>", this.entityConfigs);
        this.spawnRates = this.entityConfigs.map((item) => {
            this.timers.push(0);
            return item.spawnRate;
        });
        log("timers-->", this.timers, this.spawnRates);
    }

    update(deltaTime: number) {
        for (let i = 0; i < this.timers.length; i++) {
            this.timers[i] += deltaTime;
            if (this.timers[i] >= this.spawnRates[i]) {
                this.timers[i] = 0;
                // if (i !== 1) continue;
                log("iiiiiiiiiii->", i);
                this.spawnEntity(this.entityConfigs[i].objPoolKey);
            }
            this.updateEntitiesPositions(deltaTime);
        }
    }
    // /**
    //  * 每次从池中取出，一些状态的初始化
    //  */
    abstract entityAssembleState(entityNode: Node);
    spawnEntity(objPoolKey: string) {
        const entityNode = ObjectPoolManager.inst.get(objPoolKey);
        entityNode.parent = this.node;
        entityNode.setWorldPosition(this.getSpawnPos(entityNode));
        this.entityAssembleState(entityNode);
        return entityNode;
    }

    getSpawnPos(entityNode: Node) {
        const contentSize = entityNode.getComponent(UITransform).contentSize;
        const entityPosX = math.randomRangeInt(
            contentSize.width / 2,
            BGUtil.bgRightBorder - contentSize.width / 2
        );
        const entityPosY = BGUtil.topBorder + contentSize.height / 2;
        return new Vec3(entityPosX, entityPosY, 0);
    }

    updateEntitiesPositions(deltaTime: number) {
        this.node.children.forEach((entityNode) => {
            const entityState = entityNode.getComponent(Entity<EntityState>).state;

            entityNode.worldPosition = entityNode.worldPosition.add3f(
                this.getX(entityNode),
                entityState.ySpeed * deltaTime,
                0
            );

            const contentSize = entityNode.getComponent(UITransform).contentSize;

            if (entityNode.worldPosition.y < BGUtil.bottomBorder - contentSize.height / 2) {
                log(
                    "敌人超出底部边界，回收到对象池:",
                    OBJECT_POOL_KEY_PREFIX + entityNode.name.toUpperCase()
                );
                ObjectPoolManager.inst.put(
                    OBJECT_POOL_KEY_PREFIX + entityNode.name.toUpperCase(),
                    entityNode
                );
            }
        });
    }

    getX(entityNode: Node) {
        return 0;
    }
}
