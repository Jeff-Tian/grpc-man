export default (asyncWithCallback: (callback: (err: any, result: any) => void) => void, context: any) => {
  return async (...args: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      asyncWithCallback.call(context, ...args, (err: any, result: any) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    });
  };
}

export function asyncCall(asyncWithCallback: (callback: () => void) => void, context: any): () => void {
  return async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      asyncWithCallback.call(context, () => {
        resolve();
      });
    });
  };
}
