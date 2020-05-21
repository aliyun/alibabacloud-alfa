# Console OS React Portal

## Basic Use

Replace the ReactDOM.render to ```mount``` function in ```@alicloud/console-os-react-portal```

```javascript
import { mount } from '@alicloud/console-os-react-portal';
import App from './app';

export default mount(
  App,
  // dom, you mount no in console os environment
  document.getElementById('app'),
  // sub app id
  'sub-app'
);
```

## Sync Router

If you are use the react-router, and you want to your Main Application (Parent Application) to controll your router,

you can use util funtion ```withSyncHistory``` in ```@alicloud/console-os-react-portal```.

```javascript
import { mount, withSyncHistory } from '@alicloud/console-os-react-portal';
import { createBrowserHistory } from 'history';
import App from './app';

const history = createBrowserHistory();

export default mount(
  // add this wrapper
  withSyncHistory(App, history),
  // dom, you mount no in console os environment
  document.getElementById('app'),
  // sub app id
  'sub-app'
);
```

Then in parent application, when you pass the path props, sub app will rediect to that path.

```javascript
import ConsoleApp from '@alicloud/console-os-react-app'

const MANIFEST_URL = 'http://cdn.com/sub-app.manifest.json'

export default () => (
  <ConsoleApp
    path="/sub-app" // it will redirect the sub app to path /sub-app
    manifest={MANIFEST_URL}
  />
)
```