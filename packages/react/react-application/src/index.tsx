
import React, { HTMLAttributes } from 'react';
import { OSApplication, createMicroApp, mount, load, unmount, distroy } from '@alicloud/console-os-kernal'
import { SandBoxOption } from '@alicloud/console-os-kernal/lib/type';
import Skeleton from './Skeleton';
import ErrorPanel from './ErrorPanel';

interface IProps<T = any> extends HTMLAttributes<Element> {
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

  disableBodyTag: boolean;

  loading: boolean | React.ReactChild;

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
      const appInfo = {
        url,
        id,
        manifest,
        dom: domElement,
        customProps: {
          ...getParcelProps(this.props)
        }
      };

      this.app = await createMicroApp(appInfo, {
        sandBox
      })

      await load(this.app);
      await mount(this.app, appInfo);

      this.setState({
        loading: false
      });

      this.props.appDidMount && this.props.appDidMount();
    })
  }

  public componentDidUpdate() {
    this.addThingToDo('update', () => {
      // @ts-ignore
      if (this.app && this.app.parcel && this.app.parcel.update) {
        // @ts-ignore
        return this.app.update(getParcelProps(this.props))
      }
    })
  }

  public componentWillUnmount() {
    this.addThingToDo('unmount', () => {
      const { singleton = true } = this.props;
      if (this.app && this.app.parcel && this.app.parcel.getStatus() === "MOUNTED") {
        return singleton ? unmount(this.app) : distroy(this.app);
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
        const error = new Error(`During '${action}', os application threw an error: ${err.message}`)
        this.setState({ hasError: true, loading: false, error })
        if (this.props.appDidCatch) {
          this.props.appDidCatch(error)
        }
        console.error(error);
      });
  }

  public render() {
    const { id = '', style = {}, className = '', disableBodyTag, sandBox, disableLoading } = this.props;
    if (this.state.hasError && this.state.error) {
      return (<ErrorPanel error={this.state.error}/>)
    }

    const Wrapper = React.Fragment ? React.Fragment : 'div';

    return (
      <Wrapper className="-os-wrapper">
        {
          this.state.loading ? <Skeleton active /> : null
        }
        {
          (sandBox?.disableFakeBody) 
            ? React.createElement(id, { style, className, ref: this.handleRef } ) 
            : React.createElement(
              id,
              { style, className },
              React.createElement(disableBodyTag ? 'div' : 'body', { ref: this.handleRef })
            )
        }
      </Wrapper>
    );
  }
}

export default Application;

export { start, createEventBus, prefetch } from '@alicloud/console-os-kernal';
