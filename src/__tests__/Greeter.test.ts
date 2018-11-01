import { Greeter } from '../Greeter';

test('My Greeter', () => {
  expect(Greeter('node', '.', 'localhost:8081', '.')).toBe('You started . by node, and it will start a gRPC client connecting to localhost:8081 and load the proto file from .');
});
