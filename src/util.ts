import * as vscode from 'vscode';
import { Symbol } from './symbol';

/**
 * Get list of symbols in file.
 * This function is intended to use for debug purposes
 * @returns list of symbols in file
 */
export async function dumpSymbols(): Promise<Symbol[]>
{
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error('Failed to get active editor');
    }

    const symbols = await vscode.commands.executeCommand<Symbol[]>(
        'vscode.executeDocumentSymbolProvider',
        editor.document.uri);

    return dump_symbols_recursive(symbols);
}

function dump_symbols_recursive(symbols: any[]): Symbol[]
{
    let symbolsDump: Symbol[] = [];

    for (const x of symbols) {
        symbolsDump.push({
            name: x.name,
            detail: x.detail,
            kind: x.kind,
            location: x.location,
            children: dump_symbols_recursive(x.children)
        });
    }

    return symbolsDump;
}
