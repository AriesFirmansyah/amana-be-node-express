import buffer from "buffer";
if (!(buffer as any).SlowBuffer) {
  (buffer as any).SlowBuffer = buffer.Buffer;
}
if (!(global as any).SlowBuffer) {
  (global as any).SlowBuffer = buffer.Buffer;
}
