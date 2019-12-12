export function traverseServiceClients(
  obj: any,
  traverseAction: (currentValue: any, key: string, parent: any) => void,
  maxDepth = 100,
) {
  if (maxDepth <= 0) {
    throw new Error('层级太深了！');
  }

  Object.keys(obj).forEach(value => {
    if (typeof obj[value] === 'object' && (!obj[value].format || (obj[value].format !== 'Protocol Buffer 3 DescriptorProto'))) {
      traverseServiceClients(obj[value], traverseAction, maxDepth - 1);
    } else if (typeof obj[value] === 'function' && obj[value].toString().startsWith('function ServiceClient')) {
      traverseAction(obj[value], value, obj);
    }
  });
}

export default function getTerminalNodes(obj: object) {
  const res: any[] = [];
  traverseServiceClients(obj, v => res.push(v));
  return res;
}
