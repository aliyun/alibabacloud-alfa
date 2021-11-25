import * as React from 'react';
import axios from 'axios';
import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { createAlfaWidget } from '../src';
import { cachedRelease } from '../src/widget/getWidgetVersionById';
import * as homeWidgetRuntime from '@ali/home-widget-runtime';

// @ts-ignore
const WidgetProps = {
  title: '',
  subtitle: '指定的标题',
  cache: false,
  className: 'cws-article',
  namespace: 'nexconsole/component_web',
  slug: 'card',
};
// @ts-ignore
window.ALIYUN_CONSOLE_CONFIG = {
  LOCALE: 'zh-CN',
};

storiesOf('Alfa Wigets', module)
  .addDecorator(withKnobs)
  .add('With Widget', () => {
    const [reslease, setRelease] = React.useState(cachedRelease || {});
    React.useEffect(() => {
      (async () => {
        // @ts-ignore
        const resp = await axios.get<WidgetReleaseConfig>('https://cws.alicdn.com/release.json');
        setRelease(resp.data);
      })();
    }, []);
    const name = select('Widget ID', Object.keys(reslease), '@ali/widget-home-resources-overview');
    const version = select('Widget Version', Object.keys((reslease)[name] || {}), '0.x');

    // @ts-ignore
    return (
      <>
        {
          React.createElement(
            createAlfaWidget({
              name,
              version,
              loading: false,
              alfaLoader: true,
              env: 'pre',
              dependencies: {
                '@ali/home-widget-runtime': homeWidgetRuntime,
              } }),
            {
              ...WidgetProps,
            },
          )
        }
      </>);
  });
