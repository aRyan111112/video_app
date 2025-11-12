import { createClient } from 'redis';

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect().then(() => {console.log("connected to redis")});

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

export {client};