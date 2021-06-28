import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { loadMonaco } from './monaco-editor';
import * as monaco from 'monaco-editor';
import { listen, MessageConnection } from 'vscode-ws-jsonrpc';
import { MonacoLanguageClient, CloseAction, ErrorAction, MonacoServices, createConnection } from 'monaco-languageclient';
const ReconnectingWebSocket = require('reconnecting-websocket');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

    private languageId = 'json';
    @ViewChild('container', { static: true, read: ElementRef })
    public container: ElementRef;
    public constructor(
        private zone: NgZone
    ) {
    }

    public ngOnInit(): void {
        this.zone.runOutsideAngular(() => {
            loadMonaco();

            setTimeout(() => {
                const editor = monaco.editor.create(this.container.nativeElement, {
                    theme: 'vs-dark',
                    wordWrap: 'on'
                });

                console.log(1, editor);

                MonacoServices.install(editor);
                // create the web socket
                const url = this.createUrl();
                const webSocket = this.createWebSocket(url);
                // listen when the web socket is opened
                listen({
                    webSocket,
                    onConnection: (connection: MessageConnection) => {
                        // create and start the language client
                        const languageClient = this.createLanguageClient(connection);
                        const disposable = languageClient.start();
                        connection.onClose(() => disposable.dispose());
                    }
                });
            }, 1000);
        });
    }

    public createUrl(): string {
        switch (this.languageId) {
            case 'json':
                return 'ws://localhost:3000/sampleServer';
            case 'typescript':
                return 'your/language-server';
        }
    }

    public createLanguageClient(connection: MessageConnection): MonacoLanguageClient {
        return new MonacoLanguageClient({
            name: `${this.languageId.toUpperCase()} Client`,
            clientOptions: {
                // use a language id as a document selector
                documentSelector: [this.languageId],
                // disable the default error handler
                errorHandler: {
                    error: () => ErrorAction.Continue,
                    closed: () => CloseAction.DoNotRestart
                }
            },
            // create a language client connection from the JSON RPC connection on demand
            connectionProvider: {
                get: (errorHandler, closeHandler) => {
                    return Promise.resolve(createConnection(<any>connection, errorHandler, closeHandler));
                }
            }
        });
    }

    public createWebSocket(socketUrl: string): WebSocket {
        const socketOptions = {
            maxReconnectionDelay: 10000,
            minReconnectionDelay: 1000,
            reconnectionDelayGrowFactor: 1.3,
            connectionTimeout: 10000,
            maxRetries: Infinity,
            debug: false
        };
        return new ReconnectingWebSocket.default(socketUrl, [], socketOptions);
    }

}
