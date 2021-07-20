import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

    // public languageId = 'plaintext';
    // public languageId = 'json';
    public languageId = 'csharp';
    public editorOptions = { theme: 'vs-dark', language: this.languageId };
    public code = ``;
    public constructor() {
    }

    public ngOnInit(): void {

    }

    public monacoOnInit(editor) {
        // install Monaco language client services
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
    }

    public createUrl(): string {
        switch (this.languageId) {
            case 'json':
                return 'ws://localhost:3008/jsonServer';
                case 'csharp':
                    return 'ws://localhost:3008/csharpServer';
            case 'plaintext':
                return 'ws://localhost:3008/textServer';
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
