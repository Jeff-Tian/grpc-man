import getTerminalNodes, { traverseServiceClients } from '../../helpers/terminal-node';

describe.skip('terminal-node', () => {
  it('get all service client nodes', () => {
    const testObj = {
      a: {
        b: {
          c: function ServiceClient() {
          },
        },
      },
      b: 'b',
    };

    let terminalNodes = getTerminalNodes(testObj);
    expect(terminalNodes).toStrictEqual([testObj.a.b.c]);

    traverseServiceClients(testObj, (v, key, parent) => {
      parent[key] = 'changed';
    });
    expect(testObj).toStrictEqual({
      a: {
        b: {
          c: 'changed',
        },
      },
      b: 'b',
    });
  });
});
