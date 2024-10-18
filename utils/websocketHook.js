// ==UserScript==
// @name         k8s console test
// @namespace    http://tampermonkey.net/
// @version      2024-10-17
// @description  try to take over the world!
// @author       You
// @match        https://rancher.indata.cc/dashboard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=indata.cc
// @grant        none
// ==/UserScript==

// ==UserScript==
// @name         WebSocket Hook Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hook WebSocket onmessage and send methods
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const originalWebSocket = window.WebSocket;
    const TARGET_URL = 'exec';

    class WebSocketProxy extends originalWebSocket {
        constructor(...args) {
            super(...args);

            // 检查是否需要hook这个WebSocket连接
            const url = args[0];
            const shouldHook = typeof TARGET_URL === 'string'
                ? url.includes(TARGET_URL)
                : TARGET_URL.test(url);

            if (!shouldHook) {
                return this;
            }
            console.log('Hook WebSocket:', url);


            // 保存原始的onmessage
            const originalOnMessage = this.onmessage;

            // Hook onmessage
            Object.defineProperty(this, 'onmessage', {
                set: function(fn) {
                    return this.addEventListener('message', function(event) {
                        // 添加你的onmessage处理逻辑
                        console.log('接收:', event.data);

                        // 执行原始的消息处理
                        fn.call(this, event);
                    });
                },
                get: function() {
                    return originalOnMessage;
                }
            });

            // // Hook addEventListener
            // const originalAddEventListener = this.addEventListener;
            // this.addEventListener = function(type, listener, options) {
            //     if (type === 'message') {
            //         const newListener = function(event) {
            //             // 添加你的onmessage处理逻辑
            //             console.log('Received (addEventListener):', event.data);
            //
            //             // 执行原始的消息处理
            //             listener.call(this, event);
            //         };
            //         return originalAddEventListener.call(this, type, newListener, options);
            //     }
            //     return originalAddEventListener.call(this, type, listener, options);
            // };

            // Hook send
            const originalSend = this.send;
            this.send = function(data) {
                // 添加你的send处理逻辑
                console.log('发送:', data);

                // 执行原始的发送操作
                return originalSend.call(this, data);
            };
        }
    }

    window.WebSocket = WebSocketProxy;
})();