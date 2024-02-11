import * as vscode from 'vscode';
import GraphState from './graph_state';
import HtmlContext from './html_context';
import { getSymbolUnderCursor } from './outline'

export function activate(context: vscode.ExtensionContext) {
    console.log('[codegraph] loaded');

    let state: GraphState = {
        context: context,
        panel: undefined,
        column: vscode.ViewColumn.Two,
        resources: vscode.Uri.joinPath(context.extensionUri, 'dist/webview'),
    };

    // open graph command
    let open_graph_cmd = vscode.commands.registerCommand('codegraph.open_code_graph',
        async () => {
            console.log('[codegraph] open_code_graph');

            if (state.panel) {
                // Show existing panel
                state.panel.reveal(state.column);
            } else {
                // Create a new panel if it doesn't exists
                await createGraphView(state);
            }
        });

    // inspect symbol commandm
    let inspect_symbol_cmd = vscode.commands.registerCommand('codegraph.inspect_symbol',
        async () => {
            console.log('[codegraph] inspect_symbol');

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            const symbol = await getSymbolUnderCursor();
            console.log(symbol);
        });

    context.subscriptions.push(open_graph_cmd);
    context.subscriptions.push(inspect_symbol_cmd);
}

export function deactivate() { }

// Creates a webview for graph
async function createGraphView(state: GraphState) {
    state.panel = vscode.window.createWebviewPanel(
        'codegraph',
        'Code Graph',
        state.column,
        {
            localResourceRoots: [state.resources],
            enableScripts: true,
        }
    );

    state.panel.onDidDispose(() => {
        console.log('[codegraph] WebView panel is disposed');
    }, null, state.context.subscriptions);

    const htmlContext: HtmlContext = {
        context: state.context,
        webview: state.panel.webview,
        resources: state.resources,
    };

    state.panel.webview.html = await getWebviewContent(htmlContext);
}

// Generates HTML content for WebView
async function getWebviewContent(ctx: HtmlContext): Promise<string> {

    // Load webview HTML page
    const htmlPath = vscode.Uri.joinPath(ctx.resources, 'index.html');
    const htmlFile = await vscode.workspace.fs.readFile(htmlPath);
    let html = new TextDecoder('utf-8').decode(htmlFile);

    // Convert loadable content URI to webview URI
    html = include_local_resource("bundle.js", "---MAIN-JS--URI---", html, ctx);
    html = include_local_resource("index.css", "---MAIN-CSS--URI---", html, ctx);

    return html;
}

// Insert webview local resource URI into HTML page
function include_local_resource(
    file: string,
    placeholder: string,
    html: string,
    ctx: HtmlContext): string {

    const webviewUri = ctx.webview.asWebviewUri(vscode.Uri.joinPath(ctx.resources, file));
    const filledHtml = html.replace(placeholder, webviewUri.toString());

    return filledHtml;
}
