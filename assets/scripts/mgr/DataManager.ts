import { SpriteFrame } from "cc";

export class DataManager {
    private static _inst: DataManager;
    public static get inst(): DataManager {
        if (!this._inst) {
            this._inst = new DataManager();
        }
        return this._inst;
    }
    private constructor() {}

    private _configs: Record<string, any> = {};
    public getConfigs(type: string): any {
        return this._configs[type];
    }
    public setConfigs(type: string, configs: any): void {
        this._configs[type] = configs;
    }
    private _bulletSpriteFrames: SpriteFrame[] = [];
    public get bulletSpriteFrames(): SpriteFrame[] {
        return this._bulletSpriteFrames;
    }
    public set bulletSpriteFrames(bulletSpriteFrames: SpriteFrame[]) {
        this._bulletSpriteFrames = bulletSpriteFrames;
    }
}
