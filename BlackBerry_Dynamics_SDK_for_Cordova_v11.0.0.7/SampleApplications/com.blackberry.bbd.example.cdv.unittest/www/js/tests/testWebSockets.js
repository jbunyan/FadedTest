/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * "cordova-plugin-bbd-websocket" unit tests
 */

describe('WebSocket API', function() {
  const CONNECTING = 0;
  const OPEN = 1;
  const CLOSING = 2;
  const CLOSED = 3;
  // DEVNOTE: maximum message length is 50 on 'wss://javascript.info/article/websocket/chat/ws'
  const MAXMESSAGELENGTH = 50;

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
  }

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('Check WebSocket is available', function() {
    expect(WebSocket).toBeDefined();
  });

  it('Check WebSocket API is available', function() {
    const isAvailableWebSocketProps = true ;
    const webSocketPrototypeProps = [
      'CONNECTING',
      'OPEN',
      'CLOSING',
      'CLOSED',
      'readyState',
      'extensions',
      'protocol',
      'url',
      'close',
      'send'
    ];
    const webSocketAPI = Object.getOwnPropertyNames(WebSocket.prototype);

    for (let i = 0; i < webSocketPrototypeProps.length; i++) {
      if (!webSocketAPI.includes(webSocketPrototypeProps[i])) {
        isAvailableWebSocketProps = false;
        break;
      }
    }

    expect(isAvailableWebSocketProps).toBe(true);
  });

  describe('WebSocket callbacks: onopen, onmessage, onclose with ws:// scheme' , function() {
    // DEVNOTE: 'javascript.info' only accept 'wss:', not 'ws:'
    const url = 'wss://javascript.info/article/websocket/chat/ws';

    // DEVNOTE: disabled due to 'javascript.info' only accept 'wss:'
    xit('WebSocket: check onopen connection callback - ws:// scheme - positive case', function(done) {
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        const type = event.type;

        expect(type).toBeDefined();
        expect(type).toBe('open');

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      }

      webSocket.onerror = function(error) {
        expect('Error should not happen').toBe(true);
        done();
      };
    });

    it('WebSocket: check onopen connection callback - ws:// scheme - negative case', function(done) {
      const invalidUrl = 'ws://NoHost321.arg';

      const webSocket = new WebSocket(invalidUrl);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect('"onopen" should not be triggered with invalid url').toBe(true);
        done();
      };

      webSocket.onmessage = function(event) {
        expect('"onmessage" should not be triggered with invalid url').toBe(true);
        done();
      };

      webSocket.onclose = function(event) {
        expect(webSocket.readyState).toBe(CLOSED);
      }

      webSocket.onerror = function(error) {
        expect(error.message).toBeDefined();

        done();
      };
    });

    // DEVNOTE: disabled due to 'javascript.info' only accept 'wss:'
    xit('WebSocket: check onclose connection callback - ws:// scheme', function(done) {
      const expectedCloseCode = 1000;
      const expectedCloseReason = 'Normal closure';
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        isConditionChecked = true;

        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(webSocket.readyState).toBe(CLOSED);
        expect(isConditionChecked).toBe(true);
        const { type, code, reason } = event;

        expect(type).toBeDefined();
        expect(type).toBe('close');
        expect(code).toBeDefined();
        expect(code).toBe(expectedCloseCode);
        expect(reason).toBeDefined();
        expect(reason).toBe(expectedCloseReason);

        done();
      };

      webSocket.onerror = function(error) {
        expect('Error should not happen').toBe(true);
        done();
      };
    });

    // DEVNOTE: disabled due to 'javascript.info' only accept 'wss:'
    xit('WebSocket: send / receive text message, check onmessage callback - ws:// scheme', function(done) {
      const message = 'Some test message';
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        webSocket.send(message);
      };

      webSocket.onmessage = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        const { type, data } = event;

        expect(data).toBeDefined();
        expect(typeof data).toBe('string');
        expect(type).toBe('message');

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      }

      webSocket.onerror = function(error) {
        expect('Error should not happen').toBe(true);
        done();
      };
    });

  });

  describe('WebSocket events: open, message, close with wss:// scheme' , function() {
    const url = 'wss://javascript.info/article/websocket/chat/ws';

    it('WebSocket: check open connection event - wss:// scheme', function(done) {
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.addEventListener('open', function (event) {
        expect(webSocket.readyState).toBe(OPEN);
        const type = event.type;

        expect(typeof event).toBe('object');
        expect(type).toBeDefined();
        expect(type).toBe('open');

        isConditionChecked = true;
        webSocket.close();
      });

      webSocket.addEventListener('close', function (event) {
        expect(isConditionChecked).toBe(true);
        done();
      });

      webSocket.addEventListener('error', function (event) {
        expect('Error should not happen').toBe(true);
        done();
      });
    });

    it('WebSocket: check open connection event - ws:// scheme - negative case', function(done) {
      const invalidUrl = 'ws://NoHost321.arg';

      const webSocket = new WebSocket(invalidUrl);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.addEventListener('open', function (event) {
        expect('Event "open" should not be triggered with invalid url').toBe(true);
        done();
      });

      webSocket.addEventListener('message', function (event) {
        expect('Event "message" should not be triggered with invalid url').toBe(true);
        done();
      });

      webSocket.addEventListener('close', function (event) {
        expect(webSocket.readyState).toBe(CLOSED);
      });

      webSocket.addEventListener('error', function (error) {
        expect(error.message).toBeDefined();
        done();
      });
    });

    it('WebSocket: check close connection event - wss:// scheme', function(done) {
      const expectedCloseCode = 1000;
      const expectedCloseReason = 'Normal closure';
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.addEventListener('open', function (event) {
        expect(webSocket.readyState).toBe(OPEN);
        isConditionChecked = true;
        webSocket.close();
      });

      webSocket.addEventListener('close', function (event) {
        expect(webSocket.readyState).toBe(CLOSED);
        expect(isConditionChecked).toBe(true);
        const { type, code, reason } = event;

        expect(typeof event).toBe('object');
        expect(type).toBeDefined();
        expect(type).toBe('close');
        expect(code).toBeDefined();
        expect(code).toBe(expectedCloseCode);
        expect(reason).toBeDefined();
        expect(reason).toBe(expectedCloseReason);

        done();
      });

      webSocket.addEventListener('error', function (event) {
        expect('Error should not happen').toBe(true);
        done();
      });
    });

    it('WebSocket: send / receive text message, check message event - wss:// scheme', function(done) {
      const message = 'Some test message with symbols !@#$%^&*()""';
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.addEventListener('open', function (event) {
        expect(webSocket.readyState).toBe(OPEN);
        webSocket.send(message);
      });

      webSocket.addEventListener('message', function (event) {
        expect(webSocket.readyState).toBe(OPEN);
        const { data, type } = event;

        expect(type).toBe('message');
        expect(data).toBeDefined();
        expect(data).toBe(message);

        isConditionChecked = true;
        webSocket.close();
      });

      webSocket.addEventListener('close', function (event) {
        expect(isConditionChecked).toBe(true);
        done();
      });

      webSocket.addEventListener('error', function (event) {
        expect('Error should not happen').toBe(true);
        done();
      });
    });

  });

  describe('WebSocket send and receive different type of messages', function() {
    const url = 'wss://javascript.info/article/websocket/chat/ws';

    it('WebSocket: send, receive text message', function(done) {
      const message = 'Some test message with symbols !@#$%^&*()""';
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        webSocket.send(message);
      };

      webSocket.onmessage = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        const { data, type } = event;

        expect(type).toBe('message');
        expect(data).toBeDefined();
        expect(data).toBe(message);

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      };

      webSocket.onerror = function(error) {
        expect(error.message).toBe(true);
        done();
      };
    });

    it('WebSocket: send, receive Blob, binaryType = "blob", convert to text using Response', function(done) {
      const dataString = 'test string !@#$%^&*() йцукен';
      const blob = new Blob([dataString], {
        type: 'text/plain'
      });
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);

        webSocket.binaryType = 'blob';
        webSocket.send(blob);
      };

      webSocket.onmessage = async function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        const { data, type } = event;

        expect(type).toBe('message');
        expect(data).toBeDefined();
        expect(data instanceof Blob).toBe(true);
        const textMessage = await new Response(data).text();
        expect(textMessage).toBe(dataString);

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      };

      webSocket.onerror = function(error) {
        expect(error.message).toBe(true);
        done();
      };
    });

    it('WebSocket: send, receive Blob, binaryType = "blob", convert to text using FileReader API', function(done) {
      const dataString = 'test string !@#$%^&*() йцукен';
      const binaryType = 'blob';
      const blob = new Blob([dataString], {
        type: 'text/plain'
      });
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);

        webSocket.binaryType = binaryType;
        webSocket.send(blob);
      };

      webSocket.onmessage = async function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        const { data, type } = event;

        expect(type).toBe('message');
        expect(data).toBeDefined();
        expect(data instanceof Blob).toBe(true);
        const textMessage = await DataConverter.readBlobAsText(data);
        expect(textMessage).toBe(dataString);

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      };

      webSocket.onerror = function(error) {
        expect(error.message).toBe(true);
        done();
      };
    });

    it('WebSocket: send, receive ArrayBuffer, binaryType = "arraybuffer"', function(done) {
      const dataString = 'test string !@#$%^&*() йцукен';
      const binaryType = 'arraybuffer';
      const arrayBufferMessage = DataConverter.convertStringToArrayBuffer(dataString);
      let isConditionChecked = false;

      const webSocket = new WebSocket(url);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);

        webSocket.binaryType = binaryType;
        webSocket.send(arrayBufferMessage);
      };

      webSocket.onmessage = async function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        const { data, type } = event;

        expect(type).toBe('message');
        expect(data).toBeDefined();
        expect(data instanceof ArrayBuffer).toBe(true);
        const textMessage = DataConverter.convertArrayBufferToString(data);
        if (arrayBufferMessage.byteLength > MAXMESSAGELENGTH) {
          expect(textMessage).toBe(dataString.slice(0, MAXMESSAGELENGTH / 2));
        }
        else {
          expect(textMessage).toBe(dataString);
        }

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      };

      webSocket.onerror = function(error) {
        expect(error.message).toBe(true);
        done();
      };
    });

    it('WebSocket: multiple sequential connections with sending, receiving text messages', function(done) {
      const message = 'Some test message with symbols !@#$%^&*()""';
      let opened = 0;
      let closed = 0;
      const expectedCloseCode = 1000;
      const expectedCloseReason = 'Normal closure';

      const onOpen = function(event) {
        expect(this.readyState).toBe(OPEN);
        opened++;
        this.send(message);
      };

      const onMessage = function(event) {
        expect(this.readyState).toBe(OPEN);
        const { data, type } = event;

        expect(type).toBe('message');
        expect(data).toBeDefined();
        expect(data).toBe(message);

        const self = this;
        setTimeout(function(){self.close()}, 500); // sometimes we get CLOSING readtState. Need a little delay
      };

      const onClose = function(event) {
        expect(this.readyState).toBe(CLOSED);
        const { type, code, reason } = event;

        expect(typeof event).toBe('object');
        expect(type).toBeDefined();
        expect(type).toBe('close');
        expect(code).toBeDefined();
        expect(code).toBe(expectedCloseCode);
        expect(reason).toBeDefined();
        expect(reason).toBe(expectedCloseReason);

        closed++;
        if (closed === 3 && opened === 3) {
          done();
        }
      };

      const onError = function(error) {
        expect(error.message).toBe(true);
        done();
      };

      const webSocket1 = new WebSocket(url);
      webSocket1.onopen = onOpen.bind(webSocket1);
      webSocket1.onmessage = onMessage.bind(webSocket1);
      webSocket1.onclose = onClose.bind(webSocket1);
      webSocket1.onerror = onError.bind(webSocket1);

      const webSocket2 = new WebSocket(url);
      webSocket2.onopen = onOpen.bind(webSocket2);
      webSocket2.onmessage = onMessage.bind(webSocket2);
      webSocket2.onclose = onClose.bind(webSocket2);
      webSocket2.onerror = onError.bind(webSocket2);

      const webSocket3 = new WebSocket(url);
      webSocket3.onopen = onOpen.bind(webSocket3);
      webSocket3.onmessage = onMessage.bind(webSocket3);
      webSocket3.onclose = onClose.bind(webSocket3);
      webSocket3.onerror = onError.bind(webSocket3);
    });

  });

  describe('WebSocket additional functionality: protocol, extensions' , function() {
    const url = 'wss://javascript.info/article/websocket/chat/ws';

    it('WebSocket: set protocols as array, check "protocol", "extensions", "url" - positive case', function(done) {
      const expectedProtocol = 'soap';
      let isConditionChecked = false;

      const webSocket = new WebSocket(url, ['soap', 'wamp']);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        expect(webSocket.url).toBe(url);
        const type = event.type;

        expect(type).toBeDefined();
        expect(type).toBe('open');
        if (cordova.platformId === 'android') {
          expect(webSocket.protocol).toBe(expectedProtocol);
        }
        expect(webSocket.extensions).toBe('');

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      }

      webSocket.onerror = function(error) {
        expect('Error should not happen').toBe(true);
        done();
      };
    });

    it('WebSocket: set protocol as string, check "protocol", "extensions", "url" - positive case', function(done) {
      const protocol = 'wamp';
      let isConditionChecked = false;

      const webSocket = new WebSocket(url, protocol);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        expect(webSocket.url).toBe(url);
        const type = event.type;

        expect(type).toBeDefined();
        expect(type).toBe('open');
        if (cordova.platformId === 'android') {
          expect(webSocket.protocol).toBe(protocol);
        }
        expect(webSocket.extensions).toBe('');

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      }

      webSocket.onerror = function(error) {
        expect('Error should not happen').toBe(true);
        done();
      };
    });

    // DEVNOTE: disabled due to 'wss://javascript.info/article/websocket/chat/ws' supports 'wamp' protocol
    xit('WebSocket: set protocol, check "protocol", "extensions", "url" - negative case', function(done) {
      const urlWithoutProtocolsSupport = 'wss://javascript.info/article/websocket/chat/ws';
      const protocol = 'wamp';
      let isConditionChecked = false;

      const webSocket = new WebSocket(urlWithoutProtocolsSupport, protocol);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        expect(webSocket.url).toBe(urlWithoutProtocolsSupport);
        const type = event.type;

        expect(type).toBeDefined();
        expect(type).toBe('open');
        expect(webSocket.protocol).toBe('');
        expect(webSocket.extensions).toBe('');

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      }

      webSocket.onerror = function(error) {
        expect('Error should not happen').toBe(true);
        done();
      };
    });

    it('WebSocket: create connection with "protocols" = null, valid headers', function(done) {
      let isConditionChecked = false;

      const webSocket = new WebSocket(url, null, { headers: [{'Authorization': 'Basic someEncodedString'}] });
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        expect(webSocket.url).toBe(url);
        const type = event.type;

        expect(type).toBeDefined();
        expect(type).toBe('open');

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      }

      webSocket.onerror = function(error) {
        expect('Error should not happen').toBe(true);
        done();
      };
    });

    it('WebSocket: create connection with empty protocols, "options" = null', function(done) {
      let isConditionChecked = false;

      const webSocket = new WebSocket(url, '', null);
      expect(webSocket.readyState).toBe(CONNECTING);

      webSocket.onopen = function(event) {
        expect(webSocket.readyState).toBe(OPEN);
        expect(webSocket.url).toBe(url);
        const type = event.type;

        expect(type).toBeDefined();
        expect(type).toBe('open');

        isConditionChecked = true;
        webSocket.close();
      };

      webSocket.onclose = function(event) {
        expect(isConditionChecked).toBe(true);
        done();
      }

      webSocket.onerror = function(error) {
        expect('Error should not happen').toBe(true);
        done();
      };
    });

  });

  describe('WebSocket integration tests with fetch / XMLHttpRequest using Blob messages',function() {
    beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('WebSocket: get image as Blob by fetch, send and receive it as Blob', function(done) {
      const url = 'wss://javascript.info/article/websocket/chat/ws';
      const method = 'GET';
      const imageUrl = 'https://httpbin.org/image/jpeg';
      let isConditionChecked = false;

      fetch(imageUrl, {
        method
      }).then(async function(response) {
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseBlob = await response.blob();
        // DEVNOTE: commented due to issue where 'content-length' is missing in fetch response
        // const expectedSize = parseInt(response.headers.get('Content-Length'), 10);

        expect(responseBlob).toBeDefined();
        expect(responseBlob instanceof Blob).toBe(true);
        expect(responseBlob.size).toBeDefined();
        expect(responseBlob.size).toBeGreaterThan(0);
        // expect(responseBlob.size).toBe(expectedSize);

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = 'blob';
          webSocket.send(responseBlob);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof Blob).toBe(true);
          expect(data.size).toBeDefined();
          expect(data.size).toBeGreaterThan(0);
          // DEVNOTE: commented due to issue wehre 'content-length' is missing in fetch response
          // expect(data.size).toBe(expectedSize);

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(event) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

    });

    it('WebSocket: get JSON as Blob by fetch, use it to send and receive Blob message, ' +
      'convert received Blob to text using Response', function(done) {
      const url = 'wss://javascript.info/article/websocket/chat/ws';
      const method = 'GET';
      const jsonUrl = 'http://httpbin.org/get?test_prop=test_value12345';
      let isConditionChecked = false;

      fetch(jsonUrl, {
        method
      }).then(async function(response) {
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);

        const responseBlob = await response.blob();
        expect(responseBlob).toBeDefined();
        expect(responseBlob instanceof Blob).toBe(true);
        const expectedBlobSize = responseBlob.size;
        const convertedBlobToText = await new Response(responseBlob).text();

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = 'blob';
          webSocket.send(responseBlob);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof Blob).toBe(true);
          const textMessage = await new Response(data).text();
          if (convertedBlobToText.length > MAXMESSAGELENGTH) {
            expect(data.size).toBe(MAXMESSAGELENGTH);
            expect(textMessage).toBe(convertedBlobToText.slice(0, MAXMESSAGELENGTH));
          } else {
            expect(data.size).toBe(expectedBlobSize);
            expect(textMessage).toBe(convertedBlobToText);
          }
          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(event) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });

    });

    it('WebSocket: get HTML as Blob by fetch, use it to send and receive Blob message, ' +
      'convert received Blob to text using FileReader', function(done) {
      const url = 'wss://javascript.info/article/websocket/chat/ws';
      const method = 'GET';
      const htmlUrl = 'https://html.spec.whatwg.org/multipage/web-sockets.html#network';
      let isConditionChecked = false;

      fetch(htmlUrl, {
        method
      }).then(async function(response) {
        expect(response.status).toBe(200);

        const responseBlob = await response.blob();

        expect(responseBlob).toBeDefined();
        expect(responseBlob instanceof Blob).toBe(true);
        const expectedBlobSize = responseBlob.size;
        const convertedBlobToText = await DataConverter.readBlobAsText(responseBlob);

        const webSocket = new WebSocket(url);
        expect(webSocket.readyState).toBe(CONNECTING);

        webSocket.onopen = function(event) {
          expect(webSocket.readyState).toBe(OPEN);

          webSocket.binaryType = 'blob';
          webSocket.send(responseBlob);
        };

        webSocket.onmessage = async function(event) {
          expect(webSocket.readyState).toBe(OPEN);
          const { data, type } = event;

          expect(type).toBe('message');
          expect(data).toBeDefined();
          expect(data instanceof Blob).toBe(true);
          const textMessage = await DataConverter.readBlobAsText(data);
          if (convertedBlobToText.length > MAXMESSAGELENGTH) {
            expect(data.size).toBe(MAXMESSAGELENGTH);
            expect(textMessage).toBe(convertedBlobToText.slice(0, MAXMESSAGELENGTH));
          } else {
            expect(data.size).toBe(expectedBlobSize);
            expect(textMessage).toBe(convertedBlobToText);
          }

          isConditionChecked = true;
          webSocket.close();
        };

        webSocket.onclose = function(event) {
          expect(isConditionChecked).toBe(true);
          done();
        };

        webSocket.onerror = function(error) {
          expect(error.message).toBe(true);
          done();
        };
      });
    });

    it('WebSocket: get JSON as Blob by XMLHttpRequest, use it to send and receive Blob message, ' +
      'convert received Blob to text using FileReader', function(done) {
      const url = 'wss://javascript.info/article/websocket/chat/ws';
      const method = 'GET';
      const responseType = 'blob';
      const jsonUrl = 'http://httpbin.org/get?test_prop=test_value12345';
      let isConditionChecked = false;

      const xhr = new XMLHttpRequest();
      expect(xhr.readyState).toBe(0);

      xhr.open(method, jsonUrl);
      expect(xhr.readyState).toBe(1);

      xhr.responseType = responseType;

      xhr.onreadystatechange = async function() {
        const expectedStatus = 200;

        if (xhr.readyState === 4) {

          expect(xhr.response).toBeDefined();
          expect(xhr.response instanceof Blob).toBe(true);
          const responseBlob = xhr.response;
          const expectedBlobSize = responseBlob.size;
          const convertedBlobToText  = await DataConverter.readBlobAsText(responseBlob);

          expect(xhr.status).toBeDefined();
          expect(xhr.status).toBe(expectedStatus);

          const webSocket = new WebSocket(url);
          expect(webSocket.readyState).toBe(CONNECTING);

          webSocket.onopen = function(event) {
            expect(webSocket.readyState).toBe(OPEN);

            webSocket.binaryType = responseType;
            webSocket.send(responseBlob);
          };

          webSocket.onmessage = async function(event) {
            expect(webSocket.readyState).toBe(OPEN);
            const { data, type } = event;

            expect(type).toBe('message');
            expect(data).toBeDefined();
            expect(data instanceof Blob).toBe(true);
            const textMessage = await DataConverter.readBlobAsText(data);
            if (convertedBlobToText.length > MAXMESSAGELENGTH) {
              expect(data.size).toBe(MAXMESSAGELENGTH);
              expect(textMessage).toBe(convertedBlobToText.slice(0, MAXMESSAGELENGTH));
            } else {
              expect(data.size).toBe(expectedBlobSize);
              expect(textMessage).toBe(convertedBlobToText);
            }

            isConditionChecked = true;
            webSocket.close();
          };

          webSocket.onclose = function(event) {
            expect(isConditionChecked).toBe(true);
            done();
          };

          webSocket.onerror = function(error) {
            expect(error.message).toBe(true);
            done();
          };

        }
      };

      xhr.send();
    });

  });

});
