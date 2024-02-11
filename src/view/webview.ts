import * as vscode from 'vscode';
import GraphState from '../graph_state';
import assert from 'assert';

const WEBVIEW_DIR = 'dist/webview';

/**
 * Class that manages WebView where extension GUI is rendered
 */
export default class GraphView {
    context: vscode.ExtensionContext;
    resources: vscode.Uri;
    column: vscode.ViewColumn;
    panel: vscode.WebviewPanel | undefined;

    public constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.resources = vscode.Uri.joinPath(context.extensionUri, 'dist/webview');
        this.column = vscode.ViewColumn.Two;
    }

    public async show()
    {
        if (this.panel) {
            // Show existing panel
            this.panel.reveal(this.column);
        } else {
            // Create a new panel if it doesn't exists
            await this.createGraphView();
        }
    }

    private async createGraphView()
    {
        this.panel = vscode.window.createWebviewPanel(
            'codegraph',
            'Code Graph',
            this.column,
            {
                localResourceRoots: [this.resources],
                enableScripts: true,
            }
        );

        this.panel.onDidDispose(() => {
            console.log('[codegraph] WebView panel is disposed');
        }, null, this.context.subscriptions);

        this.panel.webview.html = await this.getWebviewContent();
    }

    // Generates HTML content for WebView
    private async getWebviewContent(): Promise<string> {

        // Load webview HTML page
        const htmlPath = vscode.Uri.joinPath(this.resources, 'index.html');
        const htmlFile = await vscode.workspace.fs.readFile(htmlPath);
        let html = new TextDecoder('utf-8').decode(htmlFile);

        // Convert loadable content URI to webview URI
        html = this.includeLocalResource("bundle.js", "---MAIN-JS--URI---", html);
        html = this.includeLocalResource("index.css", "---MAIN-CSS--URI---", html);

        return html;
    }

    // Insert webview local resource URI into HTML page
    private includeLocalResource(
        file: string,
        placeholder: string,
        html: string): string {

        assert(this.panel !== undefined);
        const webviewUri = this.panel.webview.asWebviewUri(
            vscode.Uri.joinPath(this.resources, file));
        const filledHtml = html.replace(placeholder, webviewUri.toString());

        return filledHtml;
    }
}
