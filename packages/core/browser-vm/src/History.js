class History {
  constructor( id, frame ) {
    if (!id) { return frame.history; }
    const postMessage = () => {
      frame.postMessage({
        type: `${id}:history-change`,
        data: JSON.parse(JSON.stringify(frame.location))
      }, '*')
    }

    const originalPushStatus = frame.history.pushState
    const originalReplaceStatus = frame.history.replaceState

    frame.history.pushState = (...args) => {
      console.log(frame.history)
      const returnValue = originalPushStatus.call(frame.history, ...args);
      postMessage();
      return returnValue;
    }

    frame.history.replaceState = (...args) => {
      const returnValue = originalReplaceStatus.call(frame.history, ...args);
      postMessage()
      return returnValue;
    }
    return frame.history;
  }
}

export default History;