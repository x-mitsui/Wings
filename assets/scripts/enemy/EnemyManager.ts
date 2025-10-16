import {
    _decorator,
    Component,
    EmptyDevice,
    instantiate,
    math,
    Node,
    Prefab,
    UITransform,
    Vec3
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("EnemyConfig")
class EnemyConfig {
    @property
    type = 0;
    @property
    spawnRate = 1;
    @property
    speed = 300;
    @property(Prefab)
    prefab: Prefab = null;
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
    // 记录每个敌人的type
    nodeTypeDict: Map<Node, number> = new Map();
    onLoad() {
        this.spawnRates = this.enemyConfigs
            .map((item) => item.spawnRate)
            .map((item) => {
                this.timers.push(0);
                return item;
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
        this.nodeTypeDict.set(enemyNode, enemyConfig.type);
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
        const enemyPosY = bgSize.height + contentSize.height;
        return new Vec3(enemyPosX, enemyPosY, 0);
    }

    updateEnemiesPositions(deltaTime: number) {
        this.node.children.forEach((enemyNode) => {
            const enemyConfig = this.enemyConfigs[this.nodeTypeDict.get(enemyNode)];
            if (!enemyConfig) {
                return;
            }
            enemyNode.position = enemyNode.position.add3f(0, enemyConfig.speed * deltaTime, 0);

            const contentSize = enemyNode.getComponent(UITransform).contentSize;
            if (enemyNode.position.y < -contentSize.height / 2) {
                enemyNode.destroy();
            }
        });
    }
}
