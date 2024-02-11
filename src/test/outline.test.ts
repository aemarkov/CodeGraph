import * as assert from 'assert';
import * as vscode from 'vscode';
import * as outline from '../outline';
import {Symbol, SymbolInformation} from '../symbol';
import FakeCppSymbols from './fake_symbols_cpp';

function getSymbolDoTest(symbols: Symbol[], position: vscode.Position, expected: SymbolInformation | undefined)
{
    const res = outline.getSymbolUnderCursorImpl(symbols, position);
    assert.deepEqual(res, expected);
}

suite('getSymbol cpp', () => {
    const getSymbolDoCppTest =
        (position: vscode.Position, expected: SymbolInformation | undefined) =>
        getSymbolDoTest(FakeCppSymbols, position, expected);

    test('no symbols', () => {
        getSymbolDoTest([], new vscode.Position(3, 0), undefined);
    });

    test('not a symbol', () => {
        getSymbolDoCppTest(new vscode.Position(3, 0), undefined);
    });

    test('cpp check function', () => {
        getSymbolDoCppTest(
            new vscode.Position(76, 1),
            {
                "name": "main",
                "detail": "int ()",
                "kind": 11,
                "location": new vscode.Location(
                    vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                    new vscode.Range(new vscode.Position(75, 0), new vscode.Position(81, 1))),
            }
        );
    });

    test('cpp check variable', () => {
        getSymbolDoCppTest(
            new vscode.Position(41, 10),
            {
                "name": "const_global_value",
                "detail": "const int",
                "kind": 12,
                "location": new vscode.Location(
                    vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                    new vscode.Range(new vscode.Position(41, 0), new vscode.Position(41, 32))),
            }
        );
    });

    test('cpp check class', () => {
        getSymbolDoCppTest(
            new vscode.Position(12, 7),
            {
                "name": "Class1",
                "detail": "class",
                "kind": 4,
                "location": new vscode.Location(
                    vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                    new vscode.Range(new vscode.Position(11, 0), new vscode.Position(36, 1))),
            }
        );
    });

    test('cpp check class method', () => {
        getSymbolDoCppTest(
            new vscode.Position(15, 0),
            {
                "name": "Class1",
                "detail": "()",
                "kind": 8,
                "location": new vscode.Location(
                    vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                    new vscode.Range(new vscode.Position(13, 4), new vscode.Position(16, 5))),
            }
        );
    });
});
