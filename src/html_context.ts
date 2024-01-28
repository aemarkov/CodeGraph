import * as vscode from 'vscode';

/**
 * Multiple parameters needed to generate HTML.
 * Helper struct used to reduce number of arguments passed around.
 */
export default interface HtmlContext {
    context: vscode.ExtensionContext;
    webview: vscode.Webview;
    resources: vscode.Uri;
}
