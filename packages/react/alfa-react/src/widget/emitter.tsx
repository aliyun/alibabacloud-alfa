import { EventEmitter } from 'events';

class WidgetEventEmitter extends EventEmitter {
  // Compatible with the old api, this may get removed at sometime later.
  refersh(widgetId: string) {
    return this.emit(`${widgetId}:REFRESH`);
  }

  refershWidget(widgetId: string) {
    return this.emit(`${widgetId}:REFRESH`);
  }
}

export default new WidgetEventEmitter();
