var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const path = require("path");
const rpc = require("@codingame/monaco-jsonrpc");
const server = require("@codingame/monaco-jsonrpc/lib/server");
const lsp = require("vscode-languageserver");
const fs = require("fs");
const request_light_1 = require("request-light");
const vscode_uri_1 = require("vscode-uri");
const main_1 = require("vscode-languageserver/lib/node/main");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const vscode_json_languageservice_1 = require("vscode-json-languageservice");
const TextDocumentImpl = require("vscode-languageserver-textdocument");


class TextServer {

    constructor(connection) {
        this.connection = connection;
        this.documents = new main_1.TextDocuments(TextDocumentImpl.TextDocument);
        this.documents.onDidChangeContent(change => {
            // this.validate(change.document)
            console.log(1);
        });
        this.documents.onDidClose(event => {
            // this.cleanPendingValidation(event.document);
            // this.cleanDiagnostics(event.document);
            console.log(2,event);
        });
        this.jsonService = vscode_json_languageservice_1.getLanguageService({
            schemaRequestService: this.resolveSchema.bind(this)
        });
        this.pendingValidationRequests = new Map();
        this.documents.listen(this.connection);
        // this.documents.onDidChangeContent(change => this.validate(change.document));
        // this.documents.onDidClose(event => {
        //     this.cleanPendingValidation(event.document);
        //     this.cleanDiagnostics(event.document);
        // });

        this.connection.onInitialize(params => {
            if (params.rootPath) {
                this.workspaceRoot = vscode_uri_1.URI.file(params.rootPath);
            }
            else if (params.rootUri) {
                this.workspaceRoot = vscode_uri_1.URI.parse(params.rootUri);
            }
            this.connection.console.log("The server is initialized.");
            return {
                capabilities: {
                    textDocumentSync: vscode_languageserver_protocol_1.TextDocumentSyncKind.Incremental,
                    codeActionProvider: true,
                    completionProvider: {
                        resolveProvider: true
                    },
                    hoverProvider: true,
                    documentSymbolProvider: true,
                    documentRangeFormattingProvider: true,
                    // executeCommandProvider: {
                    //     // commands: ['json.documentUpper']
                    // },
                    colorProvider: true,
                    foldingRangeProvider: true
                }
            };

            // return {};
        });

        // this.connection.onCodeAction(params => this.codeAction(params));
        // this.connection.onCompletion(params => this.completion(params));
        // this.connection.onCompletionResolve(item => this.resolveCompletion(item));
        // this.connection.onExecuteCommand(params => this.executeCommand(params));
        // this.connection.onHover(params => this.hover(params));
        // this.connection.onDocumentSymbol(params => this.findDocumentSymbols(params));
        // this.connection.onDocumentRangeFormatting(params => this.format(params));
        // this.connection.onDocumentColor(params => this.findDocumentColors(params));
        // this.connection.onColorPresentation(params => this.getColorPresentations(params));
        // this.connection.onFoldingRanges(params => this.getFoldingRanges(params));

        this.connection.onCodeAction(params => this.logParams(params, 'onCodeAction'));
        this.connection.onCompletion(params => this.logParams(params, 'onCompletion'));
        this.connection.onCompletionResolve(item => this.logParams(item, 'onCompletionResolve'));
        this.connection.onExecuteCommand(params => this.logParams(params, 'onExecuteCommand'));
        this.connection.onHover(params => this.logParams(params, 'onHover'));
        this.connection.onDocumentSymbol(params => this.logParams(params, 'onDocumentSymbol'));
        this.connection.onDocumentRangeFormatting(params => this.logParams(params, 'onDocumentRangeFormatting'));
        this.connection.onDocumentColor(params => this.logParams(params, 'onDocumentColor'));
        this.connection.onColorPresentation(params => this.logParams(params, 'onColorPresentation'));
        this.connection.onFoldingRanges(params => this.logParams(params, 'onFoldingRanges'));

        this.connection.onNotification((mn, pm) => {
            console.log("method:", mn);
            console.log("params:", pm);
        });

        this.connection.onRequest((mn, pm) => {
            console.log("method:", mn);
            console.log("params:", pm);
        });
    }

    start() {
        this.connection.listen();
    }

    resolveSchema(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = vscode_uri_1.URI.parse(url);
            if (uri.scheme === 'file') {
                return new Promise((resolve, reject) => {
                    fs.readFile(uri.fsPath, 'UTF-8', (err, result) => {
                        err ? reject('') : resolve(result.toString());
                    });
                });
            }
            try {
                const response = yield request_light_1.xhr({ url, followRedirects: 5 });
                return response.responseText;
            }
            catch (error) {
                return Promise.reject(error.responseText || request_light_1.getErrorStatusDescription(error.status) || error.toString());
            }
        });
    }

    logParams(prms, method) {
        console.log(`method is ${method}:`, prms);
    }
}

function launch(socket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const connection = main_1.createConnection(reader, writer);
    const server = new TextServer(connection);
    server.start();
}
exports.launch = launch;