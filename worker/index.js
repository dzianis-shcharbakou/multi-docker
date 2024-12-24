const keys = require('./keys');
const { createClient } = require('redis');
 
const redisClient = createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
  retry_strategy: () => 1000,
});
 
const sub = redisClient.duplicate();
 
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}
 
(async () => {
  await redisClient.connect().catch(console.error);;
  await sub.connect();
 
  sub.subscribe('insert', (message) => {
    redisClient.hSet('values', message, fib(parseInt(message)));
  });
})();