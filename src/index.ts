import { rewriteHistroy, Store, EventEmitter } from "./utils";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const TIME_ON_PANGE_STORE_NAME = "time_on_page_store_name";
Store.storeName = TIME_ON_PANGE_STORE_NAME;

interface IMmTpTracer {
  init(): void;

  //  send():void;
}

declare interface Window {
  uniqueName: string;
}

class MmTpTracer extends EventEmitter implements IMmTpTracer {
  private uniqueName: string;

  constructor() {
    super();
  }

  public init(): void {
    // page entry event
    this.initPageShow();
    // page exit event
    // this.initPageExitEvent();

    // page active change event
    this.initActiveChangeEvent();
    this.initSPAPage();
    this.initMPAPage();
    this.on("sendSuccess", function() {
      Store.clear(this.uniqueName);
    });
  }

  private initSPAPage(): void {
    // this.initHashEvent();
    this.initHistoryEvent();
  }

  private initMPAPage(): void {
    window.addEventListener("beforeunload", () => {
      // 在隐藏状态下直接关闭页面，要记录
      const {
        unActionStartTime = 0,
        unActionEndTime = 0,
        unActiveDuration = [],
        startTime = 0
      } = Store.getStore(this.uniqueName)

      if (unActionStartTime > 0 && !unActionEndTime) {
        const currentUnActionEndTime = new Date().getTime();
        unActiveDuration.push(currentUnActionEndTime - unActionStartTime);
        Store.update(this.uniqueName, {
          unActionEndTime: currentUnActionEndTime,
          unActiveDuration,
          location: window.location,
          unActionStartTime: 0,
        });
      }
      if (new Date().getTime() > startTime) {
        this.setPageChangeState("beforeunload");
      }
    });
  }

  private initHistoryEvent(): void {
    window.history.pushState = rewriteHistroy("pushState");
    window.history.replaceState = rewriteHistroy("replaceState");
    window.addEventListener("popstate", () => {
      this.setPageChangeState();
    });
    window.addEventListener("pushstate", () => {
      this.setPageChangeState();
    });
    window.addEventListener("replacestate", () => {
      this.setPageChangeState();
    });
  }

  private setPageChangeState(type?: string) {
    const { startTime = 0, unActiveDuration = [] } = Store.getStore(this.uniqueName)
    // 单页面第一次加载模版页面
    if (!startTime) return;
    const currentEndTime = new Date().getTime()
    const duration = currentEndTime - startTime;
    const totalUnActiveDuration = unActiveDuration.reduce((pre: number, cur: number) => pre + cur, 0)
    Store.update(this.uniqueName, {
      endTime: currentEndTime,
      duration:
        duration - totalUnActiveDuration > 0
          ? duration - totalUnActiveDuration
          : duration,
    });

    // notice pre page haven end
    const pageRecord = Store.getStore(this.uniqueName);
    if (pageRecord && duration > 0) {
      this.emit("pageLeave", pageRecord);
    }
    this.clean();
    if (type != "beforeunload" && type != "pagehide") {
      // current page set start time record
      Store.update(this.uniqueName, {
        startTime: new Date().getTime(),
        location: window.location,
      });
    }
  }

  // hash router can use popstate event
  // private initHashEvent() {
  //   window.addEventListener("hashchange", () => {
  //     console.log("initHashEvent");
  //     this.setPageChangeState();
  //   });
  // }

  // page show event
  private initPageShow() {
    // page entry record
    window.addEventListener("pageshow", () => {
      this.recordStart();
    });
  }

  private recordStart() {
    this.setCurrentUniqueName();
    Store.update(this.uniqueName, {
      startTime: new Date().getTime(),
      location: window.location,
    });
  }

  // page exit event
  // private initPageExitEvent() {
  //   window.addEventListener("pagehide", () => {
  //     this.setPageChangeState("pagehide");
  //   });
  // }
  private handleUnActionStartTime() {
    const { startTime = 0, unActionStartTime = 0, } = Store.getStore(this.uniqueName)
    if (unActionStartTime || !startTime) return
    Store.update(this.uniqueName, {
      unActionStartTime: new Date().getTime(),
      unActionEndTime: 0,
    });
  }

  private handleUnActionEndTime() {
    const { unActionEndTime = 0, unActionStartTime = 0, unActiveDuration = [] } = Store.getStore(this.uniqueName)
    if (unActionEndTime || !unActionStartTime) return
    const currentUnActionEndTime = new Date().getTime()
    unActiveDuration.push(currentUnActionEndTime - unActionStartTime);
    // 为啥不用this.uniqueName 无法获取当前上下文...
    Store.update(this.uniqueName, {
      unActionEndTime: currentUnActionEndTime,
      unActiveDuration: unActiveDuration,
      unActionStartTime: 0,
    });
  }

  // page active change event
  private initActiveChangeEvent() {
    window.addEventListener("visibilitychange", (event) => {
      if (document.hidden) {
        this.handleUnActionStartTime()
      }
    });
    window.addEventListener('focus', (e) => {
      this.handleUnActionEndTime()
    })
    window.addEventListener('blur', (e) => {
      this.handleUnActionStartTime()
    })
  }


  // clear all
  private clean() {
    Store.clear(this.uniqueName);
  }

  private setCurrentUniqueName() {
    this.uniqueName = uuidv4();
  }

  // 未实现
  public destroy() {
  }
}

export default MmTpTracer;
