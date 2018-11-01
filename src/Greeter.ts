export const Greeter = (exe: string, exeFilePath: string, endpoint: string, protoFilePath: string) => {
  return `You started ${exeFilePath} by ${exe}, and it will start a gRPC client connecting to ${endpoint} and load the proto file from ${protoFilePath}`;
};
