class HistoryProxy {
  id: string;

  win: WindowProxy;

  constructor(id?: string, win: WindowProxy) {
    const originalHistory = win.history;

    if (!id) {
      return originalHistory;
    }

    const postMessage = () => {
      win.postMessage(
        {
          type: `${id}:history-change`,
          data: JSON.parse(JSON.stringify(win.location)) as Record<
            string,
            string
          >,
        },
        '*'
      );
    };

    const originalPushState = originalHistory.pushState.bind(originalHistory);
    const originalReplaceState =
      originalHistory.replaceState.bind(originalHistory);

    originalHistory.pushState = (...args) => {
      const returnValue = originalPushState.apply(originalHistory, [...args]);
      postMessage();
      return returnValue;
    };

    originalHistory.replaceState = (...args) => {
      const returnValue = originalReplaceState.apply(originalHistory, [
        ...args,
      ]);
      postMessage();
      return returnValue;
    };

    return originalHistory;
  }
}

export default HistoryProxy;
