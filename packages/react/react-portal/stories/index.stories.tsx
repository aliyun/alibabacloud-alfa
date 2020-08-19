import * as React from 'react';
import { mount, EventEmitter } from '../src';

mount(
  (props) => {
    console.log(props.emitter)
    return <div/>
  }
)
