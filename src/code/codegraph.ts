import { v4 } from "uuid";
import { Graph } from "../common/graph";
import { getSymbolUnderCursor } from './outline';
import * as newtype from '../common/util/newtype';
import { SymbolInformation } from './symbol'

type NodeId = {
    value: string,
    readonly __tag: unique symbol,
};

type ReferenceId = {
    value: string,
    readonly __tag: unique symbol,
};

class Item<ID extends newtype.NewType> {
    private id: ID;

    constructor() {
        this.id = newtype.to(v4());
    }

    public getId(): ID {
        return this.id;
    }
};

/**
 * Node - part of the code.
 * Node can be a symbol (e.g. function or variable), file, module etc.
 * For now it's just a symbol
 */
class Node extends Item<NodeId> {
    private symbol: SymbolInformation;

    public constructor(symbol: SymbolInformation) {
        super();
        this.symbol = symbol;
    }

    public getSymbol(): SymbolInformation {
        return this.symbol;
    }
};

/**
 * Relation (reference) between nodesin code
 */
class Reference extends Item<ReferenceId> {
    public constructor() {
        super();
    }
};

export default class CodeGraph {
    private graph: Graph<Node, Reference>;

    public constructor() {
        this.graph = new Graph();
    }

    public addSymbol(symbol: SymbolInformation) {
        const node = this.findNode(symbol);
        if (node  !== undefined) {
            // this node already exists
            return;
        }

        const newNode = new Node(symbol);
        const v = this.graph.addVertex(newNode);
    }

    public addReference(from: SymbolInformation, to: SymbolInformation) {

    }

    private findNode(symbol: SymbolInformation) : Node | undefined {
        // Note: naive implementation for now
        for (const nodeId of this.graph.vertices()) {
            const node = this.graph.vertexGet(nodeId);
            if (node.getSymbol() === symbol) {
                return node;
            }
        }

        return undefined;
    }
};
