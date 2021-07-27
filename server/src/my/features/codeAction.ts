import { _Connection, CodeAction } from 'vscode-languageserver/lib/node/main';
import { DefaultFileName } from '../csharp-server';

import { V2 } from "../protocol";
import { OmniSharpServer } from '../server';


export function registerCodeAction(connection: _Connection, server: OmniSharpServer){

    connection.onCodeAction((params): Thenable<CodeAction[]> => {
        let request: V2.GetCodeActionsRequest = {
            FileName: DefaultFileName, Selection: {
                Start: { Line: params.range.start.line, Column: params.range.start.character },
                End: { Line: params.range.end.line, Column: params.range.end.character }
            }
        };
        let response = server.makeRequest<V2.GetCodeActionsResponse>(V2.Requests.GetCodeActions, request);
        return response.then(r => {
            let rr: CodeAction[] = r.CodeActions.map(ca => {
                return { title: ca.Name, }
            });

            return Promise.resolve(rr);
        })

    }

    );

}
