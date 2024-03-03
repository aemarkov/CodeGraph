import { Graph } from "../common/graph";
import * as newtype from '../common/util/newtype';
import { SymbolInformation } from './symbol';
import * as id from '../common/id';

class Item<ID> {
    private id: ID;

    constructor(id: ID) {
        this.id = id;
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
class Node extends Item<id.NodeId> {
    private symbol: SymbolInformation;

    public constructor(id: id.NodeId, symbol: SymbolInformation) {
        super(id);
        this.symbol = symbol;
    }

    public getSymbol(): SymbolInformation {
        return this.symbol;
    }
};

/**
 * Relation (reference) between nodesin code
 */
class Reference extends Item<id.ReferenceId> {
    public constructor(id: id.ReferenceId) {
        super(id);
    }
};

export default class CodeGraph {
    private graph: Graph<id.NodeId, id.ReferenceId>;
    private nodes: Map<id.NodeId, Node>;
    private references: Map<id.ReferenceId, Reference>;

    public constructor() {
        this.graph = new Graph();
        this.nodes = new Map();
        this.references = new Map();
    }

    public addSymbol(symbol: SymbolInformation) {
        const id = newtype.to<id.NodeId>(1); // TODO: create unique ID
        this.graph.addVertex(id);
        const node = new Node(id, symbol);
        this.nodes.set(id, node);
    }

    public addReference(from: SymbolInformation, to: SymbolInformation) {

    }

    private findNode(symbol: SymbolInformation) : Node | undefined {
        // Note: naive implementation for now
        for (const [id, node] of this.nodes.entries()) {
            if (node.getSymbol() === symbol) {
                return node;
            }
        }

        return undefined;
    }
};
