import { URI } from 'vscode-uri';
import { _Connection, createConnection, Diagnostic } from 'vscode-languageserver/lib/node/main';

import * as rpc from "@codingame/monaco-jsonrpc";
import { OmniSharpServer } from "./server";
import { EventStream } from "./EventStream";
import OptionProvider from "./OptionProvider";
import { registerSync } from "./features/sync";
import { registerCompletion } from "./features/completion";
import { registerSignatureHelp } from "./features/signatureHelp";
import { registerQuickInfo } from "./features/quickInfo";
import { registerColorProvider } from "./features/colorProvider";
import { capabilities } from "./capabilities";
import { registerCodeAction } from './features/codeAction';
import { QuickFixResponse, Request, Requests, V2 } from './protocol';


export const DefaultFileName = 'c:\\Users\\yicheng\\source\\repos\RoslynTest\RoslynTest\\Program.cs';

class CsharpServer {

    protected workspaceRoot: URI | undefined;



    protected readonly pendingValidationRequests = new Map<string, any>();

    constructor(private readonly connection: _Connection, private readonly server: OmniSharpServer) {
    }

    initialize() {

        this.connection.onInitialize(params => {
            this.connection.console.log('connection ok');
            return {
                capabilities: capabilities
            }
        });

        registerSync(this.connection, this.server);

        registerCompletion(this.connection, this.server);

        registerSignatureHelp(this.connection, this.server);

        registerQuickInfo(this.connection, this.server);

        registerColorProvider(this.connection, this.server);

        registerCodeAction(this.connection, this.server);
    }


}


let server: OmniSharpServer;

async function ensureServer() {
    if (server === undefined) {
        server = new OmniSharpServer(new EventStream(), new OptionProvider(), 'c:\\Users\\yicheng\\Downloads\\omnisharp-vscode-master', false);
    }
    await server.autoStart(null);
    return server;
}

export async function launch(socket: rpc.IWebSocket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const connection = createConnection(reader, writer);
    let server = await ensureServer();
    new CsharpServer(connection, server).initialize();
    connection.listen();
}

