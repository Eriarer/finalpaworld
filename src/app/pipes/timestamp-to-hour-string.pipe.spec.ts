import { TimestampToHourStringPipe } from './timestamp-to-hour-string.pipe';

describe('TimestampToHourStringPipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampToHourStringPipe();
    expect(pipe).toBeTruthy();
  });
});
