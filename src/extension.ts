import * as vscode from 'vscode';
import GraphState from './graph_state';
import GraphView from './view/webview';
import { getSymbolUnderCursor } from './code/outline';

export function activate(context: vscode.ExtensionContext) {
    console.log('[codegraph] loaded');

    let state: GraphState = {
        context: context,
        view: new GraphView(context),
    };

    // open graph command
    let open_graph_cmd = vscode.commands.registerCommand('codegraph.open_code_graph',
        async () => {
            console.log('[codegraph] open_code_graph');
            await state.view.show();
        });

    // inspect symbol commandm
    let inspect_symbol_cmd = vscode.commands.registerCommand('codegraph.inspect_symbol',
        async () => {
            console.log('[codegraph] inspect_symbol');
            const symbol = await getSymbolUnderCursor();
            console.log(symbol);
        });

    context.subscriptions.push(open_graph_cmd);
    context.subscriptions.push(inspect_symbol_cmd);
}

export function deactivate() { }
