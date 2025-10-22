import { math, _decorator, resources, JsonAsset, UITransform, Node } from "cc";
const { ccclass, property } = _decorator;

export const checkIsIn = (inBox: math.Size, outBox: math.Size, point: math.Vec3) => {
    return (
        point.x > inBox.width / 2 &&
        point.x < outBox.width - inBox.width / 2 &&
        point.y > inBox.height / 2 &&
        point.y < outBox.height - inBox.height / 2
    );
};

export async function loadJSONPromise(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
        resources.load(path, JsonAsset, (err, jsonAsset) => {
            if (err) {
                reject(err);
            } else {
                resolve(jsonAsset.json);
            }
        });
    });
}

export const BGUtil = {
    init(bg: Node) {
        this.bg = bg;
    },
    destroy() {
        this.bg = null;
    },

    get bgWidth() {
        return this.bg.getComponent(UITransform).width;
    },

    get bgHeight() {
        return this.bg.getComponent(UITransform).height;
    },

    get bgLeftBorder() {
        return 0;
    },

    get bgRightBorder() {
        return this.bgWidth;
    },
    get bgTopBorder() {
        return this.bgHeight;
    },

    get bgBottomBorder() {
        return 0;
    }
};
