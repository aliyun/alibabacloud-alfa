import React, { HTMLAttributes } from 'react';
import { OSApplication, createMicroApp, mount, load, unmount } from '@alicloud/console-os-kernal'
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

  deps?: {
    [key: string] : any
  };
  /**
   * 沙箱配置
   */
  sandbox?: SandBoxOption;

  /**
   * app resource publicPath
   */
  publicPath?: string;
  /**
   * 处理错误的生命周期
   */
  appDidCatch?: (err: Error) => void;
  /**
   * 引用完成加载之后生命周期
   */
  appDidMount?: () => void;

  disableBodyTag: boolean;

  /**
   * loading status for consoleos app
   */
  loading: boolean | React.ReactChild;

  appProps: T;

  /**
   * 关闭错误提示
   */
  error: boolean | React.ReactChild;
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
  delete parcelProps.sandbox;
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
      const {
        jsUrl: url, id, manifest, 
        publicPath, deps
      } = this.props;

      if (!id) {
        throw new Error('You should give a id for OS Application');
      }

      const sandBox = this.props.sandbox;

      let domElement;
      if (this.el) {
        domElement = this.el
      } else {
        throw new Error('React dom element is no prepared. please check')
      }

      const appInfo = {
        url,
        id,
        name: id,
        manifest,
        dom: domElement,
        deps,
        publicPath,
        customProps: {
          ...getParcelProps(this.props)
        }
      };

      this.app = await createMicroApp(appInfo, {
        // @ts-ignore
        sandBox
      })

      // @ts-ignore
      await load(this.app);
      // @ts-ignore
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
      let singleton = this.props.sandbox?.singleton;
      
      if(singleton === undefined) {
        singleton = true;
      }

      if (this.app && this.app.parcel && this.app.parcel.getStatus() === "MOUNTED") {
        return unmount(this.app);
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

  private getLoading() {
    const { loading } = this.props;
    if (loading === false) {
      return null;
    } else if (loading && React.isValidElement(loading)) {
      return loading;
    }

    return <Skeleton active />;
  }

  private getError() {
    const { error } = this.props;
    if (error === false) {
      return null;
    } else if (error && React.isValidElement(error)) {
      return error;
    }
    return this.state.error && <ErrorPanel error={this.state.error} />;
  }

  public render() {
    const { id = '', style = {}, className = '', disableBodyTag, sandbox } = this.props;

    if (this.state.hasError && this.state.error) {
      return !this.getError()
    }

    const Wrapper = React.Fragment ? React.Fragment : 'div';

    return (
      <Wrapper>
        {
          this.state.loading ? this.getLoading() : null
        }
        {
          (sandbox?.disableFakeBody) 
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

export { start, createEventBus, prefetch, loadExposedModule } from '@alicloud/console-os-kernal';
