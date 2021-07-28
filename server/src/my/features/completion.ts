import { _Connection } from "vscode-languageserver/lib/common/server";
import { DefaultDir, DefaultFileName2 } from "../csharp-server";
import { CompletionRequest, CompletionResponse, Requests } from "../protocol";
import { OmniSharpServer } from "../server";
import { CompletionItem } from "vscode-languageserver-types";

export function registerCompletion(connection: _Connection, server: OmniSharpServer) {
    connection.onCompletion((params): Thenable<CompletionItem[]> => {
        let request: CompletionRequest = {
            CompletionTrigger: params.context.triggerKind,
            Line: params.position.line,
            Column: params.position.character,
            FileName: `${DefaultDir}\\${DefaultFileName2}`,
            TriggerCharacter: params.context.triggerCharacter
        }

        let response = server.makeRequest<CompletionResponse>(Requests.Completion, request);

        return response.then(r => {
            let rr: CompletionItem[] = r.Items.map((i) => ({ label: i.Label, kind: i.Kind, documentation: i.Documentation, commitCharacters: i.CommitCharacters }))
            return Promise.resolve(rr);
        }).catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
    });
}