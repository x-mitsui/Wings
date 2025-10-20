import { _decorator, Component, instantiate, math, Node, Prefab, UITransform, Vec3 } from "cc";
import { Enemy } from "./Enemy";
const { ccclass, property } = _decorator;

@ccclass("EnemyConfig")
class EnemyConfig {
    @property({
        displayName: "生产频率（单位秒）"
    })
    spawnRate = 1;
    @property(Prefab)
    prefab: Prefab = null;
}

class EnemyConfigEx extends EnemyConfig {
    kind = 0;
    hp = 1;
    speed = -300;
}
@ccclass("EnemyManager")
export class EnemyManager extends Component {
    @property(EnemyConfig)
    enemyConfigs: EnemyConfig[] = [];
    @property(Node)
    bgNode: Node = null;
    /** 三级属性 */
    // 需要若干timer，依据操作的个数决定
    timers = [];
    // 记录每个敌人的spawn出生频率
    spawnRates = [];
    onLoad() {
        this.spawnRates = this.enemyConfigs.map((item) => {
            this.timers.push(0);
            return item.spawnRate;
        });
    }

    update(deltaTime: number) {
        for (let i = 0; i < this.timers.length; i++) {
            this.timers[i] += deltaTime;
            if (this.timers[i] >= this.spawnRates[i]) {
                this.timers[i] = 0;
                this.spawnEnemy(this.enemyConfigs[i]);
            }
            this.updateEnemiesPositions(deltaTime);
        }
    }

    spawnEnemy(enemyConfig: EnemyConfig) {
        const enemyNode = instantiate(enemyConfig.prefab);
        enemyNode.parent = this.node;
        enemyNode.setPosition(this.getSpawnPos(enemyNode));
        return enemyNode;
    }

    getSpawnPos(enemyNode: Node) {
        const contentSize = enemyNode.getComponent(UITransform).contentSize;
        const bgSize = this.bgNode.getComponent(UITransform).contentSize;
        const enemyPosX = math.randomRangeInt(
            contentSize.width / 2,
            bgSize.width - contentSize.width / 2
        );
        const enemyPosY = bgSize.height + contentSize.height / 2;
        return new Vec3(enemyPosX, enemyPosY, 0);
    }

    updateEnemiesPositions(deltaTime: number) {
        this.node.children.forEach((enemyNode) => {
            const enemyState = enemyNode.getComponent(Enemy);

            enemyNode.position = enemyNode.position.add3f(0, enemyState.speed * deltaTime, 0);

            const contentSize = enemyNode.getComponent(UITransform).contentSize;

            if (enemyNode.position.y < -contentSize.height / 2) enemyNode.destroy();
        });
    }
}
