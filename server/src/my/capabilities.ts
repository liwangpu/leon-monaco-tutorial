import { ServerCapabilities, TextDocumentSyncKind } from "vscode-languageserver/lib/node/main";



export let capabilities : ServerCapabilities<any> = {
    textDocumentSync: TextDocumentSyncKind.Full,
    // codeActionProvider: true,
    completionProvider: {
        resolveProvider: false,
        triggerCharacters: ['.']
    },
    signatureHelpProvider:{
        triggerCharacters :['(']
    },
    hoverProvider: true,
    // documentHighlightProvider: true,
    // documentSymbolProvider: true,
    // documentRangeFormattingProvider: true,
    // colorProvider: true,
    // foldingRangeProvider: true
};