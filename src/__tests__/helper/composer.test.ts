import Composer from '../../helpers/composer';

describe.skip('composer', () => {
  it('compose method', () => {
    const obj = {
      parent: {
        child: {
          method: () => 'hello',
        },
      },
    };

    const method = Composer.composeMethod(obj, 'parent.child.method');
    expect(method()).toEqual('hello');
  });
});
