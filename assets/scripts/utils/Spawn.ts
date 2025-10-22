import { _decorator, Component, instantiate, math, Node, Prefab, UITransform, Vec3 } from "cc";
import { EntityState } from "./EntityState";
import { BGUtil } from "./tool";
const { ccclass, property } = _decorator;

@ccclass("EntityConfig")
class EntityConfig {
    @property({
        displayName: "生产频率（单位秒）"
    })
    spawnRate = 1;
    @property(Prefab)
    prefab: Prefab = null;
}
@ccclass("Spawn")
export class Spawn extends Component {
    @property(EntityConfig)
    entityConfigs: EntityConfig[] = [];

    /** 三级属性 */
    // 需要若干timer，依据操作的个数决定
    timers = [];
    // 记录每个敌人的spawn出生频率
    spawnRates = [];

    onLoad() {
        this.spawnRates = this.entityConfigs.map((item) => {
            this.timers.push(0);
            return item.spawnRate;
        });
    }

    update(deltaTime: number) {
        for (let i = 0; i < this.timers.length; i++) {
            this.timers[i] += deltaTime;
            if (this.timers[i] >= this.spawnRates[i]) {
                this.timers[i] = 0;
                this.spawnEntity(this.entityConfigs[i]);
            }
            this.updateEntitiesPositions(deltaTime);
        }
    }

    spawnEntity(entityConfig: EntityConfig) {
        const entityNode = instantiate(entityConfig.prefab);
        entityNode.parent = this.node;
        entityNode.setWorldPosition(this.getSpawnPos(entityNode));
        return entityNode;
    }

    getSpawnPos(entityNode: Node) {
        const contentSize = entityNode.getComponent(UITransform).contentSize;
        const entityPosX = math.randomRangeInt(
            contentSize.width / 2,
            BGUtil.bgRightBorder - contentSize.width / 2
        );
        const entityPosY = BGUtil.bgTopBorder + contentSize.height / 2;
        return new Vec3(entityPosX, entityPosY, 0);
    }

    updateEntitiesPositions(deltaTime: number) {
        this.node.children.forEach((entityNode) => {
            const entityState = entityNode.getComponent(EntityState);

            entityNode.worldPosition = entityNode.worldPosition.add3f(
                this.getXDelta(entityNode),
                entityState.speed * deltaTime,
                0
            );

            const contentSize = entityNode.getComponent(UITransform).contentSize;

            if (entityNode.worldPosition.y < BGUtil.bgBottomBorder - contentSize.height / 2)
                entityNode.destroy();
        });
    }

    getXDelta(entityNode: Node) {
        return 0;
    }
}
