import React, { useRef, useEffect, useState } from 'react';
import './index'
import { storiesOf } from '@storybook/react';
import { start, mountApp } from '../src';
import { prefetch } from '../src/prefetch';

start();

const appInfo = {
  id: 'os-example',
  manifest: 'https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json'
}

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
        });
      }, 3000)
    }, []);
    return (
      <div ref={appRef}>{loading && 'loading...'}</div>
    )
  })
  .add('No manifest Json', () => {
    const appRef = useRef();
    useEffect(() => {
      mountApp({
        id: "os-example",
        manifest: {
          name: "os-example",
          resources: {
            "index.css": "//g.alicdn.com/ConsoleOS/OSExample/0.0.4/index.css",
            "index.js": "//g.alicdn.com/ConsoleOS/OSExample/0.0.4/index.js"
          },
          "runtime": {
            "id": "OSRuntimeReact16",
            "url": "https://dev.g.alicdn.com/ConsoleOS/runtime-react-16/0.0.1/index.js"
          },
          "entrypoints": {
            "index": {
              "css": [
                "//g.alicdn.com/ConsoleOS/OSExample/0.0.4/index.css"
              ],
              "js": [
                "//g.alicdn.com/ConsoleOS/OSExample/0.0.4/index.js"
              ]
            }
          }
        },
        dom: appRef.current,
      });
    }, []);

    return (
      <div ref={appRef}></div>
    )
  })