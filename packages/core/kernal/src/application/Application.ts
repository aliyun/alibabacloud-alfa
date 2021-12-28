import { removeContext, VMContext } from '@alicloud/console-os-browser-vm';

import { Parcel, mountRootParcel } from 'single-spa';
import { serializeData, flattenFnArray } from '../misc/util';
import { AppInfo, SandBoxOption } from '../type';
import { createEventBus } from './createEventBus';
import { createAppLoader } from './createSingleSpaLoader';

const eventBus = createEventBus();

type ApplicationResolver = (value: Application | PromiseLike<Application>) => Promise<Application> | void;
type ApplicationRejecter = (reason?: any) => Promise<Application> | void;
/**
 * Application
 */
export class Application {
  public context: VMContext & { _aliOSKernel?: any };
  public parcel?: Parcel;
  public remoteApp;
  public allowEvents: string[];

  private appInfo: AppInfo;
  private inited: boolean;
  private pendingPromise: Promise<Application>;
  private _pendingResolver: ApplicationResolver;
  private _pendingRejecter: ApplicationRejecter;

  public constructor(appInfo: AppInfo, context: VMContext, option?: SandBoxOption) {
    this.appInfo = appInfo;
    this.context = context;
    this.inited = false;

    const DEFAULT_EVENTS = [
      this.historyEventName
    ];

    this.allowEvents = option.allowEvents ? [
      ...option.allowEvents,
      ...DEFAULT_EVENTS
    ] : [
      ...DEFAULT_EVENTS
    ];
  }

  public isInited() {
    return this.inited;
  }

  public setPendingPromise(p: Promise<Application>) {
    this.pendingPromise = p;
  }

  public getPendingPromise() {
    return this.pendingPromise;
  }

  public setPendingResolver(resolver: ApplicationResolver) {
    this._pendingResolver = resolver;
  }

  public get pendingResolver() {
    return this._pendingResolver;
  }

  public setPendingRejecter(reject: ApplicationRejecter) {
    this._pendingRejecter = reject;
  }

  public get pendingRejecter() {
    return this._pendingRejecter;
  }

  /**
   * 
   */
  public async load() {
    if (!this.remoteApp) {
      this.remoteApp = await createAppLoader(this.appInfo, this.context);
    }
    this.inited = true;
    return this.remoteApp;
  }

  /**
   * public api for mount logic for app
   */
  public async mount(dom?: Element, { customProps }: { customProps?: any } = {}) {
    const { baseFrame } = this.context;
    if (baseFrame) {
      // listen for message and popstate evt 
      baseFrame.contentWindow.addEventListener('popstate', this._emitLocationChange);
      baseFrame.contentWindow.addEventListener('message', this._emitGlobalEvent);
    }

    const parcel = mountRootParcel({
      name: this.appInfo.name,
      bootstrap: flattenFnArray(this.remoteApp.bootstrap, 'bootstrap'),
      mount: flattenFnArray(this.remoteApp.mount, 'mount'),
      unmount: flattenFnArray(this.remoteApp.unmount, 'unmount'),
      update: flattenFnArray(this.remoteApp.update, 'update'),
    }, {
      domElement: dom || this.appInfo.dom,
      appProps: {
        emitter: createEventBus(),
        ...(customProps || this.appInfo.customProps)
      }
    });

    this.attachParcel(parcel);

    return this.parcel.mountPromise;
  }

  public async update(props: any) {
    // @ts-ignore
    return this.parcel && this.parcel.update && this.parcel.update({
      appProps: {
        ...props,
        emitter: createEventBus(),
      }
    })
  }

  /**
   * public api for unmount logic for app, it will unmount the node of the app
   * but no destory the sandbox for app
   */
  public async unmount() {
    if (this.parcel && this.parcel.getStatus() === "MOUNTED") {
      const { baseFrame } = this.context;
      if (baseFrame) {
        baseFrame.contentWindow.removeEventListener('popstate', this._emitLocationChange);
        baseFrame.contentWindow.removeEventListener('message', this._emitGlobalEvent);
      }
      this.parcel.unmount();
    }
  }

  /**
   * public api for destroy the app, it with unmount all node and destroy the
   * sandbox
   */
  public async destroy() {
    await this.unmount();
    removeContext(this.context);
  }

  /**
   * @deprecated
   * public api for destroy the app
   */
  public async dispose() {
    return this.destroy()
  }

  public getExposedModule<T>(moduleName: string) {
    if (!this.remoteApp.exposedModule) {
      return undefined;
    }

    return this.remoteApp.exposedModule[moduleName] as (T | undefined);
  }

  /**
   * 
   * @param parcel 
   */
  public attachParcel(parcel: Parcel) {
    this.parcel = parcel;
  }

  /* ---------------------------------------------------- */

  private _emitLocationChange = () => {
    eventBus.emit(this.historyEventName, this.context.location)
  }

  private _emitGlobalEvent = (e: MessageEvent) => {
    const payload = e.data;
    if (!payload.type || this.allowEvents.indexOf(e.data.type) === -1) {
      return;
    }

    payload.appId = this.appInfo.name;

    if (payload.type === this.historyEventName) {
      this._emitLocationChange()
    } else {
      eventBus.emit(payload.type, serializeData(payload))
    }
  }

  private get historyEventName() {
    return `${this.appInfo.name}:history-change`;
  }
}