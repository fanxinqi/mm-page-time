import { rewriteHistroy, Store, EventEmitter } from "./utils";
import { v4 as uuidv4 } from "uuid";
// import moment from 'moment';

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
  private startTime: number = 0;
  private endTime: number = 0;
  private duration: number = 0;
  private unActionStartTime: number = 0;
  private unActionEndTime: number = 0;
  private unActiveDuration: number[] = [];
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
      Store.clearAll();
    });
  }

  private initSPAPage(): void {
    // this.initHashEvent();
    this.initHistoryEvent();
  }

  private initMPAPage(): void {
    window.addEventListener("beforeunload", () => {
      // 在隐藏状态下直接关闭页面，要记录
      if (this.unActionStartTime > 0 && !this.unActionEndTime) {
        this.unActionEndTime = new Date().getTime();
        this.unActiveDuration.push(this.unActionEndTime - this.unActionStartTime);
        Store.update(this.uniqueName, {
          unActionEndTime: this.unActionEndTime,
          unActiveDuration: this.unActiveDuration,
          location: window.location,
        });
      }
      if (new Date().getTime() > this.startTime) {
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
    // 单页面第一次加载模版页面
    if (!this.startTime) return;
    // pre page end time record
    this.endTime = new Date().getTime();
    this.duration = this.endTime - this.startTime;
    // const record = Store.getStore(this.uniqueName);
    // this.duration - this.unActiveDuration < 0 fix:
    const totalUnActiveDuration = this.unActiveDuration.reduce((pre, cur) => pre + cur, 0)
    Store.update(this.uniqueName, {
      endTime: this.endTime,
      duration:
        this.duration - totalUnActiveDuration > 0
          ? this.duration - totalUnActiveDuration
          : this.duration,
      //某些情况下startTime和location会丢失，所以重新存一次
      startTime: this.startTime,
      location: window.location,
      unActiveDuration: this.unActiveDuration,
    });

    // notice pre page haven end
    const pageRecord = Store.getStore(this.uniqueName);
    if (pageRecord && this.duration > 0) {
      this.emit("pageLeave", pageRecord);
      this.clean();
    }

    if (type != "beforeunload" && type != "pagehide") {
      // current page set start time record
      this.startTime = new Date().getTime();
      Store.update(this.uniqueName, {
        startTime: this.startTime,
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
    this.startTime = new Date().getTime();
    this.setCurrentUniqueName();
    Store.update(this.uniqueName, {
      startTime: this.startTime,
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
    if (this.unActionStartTime) return
    this.unActionStartTime = new Date().getTime();
    this.unActionEndTime = 0
    Store.update(this.uniqueName, {
      unActionStartTime: this.unActionStartTime,
      location: window.location,
    });
  }

  private handleUnActionEndTime() {
    if (this.unActionEndTime || !this.unActionStartTime) return
    this.unActionEndTime = new Date().getTime();

    this.unActiveDuration.push(this.unActionEndTime - this.unActionStartTime);
    this.unActionStartTime = 0;
    // 为啥不用this.uniqueName 无法获取当前上下文...
    Store.update(this.uniqueName, {
      unActionEndTime: this.unActionEndTime,
      unActiveDuration: this.unActiveDuration,
      location: window.location,
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
    this.unActionStartTime = 0;
    this.unActiveDuration = [];
    this.duration = 0;
    this.startTime = 0;
    this.endTime = 0;
    Store.clearAll();
  }

  private setCurrentUniqueName() {
    this.uniqueName = uuidv4();
  }

  // 未实现
  public destroy() {
  }
}

export default MmTpTracer;
