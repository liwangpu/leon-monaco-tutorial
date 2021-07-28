import { Diagnostic, DiagnosticSeverity, DidChangeTextDocumentParams, DidOpenTextDocumentParams, NotificationHandler } from "vscode-languageserver";
import { _Connection } from "vscode-languageserver/lib/common/server";
import { DefaultDir, DefaultFileName2 } from "../csharp-server";
import { QuickFixResponse, Request, Requests, UpdateBufferRequest } from "../protocol";
import { OmniSharpServer } from "../server";




export function registerSync(connection: _Connection, server: OmniSharpServer) {
    connection.onDidOpenTextDocument(getOpenHandler(connection,server));
    connection.onDidChangeTextDocument(getChangeHandler(connection,server));
}

function getOpenHandler(connection: _Connection,server: OmniSharpServer): NotificationHandler<DidOpenTextDocumentParams> {
    return async params => {
        if (!server.isRunning()) {
            return;
        }
        let buff = params.textDocument.text;
        let updateBufferRequest: UpdateBufferRequest = { Buffer: buff, FileName: `${DefaultDir}\\${DefaultFileName2}` };
         await  server.makeRequest(Requests.UpdateBuffer, updateBufferRequest).catch(err => {
            console.error(err);
            return err;
        });
        let request: Request = {
            FileName: null,
            Buffer: null
        };
        let response = server.makeRequest<QuickFixResponse>(Requests.CodeCheck, request).catch(err => {
            console.error(err);
            return err;
        });

        response.then(r => {
            let rr: Diagnostic[] = r.QuickFixes.filter(qf => qf.FileName == `${DefaultDir}\\${DefaultFileName2}`).map(qf => ({
                range: {
                    start: { line: qf.Line, character: qf.Column },
                    end: { line: qf.EndLine, character: qf.EndColumn }
                },
                message : qf.Text,
                severity: translateLevel( qf.LogLevel),
            }));
            connection.sendDiagnostics({ uri: params.textDocument.uri, diagnostics: rr });
        });

    };

   
     
       
   
}

function getChangeHandler(connection: _Connection,server: OmniSharpServer): NotificationHandler<DidChangeTextDocumentParams> {
    return async params => {

        if (params.contentChanges.length === 0) {
            return;
        }

        if (!server.isRunning()) {
            return;
        }

        let buff = params.contentChanges[0].text;

        let updateBufferRequest: UpdateBufferRequest = { Buffer: buff, FileName: `${DefaultDir}\\${DefaultFileName2}` };
        let foo =  await server.makeRequest(Requests.UpdateBuffer, updateBufferRequest).catch(err => {
            console.error(err);
            return err;
        });

        
        let request: Request = {
            FileName: null,
            Buffer: null,
            };
        let response = server.makeRequest<QuickFixResponse>(Requests.CodeCheck, request);
        response.then(r => {
            let quickFixes = r.QuickFixes.filter(qf => qf.FileName == `${DefaultDir}\\${DefaultFileName2}` && qf.LogLevel == 'Error');
            let rr: Diagnostic[] = quickFixes.map(qf => ({
                range: {
                    start: { line: qf.Line, character: qf.Column },
                    end: { line: qf.EndLine, character: qf.EndColumn }
                },
                message : qf.Text,
                severity: translateLevel( qf.LogLevel),
            }));
            connection.sendDiagnostics({ uri: params.textDocument.uri, diagnostics: rr })
        });
    };
}

function translateLevel(level : string) : DiagnosticSeverity{
    switch(level){
        case 'Hidden': return DiagnosticSeverity.Hint;
        case 'Info': return DiagnosticSeverity.Information;
        case 'Warning': return DiagnosticSeverity.Warning;
        case 'Error': return DiagnosticSeverity.Error;
    }
}