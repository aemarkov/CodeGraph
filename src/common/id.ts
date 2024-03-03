import { NewType } from "./util/newtype";

export type NodeId = {
    value: number,
    readonly __tag: unique symbol
};

export type ReferenceId = {
    value: number,
    readonly __tag: unique symbol
};
