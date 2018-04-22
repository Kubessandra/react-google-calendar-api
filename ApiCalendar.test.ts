declare var test: any;

import ApiCalendar from './ApiCalendar';

test('setCalendar method', () => {
    ApiCalendar.setCalendar('test');
    expect(ApiCalendar.calendar).toBe('test');
});