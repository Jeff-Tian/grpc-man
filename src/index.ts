import { Greeter } from './Greeter';

const [exe, exeFilePath, endpoint, protoFilePath] = process.argv;

Greeter(exe, exeFilePath, endpoint, protoFilePath);
