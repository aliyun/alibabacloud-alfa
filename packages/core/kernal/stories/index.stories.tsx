import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
import './index'
import { storiesOf } from '@storybook/react';
import { start, mountApp, loadExposedModule } from '../src';
import { prefetch } from '../src/prefetch';

start();

const appInfo = {
  id: 'os-example',
  manifest: 'http://localhost:8081/os-example.manifest.json'
}

const About = lazy(() => loadExposedModule(appInfo, 'About').then((comp) => ({ default: comp })));

storiesOf('Basic Console OS', module)
  .add('Basic Use', () => {
    const appRef = useRef();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      // prefetch([appInfo]);
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
  })
  .add('Remote Module', () => {
    return (
      <Suspense fallback={<div>loading</div>}>
        <About></About>
      </Suspense>
    )
  })