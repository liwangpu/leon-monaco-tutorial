import { _Connection, ColorInformation } from 'vscode-languageserver/lib/node/main';
import { OmniSharpServer } from "../server";


export function registerColorProvider(connection: _Connection, server: OmniSharpServer){
    connection.onDocumentColor((params) : Thenable<ColorInformation[]> =>{
     
        let i0 :ColorInformation = {
            color:{ red:1, green:1, blue:0, alpha:1},
            range:{start :{ line: 0, character:5}, end:{ line:0, character:11}}
        };

        let i1 :ColorInformation = {
           color:{ red:0, green:0, blue:1, alpha:1},
           range:{start :{ line: 2, character:5}, end:{ line:2, character:6}}
       };

  
       let i2 :ColorInformation = {
           color:{ red:0, green:1, blue:1, alpha:1},
           range:{start :{ line: 4, character:0}, end:{ line:4, character:1}}
       };
 
  
        return Promise.resolve(
            [ i0, i1, i2]
        );
       });

}