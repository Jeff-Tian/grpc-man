export default class Composer {
  static composeMethod(parent: any, chain: string) {
    const chains = chain.split('.');

    let current = parent;
    for (let i = 0; i < chains.length; i++) {
      current = current[chains[i]];
    }

    return current;
  }
}
