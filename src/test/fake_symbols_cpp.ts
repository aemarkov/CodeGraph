import * as vscode from 'vscode';
import { Symbol } from '../code/symbol';

/* Fake symbols data for a sample C++ file for tests. */
const FakeCppSymbols: Symbol[] =
    [{
        "name": "funcptr",
        "detail": "type alias",
        "kind": 4,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(4, 0), new vscode.Position(4, 24))),
        "children": []
    }, {
        "name": "Struct1",
        "detail": "struct",
        "kind": 22,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(6, 0), new vscode.Position(9, 1))),
        "children": [{
            "name": "x",
            "detail": "int",
            "kind": 7,
            "location": new vscode.Location(
                vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                new vscode.Range(new vscode.Position(7, 4), new vscode.Position(7, 9))),
            "children": []
        }, {
            "name": "y",
            "detail": "int",
            "kind": 7,
            "location": new vscode.Location(
                vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                new vscode.Range(new vscode.Position(8, 4), new vscode.Position(8, 9))),
            "children": []
        }]
    }, {
        "name": "Class1",
        "detail": "class",
        "kind": 4,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(11, 0), new vscode.Position(36, 1))),
        "children": [{
            "name": "Class1",
            "detail": "()",
            "kind": 8,
            "location": new vscode.Location(
                vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                new vscode.Range(new vscode.Position(13, 4), new vscode.Position(16, 5))),
            "children": []
        }, {
            "name": "~Class1",
            "detail": "",
            "kind": 8,
            "location": new vscode.Location(
                vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                new vscode.Range(new vscode.Position(18, 4), new vscode.Position(21, 5))),
            "children": []
        }, {
            "name": "public_method",
            "detail": "void ()",
            "kind": 5,
            "location": new vscode.Location(
                vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                new vscode.Range(new vscode.Position(23, 4), new vscode.Position(26, 5))),
            "children": []
        }, {
            "name": "x",
            "detail": "int",
            "kind": 7,
            "location": new vscode.Location(
                vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                new vscode.Range(new vscode.Position(29, 4), new vscode.Position(29, 9))),
            "children": []
        }, {
            "name": "y",
            "detail": "int",
            "kind": 7,
            "location": new vscode.Location(
                vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                new vscode.Range(new vscode.Position(30, 4), new vscode.Position(30, 9))),
            "children": []
        }, {
            "name": "private_method",
            "detail": "void ()",
            "kind": 5,
            "location": new vscode.Location(
                vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
                new vscode.Range(new vscode.Position(32, 4), new vscode.Position(35, 5))),
            "children": []
        }]
    }, {
        "name": "global",
        "detail": "int",
        "kind": 12,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(39, 0), new vscode.Position(39, 10))),
        "children": []
    }, {
        "name": "global_value",
        "detail": "int",
        "kind": 12,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(40, 0), new vscode.Position(40, 20))),
        "children": []
    }, {
        "name": "const_global_value",
        "detail": "const int",
        "kind": 12,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(41, 0), new vscode.Position(41, 32))),
        "children": []
    }, {
        "name": "static_func_1",
        "detail": "void ()",
        "kind": 11,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(44, 0), new vscode.Position(48, 1))),
        "children": []
    }, {
        "name": "static_func_2",
        "detail": "void ()",
        "kind": 11,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(50, 0), new vscode.Position(53, 1))),
        "children": []
    }, {
        "name": "static_func_3",
        "detail": "void ()",
        "kind": 11,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(55, 0), new vscode.Position(60, 1))),
        "children": []
    }, {
        "name": "static_func_4",
        "detail": "void ()",
        "kind": 11,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(62, 0), new vscode.Position(71, 1))),
        "children": []
    }, {
        "name": "one_line_function",
        "detail": "void ()",
        "kind": 11,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(73, 0), new vscode.Position(73, 35))),
        "children": []
    }, {
        "name": "main",
        "detail": "int ()",
        "kind": 11,
        "location": new vscode.Location(
            vscode.Uri.file("/home/garrus/programming/vscode-codegraph/examples/cpp/main.cpp"),
            new vscode.Range(new vscode.Position(75, 0), new vscode.Position(81, 1))),
        "children": []
    }];

export default FakeCppSymbols;
