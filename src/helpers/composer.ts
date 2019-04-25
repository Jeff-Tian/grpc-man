export default class Composer {
  public static composeMethod(parent: any, chain: string) {
    const chains = chain.split('.');
    return chains.reduce((prev, current) => prev[current], parent);
  }
}
