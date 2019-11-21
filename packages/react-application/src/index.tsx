
import React from 'react';
import { Parcel as SpaParcel, ParcelConfig, LifeCycles } from 'single-spa'
import { mountApp, OSApplication } from '@alicloud/console-os-kernal'
import { AppInfo } from '@alicloud/console-os-kernal/lib/type';
import Skeleton from './Skeleton';

type MountParcelFn = (parcelConfig: ParcelConfig, customProps: object) => SpaParcel & LifeCycles;

interface IProps extends Partial<AppInfo>  {
  wrapWith: string;
  appendTo: HTMLElement;

  config: ParcelConfig;
  externalsVars: string[];

  handleError: (err: Error) => void;
  parcelDidMount: () => void;
  mountParcel: MountParcelFn;
}

interface IState {
  hasError: boolean;
  loading: boolean;
  error: Error;
}

const getParcelProps = (props: Partial<IProps>) => {
  const parcelProps = {...props}

  delete parcelProps.mountParcel
  delete parcelProps.config
  delete parcelProps.wrapWith
  delete parcelProps.appendTo
  delete parcelProps.handleError
  delete parcelProps.parcelDidMount

  return parcelProps;
}

class Application extends React.Component<Partial<IProps>, IState> {
  private unmounted: boolean;
  private el: HTMLElement;
  private createdDomElement: HTMLElement;
  private mountParcel: MountParcelFn;

  private app: OSApplication;
  private nextThingToDo: Promise<any>;

  public constructor(props: IProps) {
    super(props);

    this.state = {
      hasError: false,
      loading: true,
      error: null
    }

    this.unmounted = false;

    if (props.config) {
      throw new Error(`ConsoleOS's ConsoleApp component requires the 'config' prop to either be a parcel config or a loading function that returns a promise.`)
    }
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
        this.nextThingToDo = Promise.resolve() // reset so we don't .then() the bad promise again
        this.setState({hasError: true, loading: false, error: err})

        if (err && err.message) {
          err.message = `During '${action}', parcel threw an error: ${err.message}`
        }

        if (this.props.handleError) {
          this.props.handleError(err)
        } else {
          setTimeout(() => {throw err})
        }

        // No more things to do should be done -- the parcel is in an error state
        throw err
      });
  }

  private handleRef = (el: HTMLElement) => {
    this.el = el
  }

  public componentDidMount() {
    this.addThingToDo('mount',  async () => {
      const { url, id, manifest, externalsVars } = this.props;

      let domElement;
      if (this.el) {
        domElement = this.el
      } else {
        this.createdDomElement = domElement = document.createElement(this.props.wrapWith || id)
        this.props.appendTo.appendChild(domElement)
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
        sandBox: {
          externalsVars,
        }
      })

      this.app.parcel.mountPromise.then(() => {
        this.setState({
          loading: false
        })
        this.props.parcelDidMount && this.props.parcelDidMount()
      })
      return this.app.parcel.mountPromise
    })
  }

  public componentDidUpdate() {
    this.addThingToDo('update', () => {
      // @ts-ignore
      if (this.app.parcel && this.app.parcel.update) {
        // @ts-ignore
        return this.app.parcel.update(getParcelProps(this.props))
      }
    })
  }

  public componentWillUnmount() {
    this.addThingToDo('unmount', () => {
      if (this.app.parcel && this.app.parcel.getStatus() === "MOUNTED") {
        return this.app.dispose();
      }
    })

    if (this.createdDomElement) {
      this.createdDomElement.parentNode.removeChild(this.createdDomElement)
    }

    this.unmounted = true
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 24}}>
          { process.env.NODE_ENV === 'development' ?
            (<div style={{background: '#fcebea', padding: 24}}>
              <div style={{lineHeight: '22px', color: '#d93026', fontSize: 14}}>{this.state.error.message}</div>
              <pre style={{overflow: 'scroll'}}>{this.state.error.stack}</pre>
            </div>) : <div style={{lineHeight: '22px', color: '#d93026', fontSize: 14}}>Error</div>
          }
        </div>
      )
    }

    if (this.props.appendTo) {
      return null;
    } else {
      return (
        <>
          {this.state.loading ? <Skeleton active /> : null}
          { React.createElement(this.props.wrapWith, {ref: this.handleRef}) }
        </>
      );
    }
  }
}

export default Application;