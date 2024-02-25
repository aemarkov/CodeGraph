import * as vscode from 'vscode';
import {Symbol, SymbolInformation, fromSymbol} from './symbol';

/**
 * Get the symbol (function, variable etc) for current cursor position
 * @returns Symbol or undefined if there is no symbol for cursor position
 */
export async function getSymbolUnderCursor(): Promise<SymbolInformation | undefined>
{
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error('Failed to get active editor');
    }

    const cursor = editor.selection.active;
    const symbols = await vscode.commands.executeCommand<any[]>(
        'vscode.executeDocumentSymbolProvider',
        editor.document.uri);

    return getSymbolUnderCursorImpl(symbols, cursor);
}

/**
 * Get the symbol for current cursor position by given list of symbols of the
 * document and cursor position
 * @param symbols list of symbols in the document
 * @param cursor  cursor position
 * @returns Symbol or undefined if there is no symbol for cursor position
 */
export function getSymbolUnderCursorImpl(
    symbols: Symbol[],
    cursor: vscode.Position): SymbolInformation | undefined {

    for (const symbol of symbols) {
        if (symbol.location.range.contains(cursor)) {
            const nested = getSymbolUnderCursorImpl(symbol.children, cursor);
            if (nested !== undefined) {
                return nested;
            } else {
                return fromSymbol(symbol);
            }
        }
    }

    return undefined;
}
