import { URI } from 'vscode-uri';
import { _Connection, createConnection, SymbolInformation, DocumentSymbol, FoldingRange } from 'vscode-languageserver/lib/node/main';

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
import { V2 } from './protocol';

export const DefaultDir = 'e:\\repo\\RoslynTest';
export const DefaultSolution = "RoslynTest.sln";
export const  DefaultFileName2  = 'RoslynTest\\Program.cs';

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

        this.connection.onDocumentSymbol((params): Thenable<SymbolInformation[] | DocumentSymbol[]> => {
            let request: V2.Structure.CodeStructureRequest = null;
            let response = server.makeRequest<V2.Structure.CodeStructureResponse>(V2.Requests.CodeStructure, request);
            return response.then(r => {
                console.log(r);
                return Promise.resolve(null);
            });

        });

        this.connection.onFoldingRanges((params): Thenable<FoldingRange[]> => {
            let request: V2.BlockStructureRequest = { FileName : `${DefaultDir}\\${DefaultFileName2}`  };
            let response = server.makeRequest<V2.BlockStructureResponse>(V2.Requests.BlockStructure, request);
            return response.then(r => {
                let rr : FoldingRange[] =r.Spans.map(s => ({ 
                    startLine: s.Range.Start.Line, 
                    startCharacter: s.Range.Start.Column ,
                    endLine: s.Range.End.Line,
                    endCharacter: s.Range.End.Column,
                    kind: s.Kind,
                 } ));
                return Promise.resolve(rr);
            });
        });



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

