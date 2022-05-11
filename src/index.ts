import { rewriteHistroy, Store, EventEmitter } from "./utils";
import { v4 as uuidv4 } from "uuid";

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
  private unActiveDuration: number = 0;
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
    this.on("sendSuccess", function () {
      Store.clearAll();
    });
  }

  private initSPAPage(): void {
    // this.initHashEvent();
    this.initHistoryEvent();
  }
  private initMPAPage(): void {
    window.addEventListener("beforeunload", () => {
      this.setPageChangeState();
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
    // pre page end time record
    this.endTime = new Date().getTime();
    this.duration = this.endTime - this.startTime;
    // const record = Store.getStore(this.uniqueName);
    Store.update(this.uniqueName, {
      endTime: this.endTime,
      duration: this.duration - this.unActiveDuration,
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
      this.startTime = new Date().getTime();
      this.setCurrentUniqueName();
      Store.update(this.uniqueName, {
        startTime: this.startTime,
        location: window.location,
      });
    });
  }

  // page exit event
  // private initPageExitEvent() {
  //   window.addEventListener("pagehide", () => {
  //     this.setPageChangeState("pagehide");
  //   });
  // }

  // page active change event
  private initActiveChangeEvent() {
    window.addEventListener("visibilitychange", (event) => {
      if (document.hidden) {
        this.unActionStartTime = new Date().getTime();
        Store.update(this.uniqueName, {
          unActionStartTime: this.unActionStartTime,
        });
      } else {
        const unActionEndTime = new Date().getTime();
        this.unActiveDuration = unActionEndTime - this.unActionStartTime;
        // 为啥不用this.uniqueName 无法获取当前上下文...
        Store.update(this.uniqueName, {
          unActionEndTime,
          unActiveDuration: this.unActiveDuration,
        });
      }
    });
  }

  // clear all
  private clean() {
    this.unActionStartTime = 0;
    this.unActiveDuration = 0;
    this.duration = 0;
    this.startTime = 0;
    this.endTime = 0;
    Store.clearAll();
  }

  private setCurrentUniqueName() {
    this.uniqueName = uuidv4();
  }
}

export default MmTpTracer;
