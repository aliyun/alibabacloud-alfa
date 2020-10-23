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
      const returnValue = originalPushStatus.apply(frame.history, [...args]);
      postMessage();
      return returnValue;
    }

    frame.history.replaceState = (...args) => {
      const returnValue = originalReplaceStatus.apply(frame.history, [...args]);
      postMessage()
      return returnValue;
    }
    return frame.history;
  }
}

export default History;