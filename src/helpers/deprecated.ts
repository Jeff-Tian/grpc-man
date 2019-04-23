export default function deprecated(message: string = 'Function {name} is deprecated.') {
  return (instance: any, name: string, descriptor: any) => {
    let original = descriptor.value;
    let localMessage = message.replace('{name}', name);

    descriptor.value = function() {
      console.warn(localMessage);
      return original.apply(this, arguments);
    };

    return descriptor;
  };
}
