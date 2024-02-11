import * as vscode from 'vscode';
import GraphView from './view/webview';

/**
 * Main state of the Code Graph. Each independent graph view (if multiple graph
 * views are supported) has own GraphState
 */
export default interface GraphState {
    context: vscode.ExtensionContext,
    view: GraphView,
}
