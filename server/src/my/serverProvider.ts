import { OmniSharpServer } from "./server";

let server : OmniSharpServer;
export function ensureServer(valueFactory: () => OmniSharpServer){
    if (server === undefined){
        server = valueFactory();
    }  
    server.autoStart(null);
    return server;
}

