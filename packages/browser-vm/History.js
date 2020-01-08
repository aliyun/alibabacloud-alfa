class History {
  constructor( id, frame ) {
    if (!id) { return; }
    const postMessage = () => {
      frame.postMessage({
        type: `${id}:history-change`,
        data: JSON.parse(JSON.stringify(location))
      }, '*')
    }

    const originalPushStatus = history.pushState
    const originalReplaceStatus = history.replaceState

    frame.history.pushState = (...args) => {
      const returnValue = originalPushStatus.call(history, ...args);
      postMessage();
      return returnValue;
    }

    frame.history.replaceState = (...args) => {
      const returnValue = originalReplaceStatus.call(history, ...args);
      postMessage()
      return returnValue;
    }
    return history;
  }
}

export default History;