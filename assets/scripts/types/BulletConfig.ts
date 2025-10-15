import { Node } from "cc";
import { BulletDirection, PlayerLevel } from "../common";

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
