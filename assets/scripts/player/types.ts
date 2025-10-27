import { Node } from "cc";

export type PlayerBulletState = {
    isHitten: boolean;
    type: "bullet";
    kind: number;
    direction: BulletDirection;
    posNodeNames: string[];
    ySpeed: number;
    skinSpriteFrameID: number;
    objPoolKey: string;
};

export enum PlayerLevel {
    Lvl0,
    Lvl1
}

export enum BulletDirection {
    UP,
    DOWN,
    OTHER
}

export type PlayerBulletConfig = Record<
    PlayerLevel,
    {
        direction: BulletDirection.UP;
        posNodeNames: string[];
        speed: number;
        skinSpriteFrameID: number;
    }
>;

export type BulletCurrentLvlConfig = PlayerBulletConfig[PlayerLevel] & { posNodes: Node[] };
