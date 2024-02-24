/**
 * Force store any field in object regardless of the type
 * Type-Script bypass
 */
export function forceSet<C, V>(object: C, name: string, value: V) {
    let obj = object as Record<string, V>;
    obj[name] = value;
}

/**
 * Force get any field from object regardless of the type
 * If there is no such field, exception is thrown.
 * Type-script bypass
 */
export function forceGet<C, V>(object: C, name: string): V {
    let obj = object as Record<string, V>;
    let value = obj[name];
    if (value === undefined) {
        throw new ReferenceError(`Reference to undefined property "${name}"`);
    }
    return value;
}
