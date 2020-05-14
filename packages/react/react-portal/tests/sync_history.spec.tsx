import React from 'react'
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history';
import { EventEmitter } from 'events'

import { withSyncHistory } from '../src/utils';

describe('Test Sync History', () => {
  test('Sync History Emitter', () => {
    const emitter = new EventEmitter();
    const history = createBrowserHistory();
    // @ts-ignore
    const Application = (props) => (<div>{props.test}</div>)
  
    const SyncApplication = withSyncHistory(Application, history);

    let called = false
    const unlisten = history.listen((location) => {
      called = true;
      expect(location.pathname).toEqual('/test')
    })

    const wrapper = mount(
      <SyncApplication
        history={history}
        id={'test'}
        emitter={emitter}
        path={'/test'}
        test={'1'}
      />
    )
    expect(called).toBe(true)
    unlisten();

    let received = 0;
    emitter.on('test:history-change', (location) => {
      received = received + 1;
      expect(location.pathname).toEqual('/bar')
    });

    wrapper.setProps({ path: '/bar' });
    expect(received).toEqual(1);
    expect(wrapper.containsMatchingElement(<div>1</div>)).toBe(true)
    expect(wrapper.children().exists()).toBe(true);

    wrapper.unmount();

    history.push('/unmount');
    expect(received).toEqual(1);
  })
})