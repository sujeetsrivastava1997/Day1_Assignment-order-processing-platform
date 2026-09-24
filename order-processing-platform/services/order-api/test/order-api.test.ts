import request from 'supertest';
import {createApp, Order} from '../src/index';

test('creates an order and publishes it', async()=>{
 const saved:Order[]=[]; const sent:string[]=[];
 const app=createApp({save:async o=>{saved.push(o)},send:async m=>{sent.push(m)}});
 const r=await request(app).post('/orders').send({customerId:'C1',items:[{sku:'S1',quantity:1}],total:10,email:'a@b.com'});
 expect(r.status).toBe(201); expect(saved).toHaveLength(1); expect(sent).toHaveLength(1);
});
test('health endpoint works',async()=>expect((await request(createApp()).get('/health')).body.status).toBe('ok'));
