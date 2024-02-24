import * as assert from 'assert';
import * as access from '../common/util/access';

interface SomeType {
    a: number,
    b: string
};

suite('access', () => {
    test('get/set success', () => {
        let x: SomeType = { a: 1, b: 'hello' };
        access.forceSet(x, 'foo', 123);
        const value = access.forceGet(x, 'foo');
        assert.equal(value, 123);
    });

    test('get fail', () => {
        let x: SomeType = { a: 1, b: 'hello' };
        assert.throws(() => access.forceGet(x, 'foo'), ReferenceError);
    });
});
