import { _decorator, Component, find, Prefab } from "cc";
import { BGUtil } from "../utils/tool";
import { ObjectPoolManager } from "../utils/ObjectPoolManager";
import {
    OBJECT_POOL_KEY_ENEMY0,
    OBJECT_POOL_KEY_ENEMY1,
    OBJECT_POOL_KEY_ENEMY2,
    OBJECT_POOL_KEY_BULLET
} from "../utils/CONST";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    @property(Prefab)
    enemy0Prefab: Prefab = null;
    @property(Prefab)
    enemy1Prefab: Prefab = null;
    @property(Prefab)
    enemy2Prefab: Prefab = null;
    @property(Prefab)
    bulletPrefab: Prefab = null;
    protected onLoad(): void {
        BGUtil.init(find("Canvas-GAME/bg/bg0"));

        ObjectPoolManager.instance.initPool(OBJECT_POOL_KEY_ENEMY0, this.enemy0Prefab, 5);
        ObjectPoolManager.instance.initPool(OBJECT_POOL_KEY_ENEMY1, this.enemy1Prefab, 5);
        ObjectPoolManager.instance.initPool(OBJECT_POOL_KEY_ENEMY2, this.enemy2Prefab, 5);
        ObjectPoolManager.instance.initPool(OBJECT_POOL_KEY_BULLET, this.bulletPrefab, 10);
    }

    onDestroy(): boolean {
        BGUtil.destroy();
        return true;
    }
}
