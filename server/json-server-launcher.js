"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const path = require("path");
const rpc = require("@codingame/monaco-jsonrpc");
const server = require("@codingame/monaco-jsonrpc/lib/server");
const lsp = require("vscode-languageserver");
const json_server_1 = require("./json-server");
function launch(socket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    json_server_1.start(reader, writer);
}
exports.launch = launch;
