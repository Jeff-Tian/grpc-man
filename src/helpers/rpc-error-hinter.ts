export default class RpcErrorHinter {
  public static hint(method: string, err: any) {
    console.error(`error for calling ${method}: `, err);

    if (err.details && err.details.startsWith('RPC method not implemented')) {
      console.error(
        `请检查服务器端是否定义了这个方法？如果已定义，那么这通常是由于 proto 文件里定义的 service 与 rpc 方法并没有对应的源码实现。你也可以检查对应于 proto 文件里定义的 service 或者 rpc 方法的地方，有没有拼写错误。`,
      );
    }
  }
}
