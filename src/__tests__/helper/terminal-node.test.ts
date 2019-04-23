import getTerminalNodes, { traverseTerminalNodes } from '../../helpers/terminal-node';

describe('terminal-node', () => {
  it('get all terminal nodes', () => {
    const testObj = {
      a: {
        b: {
          c: 'c',
        },
      },
      b: 'b',
    };

    let terminalNodes = getTerminalNodes(testObj);
    expect(terminalNodes).toStrictEqual(['c', 'b']);

    traverseTerminalNodes(testObj, (v, key, parent) => {
      parent[key] = 'changed';
    });
    expect(testObj).toStrictEqual({
      a: {
        b: {
          c: 'changed',
        },
      },
      b: 'changed',
    });
  });
});
