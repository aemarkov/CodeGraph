import * as vscode from 'vscode';

/**
 * Main state of the Code Graph. Each independent graph view (if multiple graph
 * views are supported) has own GraphState
 */
export default interface GraphState {
    context: vscode.ExtensionContext,
    panel: vscode.WebviewPanel | undefined;
    column: vscode.ViewColumn;
    resources: vscode.Uri;
}
