import * as vscode from 'vscode';

/* Result of the "executeDocumentSymbolProvider" command is both DocumentSymbol
 * and SymbolInformation. They have a slightly different fields and not all
 * of them are shown in the Inspector. So I want to get all properties
 * together. Looks like this isn't a good solution. */
export interface Symbol {
    /**
     * Name of the symbol
     */
    name: string,

    /**
     * Details of the symbol
     * c, cpp: signature without parameter names
     * py:     empty string
     */
    detail: string,

    /**
     * Kind of the symbol (function, variable etc)
     */
    kind: vscode.SymbolKind,

    /**
     * Location (file URI and range in the document)
     */
    location: vscode.Location,

    /**
     * List of children
     */
    children: Symbol[]
};

/* Symbol without children describes the symbol itself without anything nested. */
export interface SymbolInformation {
    name: string,
    detail: string,
    kind: vscode.SymbolKind,
    location: vscode.Location,
}

export function fromSymbol(symbol: Symbol): SymbolInformation {
    const {children, ...rest} = symbol;
    return rest;
}

