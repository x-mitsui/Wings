import {
    math,
    _decorator,
    resources,
    JsonAsset,
    UITransform,
    Node,
    Asset,
    log,
    view,
    screen
} from "cc";
const { ccclass, property } = _decorator;

export const checkIsIn = (inBox: math.Size, outBox: math.Size, point: math.Vec3) => {
    return (
        point.x > inBox.width / 2 &&
        point.x < outBox.width - inBox.width / 2 &&
        point.y > inBox.height / 2 &&
        point.y < outBox.height - inBox.height / 2
    );
};

export async function loadAssetPromise<T extends Asset>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
        resources.load(path, (err, asset: T) => {
            if (err) {
                reject(err);
            } else {
                resolve(asset);
            }
        });
    });
}

export async function loadAssetsPromise<T extends Asset>(paths: string[]): Promise<T[]> {
    return Promise.all(paths.map((path) => loadAssetPromise<T>(path)));
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
    get topBorder() {
        // return this.bgHeight;
        return view.getVisibleSize().height;
    },

    get bottomBorder() {
        return 0;
    }
};

export const printSizes = () => {
    // 获取物理分辨率（设备像素）
    const windowSize = screen.windowSize; // 或 screen.windowSize
    log("物理分辨率（设备像素）:", windowSize.width, "x", windowSize.height);

    // 获取设计分辨率（逻辑像素）
    const designSize = view.getDesignResolutionSize();
    log("设计分辨率（逻辑像素）:", designSize.width, "x", designSize.height);

    // 获取适配后的可视区域（最常用）
    // 加入策略是fitWidth，则visibleSize.width = windowSize.width，visibleSize.height = windowSize.height * designSize.width / designSize.height
    // 意思就是将设计分辨率的宽度撑大到物理分辨率的宽度，高度按比例缩放，这样就能知道在物理分辨率下，设计分辨率下的可视区域是多少，所以如果屏幕的高宽比大于设计分辨率的高宽比，那么上下就会出现黑边
    const visibleSize = view.getVisibleSize();
    log("适配后可视区域:", visibleSize.width, "x", visibleSize.height);

    // 获取画布的实际像素尺寸
    // const canvasSize = view.getCanvasSize(); // 等价于windowSize
    // log("画布实际像素:", canvasSize.width, "x", canvasSize.height);
};
