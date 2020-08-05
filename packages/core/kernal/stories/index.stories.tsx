import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
import './index'
import { storiesOf } from '@storybook/react';
import { start, mountApp } from '../src';
import { prefetch } from '../src/prefetch';
import Application from '../../../react/react-application/lib';

start({
  sandBox: {
    sandBoxUrl: 'http://aliyun.com'
  }
});

const appInfo = {
  id: 'os-example',
  manifest: 'http://dev.g.alicdn.com/ConsoleOS/OSExample/0.0.5/os-example.manifest.json'
}

const Test = () => {
  return (
    <Application
      manifest={"http://30.37.65.55/project/file/sc-assets-trade-order/build/micro-service/bc-shipping-address-linx.manifest.json"}
      id={"sc-assets-trade-order"}
    />
  )
};

storiesOf('Basic Console OS', module)
  .add('Basic Use', () => {
    const appRef = useRef();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      prefetch([appInfo]);
      setTimeout(() => {
        setLoading(false);
        mountApp({ 
          ...appInfo,
          dom: appRef.current,
        }, {
          sandBox: {
            syncInitHref: true,
            initialPath: '/about'
          }
        }).then((app) => {
          console.log(app.remoteApp)
        });
      }, 3000)
    }, []);
    return (
      <div ref={appRef}>{loading && 'loading...'}</div>
    )
  }).add('Test', () =>{
    return (
      <Test />
    );
  })