import {
    _decorator,
    Button,
    Component,
    error,
    JsonAsset,
    Label,
    log,
    Prefab,
    ProgressBar,
    resources,
    SpriteFrame
} from "cc";
import { loadAssetPromise, loadAssetsPromise } from "../utils/tool";
import { ObjectPoolManager } from "../mgr/ObjectPoolManager";
import {
    OBJECT_POOL_KEY_BULLET0,
    OBJECT_POOL_KEY_BULLET1,
    OBJECT_POOL_KEY_ENEMY0,
    OBJECT_POOL_KEY_ENEMY1,
    OBJECT_POOL_KEY_ENEMY2,
    OBJECT_POOL_KEY_REWARD_BOMB,
    OBJECT_POOL_KEY_REWARD_DOUBLE_BULLET
} from "../utils/CONST";
import { DataManager } from "../mgr/DataManager";
const { ccclass, property } = _decorator;

@ccclass("Loading")
export class Loading extends Component {
    @property(ProgressBar)
    progressBar: ProgressBar | null = null;
    @property(Label)
    progressLabel: Label | null = null;
    @property(Label)
    detailLabel: Label | null = null;

    private readonly resourceDirs: string[] = ["configs", "prefabs", "sounds", "sprites"];
    private totalDirsToLoad: number = 0;
    private completedDirsCount: number = 0;
    private overallProgress: number = 0;
    private currentLoadingDir: string = "";

    start() {
        this.startLoading();
    }

    async startLoading() {
        this.totalDirsToLoad = this.resourceDirs.length;
        this.completedDirsCount = 0;
        this.overallProgress = 0;
        this.updateUI("准备开始加载...", 0);

        // 顺序加载每个目录
        for (let i = 0; i < this.resourceDirs.length; i++) {
            await this.loadSingleDir(this.resourceDirs[i], i);
        }

        await this.collectResourceData();
        await this.initObjectPool();
        this.updateUI("✅ 所有资源加载完成！");
        this.node.getChildByName("startBtn").getComponent(Button).interactable = true;
    }

    private jsonInfos = [
        {
            type: "enemy",
            path: "configs/enemy"
        },
        {
            type: "reward",
            path: "configs/reward"
        },
        {
            type: "bullet",
            path: "configs/playerBullet"
        }
    ];
    async collectResourceData() {
        for (const item of this.jsonInfos) {
            const cfgJson = (await loadAssetPromise<JsonAsset>(item.path)).json;
            log("cfgJson:", cfgJson);
            DataManager.inst.setConfigs(item.type, cfgJson);
        }

        const bulletSpriteFrames = await loadAssetsPromise<SpriteFrame>([
            "sprites/bullet/bullet0/spriteFrame",
            "sprites/bullet/bullet1/spriteFrame"
        ]);
        log("bulletSpriteFrames:", bulletSpriteFrames);
        DataManager.inst.bulletSpriteFrames = bulletSpriteFrames;
    }
    private poolPrefabInfo: {
        type: "enemy" | "reward" | "bullet";
        id: number; // 对应配置的id
        path: string;
        objPoolKey: string;
        size: number;
    }[] = [
        {
            type: "enemy",
            id: 0,
            path: "prefabs/enemy/enemy0",
            objPoolKey: OBJECT_POOL_KEY_ENEMY0,
            size: 5
        },
        {
            type: "enemy",
            id: 1,
            path: "prefabs/enemy/enemy1",
            objPoolKey: OBJECT_POOL_KEY_ENEMY1,
            size: 5
        },
        {
            type: "enemy",
            id: 2,
            path: "prefabs/enemy/enemy2",
            objPoolKey: OBJECT_POOL_KEY_ENEMY2,
            size: 5
        },
        {
            type: "bullet",
            id: 0,
            path: "prefabs/bullet/bullet0",
            objPoolKey: OBJECT_POOL_KEY_BULLET0,
            size: 5
        },
        {
            type: "bullet",
            id: 1,
            path: "prefabs/bullet/bullet0",
            objPoolKey: OBJECT_POOL_KEY_BULLET1,
            size: 10
        },
        {
            type: "reward",
            id: 0,
            path: "prefabs/reward/reward_double_bullet",
            objPoolKey: OBJECT_POOL_KEY_REWARD_DOUBLE_BULLET,
            size: 5
        },
        {
            type: "reward",
            id: 1,
            path: "prefabs/reward/reward_bomb",
            objPoolKey: OBJECT_POOL_KEY_REWARD_BOMB,
            size: 5
        }
    ];
    private async initObjectPool() {
        for (const item of this.poolPrefabInfo) {
            const { type, id, path, objPoolKey, size } = item;
            const prefab = await loadAssetPromise<Prefab>(path);
            ObjectPoolManager.inst.initPool(type, objPoolKey, id, prefab, size);
        }
    }

    private loadSingleDir(dirPath: string, dirIndex: number): Promise<void> {
        return new Promise((resolve) => {
            resources.preloadDir(
                dirPath,
                (finished, total) => {
                    // 精确计算：已完成目录的固定进度 + 当前目录的实时进度
                    const baseProgress = dirIndex / this.totalDirsToLoad; // 已完成目录占的份额
                    const currentDirProgress = finished / total / this.totalDirsToLoad; // 当前目录进度占的份额
                    this.overallProgress = baseProgress + currentDirProgress;

                    this.updateUI(
                        `加载中: ${dirPath} (${finished}/${total})`,
                        this.overallProgress
                    );
                },
                (err, assets) => {
                    if (err) {
                        error(`加载目录 ${dirPath} 时出错:`, err);
                    } else {
                        log(`目录 ${dirPath} 预加载完成`);
                    }

                    // 调试：打印所有加载的资源路径
                    // assets.forEach((asset, index) => {
                    //     if (asset instanceof Asset) {
                    //         log(
                    //             `${index + 1}. ${asset.name || "unnamed"} - ${
                    //                 asset.constructor.name
                    //             } - ${asset.uuid}`
                    //         );
                    //     } else {
                    //         log(`${index + 1}. 未知资源类型:`, asset);
                    //     }
                    // });
                    this.completedDirsCount++;
                    resolve();
                }
            );
        });
    }
    private updateUI(detail: string, progress?: number) {
        if (progress !== undefined) {
            const safeProgress = Math.min(Math.max(progress, 0), 1);
            if (this.progressBar) this.progressBar.progress = safeProgress;
            if (this.progressLabel) {
                this.progressLabel.string = `总进度: ${Math.floor(safeProgress * 100)}%`;
            }
        }

        if (this.detailLabel) {
            this.detailLabel.string = detail;
        }
        log(detail);
    }

    // private onAllResourcesLoaded() {
    //     this.updateUI("✅ 所有资源加载完成！");
    //     this.node.getChildByName("startBtn").getComponent(Button).interactable = true;
    //     // 改为异步加载确保资源存在
    //     resources.load<Prefab>("prefabs/enemy/enemy0", (err, prefab) => {
    //         if (err || !prefab) {
    //             error("加载Prefab失败:", err);
    //             return;
    //         }

    //         const enemyNode = instantiate(prefab);
    //         this.node.addChild(enemyNode);
    //         enemyNode.setPosition(0, 0, 0);
    //         tween(enemyNode)
    //             .to(1, { position: new Vec3(0, 180, 0) })
    //             .to(1, { position: new Vec3(0, 0, 0) })
    //             .by(1, { eulerAngles: new Vec3(0, 0, 180) })
    //             .union() // 合并动画
    //             .repeatForever()
    //             .start();

    //         // director.loadScene("MainScene");
    //     });
    // }
}
