/* This module provides the Haskell-like newtype pattern.
 * Credits: https://kubyshkin.name/posts/newtype-in-typescript/
 * I can use newtype-ts, but I don't.
 *
 * How to create newtype
 * type Foo = {
 *   value: number;
 *   readonly __tag: unique symbol
 * };
 *
 */

export type NewType = { readonly __tag: symbol, value: any };

/**
 * Wrap raw value to newtype
 * @param value raw value
 * @returns     value wrapped as newtype
 */
export function to<
    T extends NewType =
    { readonly __tag: unique symbol, value: never }
>(value: T["value"]): T {
    return value as any as T;
}

/**
 * Get raw value from newtype
 * @param value newtype
 * @returns     raw value
 */
export function from<
    T extends NewType
>(value: T): T["value"] {
    return value as any as T["value"];
}

/**
 * Lift function to operate on newtype
 * Or apply function to newtype
 * @param value    newtype
 * @param callback function to apply
 * @returns
 */
export function lift<
    T extends NewType
>(value: T, callback: (value: T["value"]) => T["value"]): T {
    return callback(value);
}
