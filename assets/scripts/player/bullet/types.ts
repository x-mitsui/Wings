import { Node } from "cc";

export enum PlayerLevel {
    Lvl0,
    Lvl1
}

export enum BulletDirection {
    UP,
    DOWN,
    OTHER
}

export type BulletConfig = {
    player: Record<
        PlayerLevel,
        {
            direction: BulletDirection.UP;
            posNodeNames: string[];
            speed: number;
            skinSpriteFrameID: number;
        }
    >;
};

export type BulletCurrentLvlConfig = BulletConfig["player"][PlayerLevel] & { posNodes: Node[] };
