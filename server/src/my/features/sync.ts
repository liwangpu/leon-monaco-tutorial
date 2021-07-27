import { Diagnostic, DidChangeTextDocumentParams, DidOpenTextDocumentParams, NotificationHandler } from "vscode-languageserver";
import { _Connection } from "vscode-languageserver/lib/common/server";
import { DefaultFileName } from "../csharp-server";
import { QuickFixResponse, Request, Requests, UpdateBufferRequest } from "../protocol";
import { OmniSharpServer } from "../server";

export function registerSync(connection: _Connection, server: OmniSharpServer) {
    connection.onDidOpenTextDocument(getOpenHandler(connection,server));
    connection.onDidChangeTextDocument(getChangeHandler(connection,server));
}

function getOpenHandler(connection: _Connection,server: OmniSharpServer): NotificationHandler<DidOpenTextDocumentParams> {
    return params => {
        if (!server.isRunning()) {
            return;
        }
        let buff = params.textDocument.text;
        let updateBufferRequest: UpdateBufferRequest = { Buffer: buff, FileName: DefaultFileName };
        server.makeRequest(Requests.UpdateBuffer, updateBufferRequest).catch(err => {
            console.error(err);
            return err;
        });
        let request: Request = {
            FileName: DefaultFileName,
            Buffer: buff
        };
        let response = server.makeRequest<QuickFixResponse>(Requests.CodeCheck, request).catch(err => {
            console.error(err);
            return err;
        });

        response.then(r => {
            let rr: Diagnostic[] = r.QuickFixes.map(qf => ({
                range: {
                    start: { line: qf.Line, character: qf.Column },
                    end: { line: qf.EndLine, character: qf.EndColumn }
                },
                message : qf.Text
            }));
            connection.sendDiagnostics({ uri: params.textDocument.uri, diagnostics: rr })
        })

    };

   
     
       
   
}

function getChangeHandler(connection: _Connection,server: OmniSharpServer): NotificationHandler<DidChangeTextDocumentParams> {
    return params => {

        if (params.contentChanges.length === 0) {
            return;
        }

        if (!server.isRunning()) {
            return;
        }

        let buff = params.contentChanges[0].text;

        let updateBufferRequest: UpdateBufferRequest = { Buffer: buff, FileName: DefaultFileName };
        server.makeRequest(Requests.UpdateBuffer, updateBufferRequest).catch(err => {
            console.error(err);
            return err;
        });

        
        let request: Request = {
            FileName: DefaultFileName,
            Buffer: buff,
            };
        let response = server.makeRequest<QuickFixResponse>(Requests.CodeCheck, request).catch(err => {
            console.error(err);
            return err;
        });

        response.then(r => {
            let rr: Diagnostic[] = r.QuickFixes.map(qf => ({
                range: {
                    start: { line: qf.Line, character: qf.Column },
                    end: { line: qf.EndLine, character: qf.EndColumn }
                },
                message : qf.Text
            }));
            connection.sendDiagnostics({ uri: params.textDocument.uri, diagnostics: rr })
        })
    };
}