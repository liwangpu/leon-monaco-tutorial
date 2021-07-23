import { _Connection } from 'vscode-languageserver/lib/node/main';
import { Hover} from "vscode-languageserver-types";
import { OmniSharpServer } from "../server";
import { Requests,  QuickInfoRequest, QuickInfoResponse } from "../protocol";
import { DefaultFileName } from '../csharp-server';



export function registerQuickInfo(connection: _Connection, server: OmniSharpServer){
    connection.onHover((params) : Thenable<Hover> => {
        let request : QuickInfoRequest = { FileName:DefaultFileName, Line: params.position.line, Column:params.position.character  };
        let response = server.makeRequest<QuickInfoResponse>(Requests.QuickInfo, request);
        return response.then(r => {
            r.Markdown
            let rr : Hover = {  contents : r.Markdown };
            return Promise.resolve(rr);
        }).catch(error => {
            console.log(error);
            return Promise.reject(error);
        });
    });

}