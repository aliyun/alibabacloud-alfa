import { Component, Input, ElementRef } from '@angular/core';
import { OSApplication, load, mount, unmount, destroy, createMicroApp, SandBoxOption } from '@alicloud/console-os-kernal';

const getParcelProps = (props) => {
  const parcelProps = {...props}

  delete parcelProps.mountParcel
  delete parcelProps.config
  delete parcelProps.wrapWith
  delete parcelProps.handleError
  delete parcelProps.parcelDidMount

  return parcelProps;
}

@Component({
  selector: 'console-os-app',
  template: `<!-- os app -->`
})
export class Application {
  @Input() public handleError: Function;
  @Input() public sandBox: SandBoxOption;
  @Input() public parcelDidMount: Function;
  @Input() public url: string
  @Input() public id: string;
  @Input() public manifest: string;
  @Input() public singleton: boolean;
  @Input() public externalsVars: string[];

  private error: Error;
  private hasError: boolean = false;
  private unmounted: boolean = false;
  private loading: boolean = false;
  private nextThingToDo: Promise<any>;

  private el: Element;
  private createdDomElement: Element;
  private app: OSApplication;

  public constructor(private elementRef: ElementRef) { } 

  public ngAfterViewInit() {
    this.addThingToDo('mount',  async () => {
      const { manifest, id, url, externalsVars, singleton = true } = this;
      let sandBox = this.sandBox;
      if (sandBox) {
        sandBox.externalsVars = externalsVars;
        sandBox.singleton = singleton;
      } else {
        sandBox = { singleton };
      }

      let domElement;
      if (this.el) {
        domElement = this.el
      } else {
        this.createdDomElement = domElement = document.createElement(id)
        this.elementRef.nativeElement.appendChild(domElement)
      }

      if (externalsVars) {
        // @ts-ignore
        sandBox.externalsVars = externalsVars;
      }
      const appInfo = {
        url,
        id,
        name: id,
        manifest,
        dom: domElement,
        customProps: {
          ...getParcelProps(this)
        }
      };

      this.app = await createMicroApp(appInfo, {
        sandbox: sandBox
      });

      await load(this.app);
      await mount(this.app, appInfo);

      this.loading = false;
      this.parcelDidMount && this.parcelDidMount();
    })
  }

  public ngOnDestroy() {
    this.addThingToDo('unmount', () => {
      const { singleton = true } = this;
      return singleton ? unmount(this.app) : destroy(this.app);
    })

    if (this.createdDomElement) {
      this.createdDomElement.parentNode.removeChild(this.createdDomElement)
    }

    this.unmounted = true
  }

  private addThingToDo = (action: string, thing: Function) => {
    if (this.hasError && action !== 'unmount') {
      return;
    }

    this.nextThingToDo = (this.nextThingToDo || Promise.resolve())
      .then((...args) => {
        if (this.unmounted && action !== 'unmount') {
          // Never do anything once the react component unmounts
          return
        }

        return thing(...args)
      })
      .catch((err) => {
        this.nextThingToDo = Promise.resolve() // reset so we don't .then() the bad promise again
        this.hasError = true;
        this.loading = false;
        this.error = err;

        if (err && err.message) {
          err.message = `During '${action}', parcel threw an error: ${err.message}`
        }

        if (this.handleError) {
          this.handleError(err)
        } else {
          setTimeout(() => {throw err})
        }
        throw err
      });
  }
}