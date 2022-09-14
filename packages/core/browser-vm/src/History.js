class History {
  constructor(id, frame) {
    if (!id) { return frame.history; }
    const postMessage = () => {
      frame.postMessage({
        type: `${id}:history-change`,
        data: JSON.parse(JSON.stringify(frame.location)),
      }, '*');
    };

    // throw error when iframe src is about:blank
    try {
      const originalPushStatus = frame.history.pushState;
      const originalReplaceStatus = frame.history.replaceState;

      frame.history.pushState = (...args) => {
        const returnValue = originalPushStatus.apply(frame.history, [...args]);
        postMessage();
        return returnValue;
      };

      frame.history.replaceState = (...args) => {
        const returnValue = originalReplaceStatus.apply(frame.history, [...args]);
        postMessage();
        return returnValue;
      };

      return frame.history;
    } catch (e) {
      return undefined;
    }
  }
}

export default History;
