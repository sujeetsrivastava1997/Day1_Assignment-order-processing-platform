import {formatNotification} from '../src/index';
test('formats notification',()=>expect(formatNotification({orderId:'o1',email:'a@b.com',message:'processed'})).toContain('a@b.com'));
