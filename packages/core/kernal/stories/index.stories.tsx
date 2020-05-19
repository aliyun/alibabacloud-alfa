import React, { useRef, useEffect, useState } from 'react';
import './index'
import { storiesOf } from '@storybook/react';
import { start, mountApp } from '../src';
import { prefetch } from '../src/prefetch';

start();

storiesOf('Basic Console OS', module)
  .add('Basic Use', () => {
    const appRef = useRef();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      prefetch([{id: 'os-example', manifest: 'https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json'}]);
      setTimeout(() => {
        setLoading(false);
        mountApp({ 
          id: 'os-example', 
          manifest: 'https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json',
          dom: appRef.current,
        });
      }, 3000)
    }, []);
    return (
      <div ref={appRef}>{loading && 'l.oading'}</div>
    )
  })