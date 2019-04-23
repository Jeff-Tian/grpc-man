export function traverseTerminalNodes(
  obj: any,
  traverseAction: (currentValue: any, key: string, parent: any) => void,
  maxDepth = 100,
) {
  if (maxDepth <= 0) {
    throw new Error('层级太深了！');
  }

  Object.keys(obj).forEach(value => {
    if (typeof obj[value] !== 'object') {
      traverseAction(obj[value], value, obj);
    } else {
      traverseTerminalNodes(obj[value], traverseAction, maxDepth - 1);
    }
  });
}

export default function getTerminalNodes(obj: Object) {
  const res: any[] = [];
  traverseTerminalNodes(obj, v => res.push(v));
  return res;
}
