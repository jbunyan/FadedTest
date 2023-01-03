/**
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * @fileOverview WebSocketClient sample application for BlackBerry Dynamics.
 *
 * @description WebSocketClient sample application shows example of usage secured `WebSocket` API to communicate with
 * WebSocket servers using the WebSocket protocol (both `ws://` and `wss://` schemes are supported).
 * It has a possibility to send data of different types (`text`, `ArrayBuffer`, `Blob`) to the server and
 * receive messages of different types (`text`, `ArrayBuffer`, `Blob`) from the server.
 *
 * @version 1.0
 */

const DataConverter = {
  readBlobAsText: function(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function() {
        resolve(reader.result);
      }

      reader.onerror = function() {
        reject(reader.error);
      }

      reader.readAsText(blob);
    });
  },
  convertStringToArrayBuffer(string) {
    const stringLength = string.length;
    let buffer = new ArrayBuffer(stringLength * 2);
    let bufferView = new Uint16Array(buffer);

    for (let i = 0; i < stringLength; i++) {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
  },
  convertArrayBufferToString(buffer) {
    let convertedString = '';
    try {
      convertedString = String.fromCharCode.apply(null, new Uint16Array(buffer));
    } catch (error) {
      console.error('Failed to convert ArrayBuffer to text!');
    }
    return convertedString;
  }
};

let APP = {};

APP.Constants = {
  DEFAULT_WEB_SOCKET_SERVER: 'wss://echo.websocket.org',
  // DEFAULT_WEB_SOCKET_SERVER: cordova.platformId === 'android' ? 'ws://10.0.2.2:8080' : 'ws://localhost:8080',
  DEFAULT_BINARY_TYPE: 'blob',
  CONNECTION_STATUSES: {
    connected: 'Disconnect',
    disconnected: 'Connect'
  }
};

APP.webSocketClient;

/* handler for device ready event */
APP.deviceReady = function() {
  _.extend(APP, Backbone.Events);

  APP.$body = $('body');
  APP.$sendMessageWrapper = $('.send-message-wrapper');
  APP.$connectButton = $('#connect-btn');

  $('#connection-url').val(APP.Constants.DEFAULT_WEB_SOCKET_SERVER);

  $(document).on('click', '#connect-btn', APP.handleConnection);

  $(document).on('change', '#response-type', APP.onChangeResponseType);

  $(document).on('click', '#send-btn', APP.sendMessage);
}

APP.handleConnection = function(e) {
  const connectionStatus = e.target.textContent;

  if (connectionStatus === APP.Constants.CONNECTION_STATUSES.connected) {
    APP.webSocketClient.close();
  } else {
    APP.handleNewWebSocketConnection();
  }
};

APP.handleNewWebSocketConnection = function() {
  const webSocketServerInput = $('#connection-url');

  APP.webSocketClient = new WebSocket(webSocketServerInput.val().trim());
  APP.webSocketClient.binaryType = APP.Constants.DEFAULT_BINARY_TYPE;

  APP.webSocketClient.onopen = () => {
    APP.addMessage('WebSockets connection is opened!');

    APP.$connectButton.html(APP.Constants.CONNECTION_STATUSES.connected);
    APP.$sendMessageWrapper.show();
  };

  APP.webSocketClient.onmessage = async (e) => {
    const data = e.data;
    let text = data;
    console.log('Event message:', e);
    console.log('isBlob:', data instanceof Blob);
    console.log('isArrayBuffer', data instanceof ArrayBuffer);

    const now = new Date();
    let messageTemplate = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} `;

    if (data instanceof Blob) {
      messageTemplate += 'Received binary Blob: ';

      try {
        // DEVNOTE: FileReader API can be used here too
        // text = await DataConverter.readBlobAsText(data);
        text = await new Response(data).text();
      } catch (error) {
        text = 'failed to convert Blob to text message. Please, check response binary type...';
      }
    } else if (data instanceof ArrayBuffer) {
      messageTemplate += 'Received binary ArrayBuffer: ';
      text = DataConverter.convertArrayBufferToString(data);
      if (!text) {
        text = 'failed to convert ArrayBuffer to text message. Please, check response binary type...';
      }
    }

    APP.addMessage(`${messageTemplate}${text}`);
  };

  APP.webSocketClient.onerror = (e) => {
    alert(`WS error: ${e.message}`);
  };

  APP.webSocketClient.onclose = (e) => {
    APP.addMessage('WebSockets connection is closed!');

    APP.$connectButton.html(APP.Constants.CONNECTION_STATUSES.disconnected);
    APP.$sendMessageWrapper.hide();
  };

}

APP.onChangeResponseType = function(e) {
  APP.webSocketClient.binaryType = e.target.value;
}

APP.addMessage = function(messageText) {
  const messages = $('.messages');
  const newMessage = `<li class="message"><pre>${messageText}</pre></li>`;

  messages.append(newMessage);
}

APP.sendMessage = function() {
  const messageType = $('input[name="message-type"]:checked').val();
  const messageInput = $('#message-body');
  let message = messageInput.val().trim();

  if (message) {
    switch (messageType) {
      case 'Blob':
        message = new Blob([message], { type: 'plain/text' });
        break;
      case 'ArrayBuffer':
        message = DataConverter.convertStringToArrayBuffer(message);
        break;
      default:
        break;
    }

    APP.webSocketClient.send(message);
    messageInput.val('');
  }
}
