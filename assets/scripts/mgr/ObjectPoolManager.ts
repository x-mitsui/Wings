import { _decorator, Node, NodePool, Prefab, instantiate, Tween, log, error, Sprite } from "cc";
import { Entity } from "../utils/Entity";
import { DataManager } from "./DataManager";
const { ccclass } = _decorator;

class NodePoolExt extends NodePool {
    type: "enemy" | "reward" | "bullet";
    prefab: Prefab;
    constructor(type: "enemy" | "reward" | "bullet", prefab: Prefab) {
        super();
        this.type = type;
        this.prefab = prefab;
    }
}
@ccclass("ObjectPoolManager")
export class ObjectPoolManager {
    private static _inst: ObjectPoolManager;
    public static get inst(): ObjectPoolManager {
        if (!this._inst) {
            this._inst = new ObjectPoolManager();
        }
        return this._inst;
    }
    private constructor() {}

    // 核心：存储不同对象池的字典，key 为 string, value 为 cc.NodePool
    private _poolDict: Map<string, NodePoolExt> = new Map();

    /**
     * 初始化一个特定类型的对象池
     * @param objPoolKey 对象池的唯一标识符 (如 "Bullet", "Enemy01")
     * @param prefab 对应的预制体
     * @param size 初始池容量
     */
    public initPool(
        type: "enemy" | "reward" | "bullet",
        objPoolKey: string,
        id: number,
        prefab: Prefab,
        size: number = 5
    ): void {
        if (!this._poolDict.has(objPoolKey)) {
            const nodePool = new NodePoolExt(type, prefab);
            this._poolDict.set(objPoolKey, nodePool);

            const config = DataManager.inst.getConfigs(type)[id];
            log("config-->", config);
            // 预生成指定数量的对象并放入池中
            for (let i = 0; i < size; ++i) {
                const node = instantiate(prefab);
                node.getComponent(Entity).init(config);
                if (type === "bullet") {
                    const bulletSpriteFrames = DataManager.inst.bulletSpriteFrames;
                    log("jjjjjjjjj", bulletSpriteFrames, config.skinSpriteFrameID);
                    node.getComponent(Sprite).spriteFrame =
                        bulletSpriteFrames[config.skinSpriteFrameID];
                }
                nodePool.put(node);
            }
            log(`对象池 "${objPoolKey}" 初始化完成，初始大小: ${size}`);
        }
    }

    /**
     * 从对象池中获取一个节点
     * @param objPoolKey 对象池的唯一标识符
     * @returns 可用的节点，如果池子和预制体都未初始化会返回 null
     */
    public get(objPoolKey: string): Node | null {
        log("get", objPoolKey);
        const pool = this._poolDict.get(objPoolKey);
        const { prefab, type } = pool;

        if (!pool || !prefab) {
            error(`对象池 "${objPoolKey}" 或其预制体未初始化！`);
            return null;
        }

        let node: Node;
        if (pool.size() > 0) {
            // 池中有空闲对象，直接取出
            node = pool.get();
        } else {
            // 池中无空闲对象，实例化一个新的; ps:这里不需要提前加入到pool里，下次put时会加入
            node = instantiate(prefab);
            const config = DataManager.inst
                .getConfigs(type)
                .find((config) => config.objPoolKey === objPoolKey);

            node.getComponent(Entity).init(config);
            log(`对象池 "${objPoolKey}" 已空，创建新实例。`);
        }

        // 确保节点处于活动状态
        node.active = true;
        log(
            `节点已从对象池取出: key: ${objPoolKey}, 节点名称: ${
                node.name
            }，当前池大小: ${pool.size()}`
        );
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
            error(`尝试回收节点到不存在的对象池: ${key}，节点将被销毁`);
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
        log(`节点已回收到对象池: key: ${key}, 节点名称: ${node.name}，当前池大小: ${pool.size()}`);
    }

    /**
     * 清空指定的对象池
     * @param objPoolKey 对象池的唯一标识符
     */
    public clear(objPoolKey: string): void {
        const pool = this._poolDict.get(objPoolKey);
        if (pool) {
            pool.clear();
            this._poolDict.delete(objPoolKey);
            log(`已清空对象池: ${objPoolKey}`);
        }
    }

    /**
     * 清空所有对象池（通常在切换场景时调用）
     */
    public clearAll(): void {
        for (const [_, pool] of this._poolDict) {
            pool.clear();
        }
        this._poolDict.clear();
        log("已清空所有对象池。");
    }
}
