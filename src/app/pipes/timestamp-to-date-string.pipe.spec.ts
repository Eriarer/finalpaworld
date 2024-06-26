import { TimestampToDateStringPipe } from './timestamp-to-date-string.pipe';

describe('TimestampToDateStringPipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampToDateStringPipe();
    expect(pipe).toBeTruthy();
  });
});
