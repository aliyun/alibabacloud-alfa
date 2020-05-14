import VMContext, { removeContext } from '@alicloud/console-os-browser-vm';

import { Parcel, mountRootParcel } from 'os-single-spa';
import { serializeData, flattenFnArray } from '../misc/util';
import { AppInfo, SandBoxOption } from '../type';
import { createEventBus } from './createEventBus';
import { createAppLoader } from './createAppLoader';

const eventBus = createEventBus();

/**
 * Application
 */
export class Application {
  public readonly context: VMContext;
  public parcel?: Parcel;
  public remoteApp;
  public allowEvents: string[];

  private appInfo: AppInfo;

  public constructor(appInfo: AppInfo, context: VMContext, option?: SandBoxOption) {
    this.appInfo = appInfo;
    this.context = context; 

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

  /**
   * 
   */
  public async load() {
    if (!this.remoteApp) {
      this.remoteApp = await createAppLoader(this.appInfo, this.context);
    }
    return this.remoteApp;
  }

  /**
   * public api for mount logic for app
   */
  public async mount(mountInfo: AppInfo) {
    const { baseFrame } = this.context;
    if (baseFrame) {
      // listen for message and popstate evt 
      baseFrame.contentWindow.addEventListener('popstate', this._emitLocaitonChange);
      baseFrame.contentWindow.addEventListener('message', this._emitGlobalEvent);
    }

    const parcel = mountRootParcel({
      name: this.appInfo.id,
      customProps:{},
      domElement: undefined,
      bootstrap: flattenFnArray(this.remoteApp.bootstrap, 'bootstrap'),
      mount: flattenFnArray(this.remoteApp.mount, 'mount'),
      unmount: flattenFnArray(this.remoteApp.unmount, 'unmount'),
      update: flattenFnArray(this.remoteApp.update, 'update'),
    }, {
      domElement: mountInfo.dom || this.appInfo.dom,
      appProps: {
        emitter: createEventBus(),
        ...(mountInfo.customProps || this.appInfo.customProps)
      }
    });

    this.attachParcel(parcel);

    return this.parcel.mountPromise;
  }

  public async update(props: any) {
    // @ts-ignore
    return this.parcel.update && this.parcel.update(props)
  }

  /**
   * public api for unmount logic for app, it will unmount the node of the app
   * but no destory the sandbox for app
   */
  public async unmount() {
    const { baseFrame } = this.context;
    if (baseFrame) {
      baseFrame.contentWindow.removeEventListener('popstate', this._emitLocaitonChange);
      baseFrame.contentWindow.removeEventListener('message', this._emitGlobalEvent);
    }
    return this.parcel && this.parcel.unmount();
  }

  /**
   * public api for destory the app, it with unmount all node and destroy the
   * sandbox
   */
  public async destory() {
    removeContext(this.context);
    return this.parcel && this.parcel.unmount();
  }

  /**
   * @deprecated
   * public api for destory the app
   */
  public async dispose() {
    return this.destory()
  }

  /**
   * 
   * @param parcel 
   */
  public attachParcel(parcel: Parcel) {
    this.parcel = parcel;
  }

  /* ---------------------------------------------------- */

  private _emitLocaitonChange = () => {
    eventBus.emit(this.historyEventName, this.context.location)
  }

  private _emitGlobalEvent = (e: MessageEvent) => {
    const payload = e.data;
    if (!payload.type || this.allowEvents.indexOf(e.data.type) === -1) {
      return;
    }

    payload.appId = this.appInfo.id;

    if (payload.type === this.historyEventName) {
      this._emitLocaitonChange()
    } else {
      eventBus.emit(payload.type, serializeData(payload))
    }
  }

  private get historyEventName() {
    return `${this.appInfo.id}:history-change`;
  }
}