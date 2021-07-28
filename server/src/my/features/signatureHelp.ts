import { _Connection } from 'vscode-languageserver/lib/node/main';
import {
    SignatureHelp
} from "vscode-languageserver-types";
import { Requests, SignatureHelp as SignatureHelpResponse, Request } from "../protocol";
import { OmniSharpServer } from '../server';
import { DefaultDir, DefaultFileName2 } from '../csharp-server';

export function registerSignatureHelp(connection: _Connection, server: OmniSharpServer) {

    connection.onSignatureHelp((params): Thenable<SignatureHelp> => {

        let request: Request = {
            FileName: `${DefaultDir}\\${DefaultFileName2}`,
            Line: params.position.line,
            Column: params.position.character,
        };
        let response: Promise<SignatureHelpResponse> = server.makeRequest<SignatureHelpResponse>(Requests.SignatureHelp, request)
            .catch(err => {
                console.error(err);
                return err;
            });
        return response.then(r => {
            let result: SignatureHelp = {
                activeSignature: r.ActiveSignature,
                activeParameter: r.ActiveParameter,
                signatures: r.Signatures.map(s => {
                    return {
                        label: s.Label, documentation: s.Documentation, parameters: s.Parameters.map(p => {
                            return { label: p.Label, documentation: p.Documentation };
                        })
                    };
                }),
            };

            return Promise.resolve(result);
        });

    });
}
