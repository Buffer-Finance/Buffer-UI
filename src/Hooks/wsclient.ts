export function reconnectingSocket(url: string) {
  let client: undefined | WebSocket;
  let isConnected = false;
  let reconnectOnClose = true;
  let messageListeners: any[] = [];
  let stateChangeListeners: any[] = [];

  function on(fn) {
    messageListeners.push(fn);
  }

  function off(fn) {
    messageListeners = messageListeners.filter((l) => l !== fn);
  }

  function onStateChange(fn) {
    stateChangeListeners.push(fn);
    return () => {
      stateChangeListeners = stateChangeListeners.filter((l) => l !== fn);
    };
  }

  function start() {
    client = new WebSocket(url);

    client.onopen = () => {
      isConnected = true;
      stateChangeListeners.forEach((fn) => fn(true));
    };

    const close = client.close;

    // Close without reconnecting;
    client.close = () => {
      reconnectOnClose = false;
      close.call(client);
    };

    client.onmessage = (event) => {
      messageListeners.forEach((fn) => fn(event.data));
    };

    client.onerror = (e) => console.error(e);

    client.onclose = () => {
      isConnected = false;
      stateChangeListeners.forEach((fn) => fn(false));
      if (!reconnectOnClose) {
        console.log('[ws-deb]closed by app');
        return;
      }
      console.log('[ws-deb]closed by server');

      setTimeout(start, 3000);
    };
  }

  start();

  return {
    on,
    off,
    onStateChange,
    close: () => client.close(),
    getClient: () => client,
    isConnected: () => isConnected,
  };
}
