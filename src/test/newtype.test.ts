import * as assert from 'assert';
import * as newtype from '../common/util/newtype';

type Foo = {
    value: number,
    readonly __tag: unique symbol;
};

type Bar = {
    value: number,
    readonly __tag: unique symbol;
};

function f1(x: Foo) {

}

suite('newtype', () => {
    test('to/from', () => {
        const foo = newtype.to<Foo>(4);
        f1(foo); // newtype can be passed
        const raw: number = newtype.from(foo);
        assert.equal(raw, 4);
    });

    test('lift', () => {
        let foo = newtype.to<Foo>(4);
        foo = newtype.lift(foo, x => x * 2);
        const raw: number = newtype.from(foo);
        assert.equal(raw, 8);
    });
});
