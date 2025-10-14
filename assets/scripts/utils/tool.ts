import { math } from "cc";

export const checkIsIn = (inBox: math.Size, outBox: math.Size, point: math.Vec3) => {
    return (
        point.x > inBox.width / 2 &&
        point.x < outBox.width - inBox.width / 2 &&
        point.y > inBox.height / 2 &&
        point.y < outBox.height - inBox.height / 2
    );
};
