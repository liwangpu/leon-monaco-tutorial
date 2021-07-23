import { DidChangeTextDocumentParams, DidOpenTextDocumentParams, NotificationHandler } from "vscode-languageserver";
import { _Connection } from "vscode-languageserver/lib/common/server";
import { DefaultFileName } from "../csharp-server";
import { Requests, UpdateBufferRequest } from "../protocol";
import { OmniSharpServer } from "../server";

export function registerSync(connection: _Connection, server: OmniSharpServer) {
    connection.onDidOpenTextDocument(getOpenHandler(server));
    connection.onDidChangeTextDocument(getChangeHandler(server));
}

function getOpenHandler(server: OmniSharpServer): NotificationHandler<DidOpenTextDocumentParams> {
    return params => {
        if (!server.isRunning()) {
            return;
        }
        let buff = params.textDocument.text;
        let request: UpdateBufferRequest = { Buffer: buff, FileName: DefaultFileName };
        server.makeRequest(Requests.UpdateBuffer, request).catch(err => {
            console.error(err);
            return err;
        });
    };
}

function getChangeHandler(server: OmniSharpServer): NotificationHandler<DidChangeTextDocumentParams> {
    return params => {

        if (params.contentChanges.length === 0) {
            return;
        }

        if (!server.isRunning()) {
            return;
        }

        let buff = params.contentChanges[0].text;

        let request: UpdateBufferRequest = { Buffer: buff, FileName: DefaultFileName };
        server.makeRequest(Requests.UpdateBuffer, request).catch(err => {
            console.error(err);
            return err;
        });
    };
}