// 水平方向往哪边移动
export enum XDirection {
    Left = -1, // 向左
    Right = 1, // 向右
    NULL = 0
}

export type RewardData = {
    id: number;
    ySpeed: number;
    spawnRate: number;
    objPoolKey: string;
    duration: number; // buff生效时间
    xDirection: XDirection;
    xSpeed: number; // x轴方向移动的速度
};
