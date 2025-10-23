// ObjectPoolManager.ts
import {
    _decorator,
    Node,
    NodePool,
    Prefab,
    director,
    instantiate,
    Tween,
    tween,
    log,
    Director
} from "cc";
const { ccclass } = _decorator;

@ccclass("ObjectPoolManager")
export class ObjectPoolManager {
    private static _instance: ObjectPoolManager;
    public static get instance(): ObjectPoolManager {
        if (!this._instance) {
            this._instance = new ObjectPoolManager();
            // 可选：监听场景切换事件，在需要时清空池子
            director.on(
                Director.EVENT_BEFORE_SCENE_LAUNCH,
                this._instance.clearAll,
                this._instance
            );
        }
        return this._instance;
    }

    // 核心：存储不同对象池的字典，key 为 string, value 为 cc.NodePool
    private _poolDict: Map<string, NodePool> = new Map();
    // 存储 key 与预制体的对应关系，用于在池子为空时方便创建新对象
    private _prefabDict: Map<string, Prefab> = new Map();

    /**
     * 初始化一个特定类型的对象池
     * @param key 对象池的唯一标识符 (如 "Bullet", "Enemy01")
     * @param prefab 对应的预制体
     * @param size 初始池容量
     */
    public initPool(key: string, prefab: Prefab, size: number = 5): void {
        // 如果池子不存在，则新建一个
        if (!this._poolDict.has(key)) {
            const nodePool = new NodePool();
            this._poolDict.set(key, nodePool);
            this._prefabDict.set(key, prefab);

            // 预生成指定数量的对象并放入池中
            for (let i = 0; i < size; ++i) {
                const node = instantiate(prefab);
                nodePool.put(node);
            }
            log(`对象池 "${key}" 初始化完成，初始大小: ${size}`);
        }
    }

    /**
     * 从对象池中获取一个节点
     * @param key 对象池的唯一标识符
     * @returns 可用的节点，如果池子和预制体都未初始化会返回 null
     */
    public get(key: string): Node | null {
        const pool = this._poolDict.get(key);
        const prefab = this._prefabDict.get(key);

        if (!pool || !prefab) {
            console.warn(`对象池 "${key}" 或其预制体未初始化！`);
            return null;
        }

        let node: Node;
        if (pool.size() > 0) {
            // 池中有空闲对象，直接取出
            node = pool.get();
        } else {
            // 池中无空闲对象，实例化一个新的; ps:这里不需要提前加入到pool里，下次put时会加入
            node = instantiate(prefab);
            log(`对象池 "${key}" 已空，创建新实例。`);
        }

        // 确保节点处于活动状态
        node.active = true;
        return node;
    }

    /**
     * 将节点回收到对象池
     * @param key 节点所属对象池的唯一标识符
     * @param node 要回收的节点
     */
    public put(key: string, node: Node): void {
        const pool = this._poolDict.get(key);
        if (!pool) {
            console.warn(`尝试回收节点到不存在的对象池: ${key}，节点将被销毁`);
            node.destroy();
            return;
        }

        // 回收前的清理工作
        node.active = false;
        // 从父节点移除，这是关键一步，避免节点仍存在于场景树中
        node.removeFromParent();
        // 停止节点上所有可能正在运行的动作或计时器
        Tween.stopAllByTarget(node);

        // 放回对象池
        pool.put(node);
    }

    /**
     * 清空指定的对象池
     * @param key 对象池的唯一标识符
     */
    public clear(key: string): void {
        const pool = this._poolDict.get(key);
        if (pool) {
            pool.clear();
            this._poolDict.delete(key);
            this._prefabDict.delete(key);
            log(`已清空对象池: ${key}`);
        }
    }

    /**
     * 清空所有对象池（通常在切换场景时调用）
     */
    public clearAll(): void {
        for (const [key, pool] of this._poolDict) {
            pool.clear();
        }
        this._poolDict.clear();
        this._prefabDict.clear();
        log("已清空所有对象池。");
    }
}
