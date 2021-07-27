import { ServerCapabilities, TextDocumentSyncKind } from "vscode-languageserver/lib/node/main";



export let capabilities : ServerCapabilities<any> = {
    textDocumentSync: TextDocumentSyncKind.Full,
   
    // completionProvider: {
    //     resolveProvider: false,
    //     triggerCharacters: ['.']
    // },
    
    // signatureHelpProvider:{
    //     triggerCharacters :['(']
    // },
    // hoverProvider: true,
    // codeActionProvider: true,
    // documentHighlightProvider: true,
    // documentSymbolProvider: true,
    // documentRangeFormattingProvider: true,
    // colorProvider: true,
    // foldingRangeProvider: true
};