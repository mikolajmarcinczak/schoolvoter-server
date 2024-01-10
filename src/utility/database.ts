import {createClient} from "redis";
import * as process from "process";

const host = process.env.REDIS_HOST || 'localhost'
const port = parseInt(process.env.REDIS_PORT as string) || 6379

const client = createClient({
  password: 'rY18VOW7VZOzTin5UwIQ40s4ICzox3F4',
  socket: {
    host: 'redis-19034.c55.eu-central-1-1.ec2.cloud.redislabs.com',
    port: 19034
  }
});
client.on('error', (err: any) => {
  console.error(`Redis Error: ${err}`);
});
client.on('connect', function() {
  console.log('Connected to redis instance');
});

export default client;