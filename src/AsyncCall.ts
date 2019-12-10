export default (asyncWithClassicalCallback: (...argsWithCallbackInTheLast: any) => void, context: any) => {
  return async (...args: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      asyncWithClassicalCallback.call(context, ...args, (err: any, result: any) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    });
  };
};

export function asyncCall(asyncWithDumpCallback: (callback: () => void) => void, context: any): () => void {
  return async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      asyncWithDumpCallback.call(context, () => {
        resolve();
      });
    });
  };
}

export function asyncCallResultHandler(
  asyncWithResultCallback: (question: string, callback: (answer: string) => void) => void,
  context: any,
): (question: string) => Promise<string> {
  return async (question: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      asyncWithResultCallback.call(context, question, (res: any) => {
        resolve(res);

        context.close();
      });
    });
  };
}
