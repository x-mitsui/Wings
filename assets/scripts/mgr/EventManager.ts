// EventManager.js - 创建一个全局事件管理器
import { EventTarget } from "cc";

class EventManager {
    eventTarget: EventTarget = null;
    constructor() {
        this.eventTarget = new EventTarget();
    }

    // 监听事件
    on(eventName, callback, target) {
        this.eventTarget.on(eventName, callback, target);
    }

    // 触发事件
    emit(eventName, ...args) {
        this.eventTarget.emit(eventName, ...args);
    }

    // 移除监听
    off(eventName, callback, target) {
        this.eventTarget.off(eventName, callback, target);
    }
}

// 导出为单例，保证全局唯一
export const eventManager = new EventManager();
