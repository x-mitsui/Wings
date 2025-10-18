import { Node } from "cc";

export enum PlayerLevel {
    Lvl1 = "Lvl1",
    Lvl2 = "Lvl2"
}

export enum BulletDirection {
    UP = "UP",
    DOWN = "DOWN",
    OTHER = "OTHER"
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
