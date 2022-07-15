/*
 * history monkey patch
 */
export const rewriteHistroy = function (type: string) {
  let routerApi = (window as any).history[type];

  return function () {
    let result = routerApi.apply(this, arguments);

    let e = new Event(type.toLowerCase());

    (e as any).arguments = arguments;

    window.dispatchEvent(e);

    return result;
  };
};

// localstore manage
export class Store {
  public static storeName: string;
  public static setStore(name: string, value: Object) {
    const newValue: any = {};
    newValue[name] = value;
    try {
      window.localStorage.setItem(this.storeName, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  }
  public static getStore(name: string) {
    try {
      return (
        JSON.parse(window.localStorage.getItem(this.storeName))[name] || {}
      );
    } catch (error) {
      return {};
    }
  }

  public static getALLStore() {
    try {
      return JSON.parse(window.localStorage.getItem(this.storeName)) || {};
    } catch (error) {
      return {};
    }
  }

  public static clearAll() {
    try {
      return window.localStorage.removeItem(this.storeName);
    } catch (error) {
      return {};
    }
  }
  public static clear(name:string) {
    try {
      const storeData = Store.getALLStore();
      return window.localStorage.removeItem(storeData[name]);
    } catch (error) {
      return {};
    }
  }

  public static update(name: string, value: Object) {
    try {
      const storeData = Store.getALLStore() || {};
      if(Object.getOwnPropertyNames(storeData).length > 50) {
        delete storeData[Object.keys(storeData)[0]]
      }
      storeData[name] = Object.assign(storeData[name] || {}, value);
      // const upadeData: any = {};
      // upadeData[name] = value;
      window.localStorage.setItem(this.storeName, JSON.stringify(storeData));
    } catch (error) {
      console.error(error);
    }
  }
}

interface EventList {
  [key: string]: Array<Function>;
}

/**
 *  event emitter interface
 */
interface IEventEmitter {
  /**
   * 监听事件
   * @param eventName
   * @param handle
   */
  on(eventName: string, handle: Function): void;
  /**
   * 触发事件
   * @param eventName
   * @param args
   */
  emit(eventName: string, ...args: any): void;
  /**
   * 注销事件
   * @param eventName
   * @param args
   */
  off(eventName: string, handle: Function): void;
}

/**
 *  event emitter class
 */

export class EventEmitter implements IEventEmitter {
  private eventList: EventList;
  constructor() {
    this.eventList = {};
  }
  on(eventName: string, handle: Function): void {
    if (Array.isArray(this.eventList[eventName])) {
      this.eventList[eventName].push(handle);
    } else {
      this.eventList[eventName] = [handle];
    }
  }
  emit(eventName: string, ...args: any): void {
    if (this.eventList[eventName]) {
      this.eventList[eventName].forEach((cb) => {
        cb.apply(null, args);
      });
    }
  }
  off(eventName: string, handle: Function): void {
    var arr = this.eventList[eventName] || [];
    var i = arr.indexOf(handle);
    if (i >= 0) {
      this.eventList[eventName].splice(i, 1);
    }
  }
}
