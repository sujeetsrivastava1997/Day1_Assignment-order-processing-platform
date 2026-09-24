import {processOrder} from '../src/index';
test('maps an order to a notification',()=>{const r=processOrder({id:'o1',email:'a@b.com',customerId:'c1',total:20});expect(r).toMatchObject({orderId:'o1',email:'a@b.com'});expect(r.message).toContain('o1')});
