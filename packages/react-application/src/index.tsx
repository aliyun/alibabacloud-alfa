
import React from 'react';
import { mountApp, OSApplication } from '@alicloud/console-os-kernal'
import { SandBoxOption } from '@alicloud/console-os-kernal/lib/type';
import Skeleton from './Skeleton';
import ErrorPanel from './ErrorPanel';

interface IProps<T = any> {
  /**
   * App unique id
   */
  id: string;
  /**
   * JS entry for consoleOS.
   */
  jsUrl?: string;
  /**
   * App config url.
   */
  manifest?: string;
  /**
   * 沙箱配置
   */
  sandBox?: SandBoxOption;
  /**
   * 处理错误的生命周期
   */
  appDidCatch?: (err: Error) => void;
  /**
   * 引用完成加载之后生命周期
   */
  appDidMount?: () => void;
  /**
   * @deprecated
   * initialPath for SandBox
   */
  initialPath?: string;
  /**
   * @deprecated
   * @default true
   * Set application singleton,
   *     true:  it will cache the sandbox at the component umounted (better performance)
   *     false: it will distroy the sandbox.
   */
  singleton?: boolean;
  /**
   * @deprecated
   * window variable whitelist. For example:
   * if externalsVars = ['test']. the window.test in subapp equals window.test
   */
  externalsVars?: string[];

  appProps: T;
}

interface IState {
  hasError: boolean;
  loading: boolean;
  error: Error | null;
}

const getParcelProps = (props: Partial<IProps>) => {
  const parcelProps = {...props, ...(props.appProps || {})};

  delete parcelProps.jsUrl;
  delete parcelProps.manifest;
  delete parcelProps.initialPath;
  delete parcelProps.externalsVars;
  delete parcelProps.sandBox;
  delete parcelProps.appDidCatch;
  delete parcelProps.appDidMount;

  return parcelProps;
}

class Application<T> extends React.Component<Partial<IProps<T>>, IState> {
  private unmounted: boolean;

  private el?: HTMLElement;
  private nextThingToDo?: Promise<any>;
  private createdDomElement?: HTMLElement;
  private app?: undefined | OSApplication;

  public constructor(props: IProps) {
    super(props);

    this.state = {
      hasError: false,
      loading: true,
      error: null
    };

    this.unmounted = false;
  }
  private handleRef = (el: HTMLElement) => {
    this.el = el
  }

  public componentDidMount() {
    this.addThingToDo('mount',  async () => {
      const { jsUrl: url, id, manifest, externalsVars, singleton = true } = this.props;

      if (!id) {
        throw Error('You should give a id for OS Application');
      }

      let sandBox = this.props.sandBox;
      if (sandBox) {
        sandBox.externalsVars = externalsVars;
        sandBox.singleton = singleton;
      } else {
        sandBox = {
          singleton
        };
      }

      let domElement;
      if (this.el) {
        domElement = this.el
      } else {
        throw new Error('React dom element is no prepared. please check')
      }

      if (externalsVars) {
        sandBox.externalsVars = externalsVars;
      }

      this.app = await mountApp({
        url,
        id,
        manifest,
        activityFn: () => { 
          return true
        },
        dom: domElement,
        customProps: {
          ...getParcelProps(this.props)
        }
      }, {
        sandBox
      });

      if (this.app && this.app.parcel) {
        this.app && this.app.parcel.mountPromise.then(() => {
          this.setState({
            loading: false
          });
          this.props.appDidMount && this.props.appDidMount()
        });
        return this.app.parcel.mountPromise;
      }
    })
  }

  public componentDidUpdate() {
    this.addThingToDo('update', () => {
      // @ts-ignore
      if (this.app && this.app.parcel && this.app.parcel.update) {
        // @ts-ignore
        return this.app.parcel.update(getParcelProps(this.props))
      }
    })
  }

  public componentWillUnmount() {
    this.addThingToDo('unmount', () => {
      const { singleton = true } = this.props;
      if (this.app && this.app.parcel && this.app.parcel.getStatus() === "MOUNTED") {
        return singleton ? this.app.unmount() : this.app.dispose();
      }
    })

    if (this.createdDomElement && this.createdDomElement.parentNode) {
      this.createdDomElement.parentNode.removeChild(this.createdDomElement)
    }

    this.unmounted = true
  }

  private addThingToDo = (action: string, thing: Function) => {
    if (this.state.hasError && action !== 'unmount') {
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
        this.nextThingToDo = Promise.resolve(); // reset so we don't .then() the bad promise again
        this.setState({hasError: true, loading: false, error: err})
        if (err && err.message) {
          err.message = `During '${action}', os application threw an error: ${err.message}`
        }
        if (this.props.appDidCatch) {
          this.props.appDidCatch(err)
        }
      });
  }

  public render() {
    const { id = '' } = this.props;

    if (this.state.hasError && this.state.error) {
      return (<ErrorPanel error={this.state.error}/>)
    }

    return (
      <>
        {
          this.state.loading ? <Skeleton active /> : null
        }
        {
          React.createElement(
            id,
            { ref: this.handleRef }
          )
        }
      </>
    );
  }
}

export default Application;