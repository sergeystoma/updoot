import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const lpushAsync = promisify(client.lpush).bind(client);
const ltrimAsync = promisify(client.ltrim).bind(client);

/**
 * Gets an item from cache.
 */
export function getItem(name) {
    return getAsync(name);
}

/**
 * Saves an item in cache.
 */
export function setItem(name, value, timeoutSeconds) {
    return setAsync(name, value, 'EX', timeoutSeconds);
}

/**
 * Deletes item from cache.
 */
export function clearItem(name) {
    return delAsync(name);
}

/**
 * Logs a message.
 */
export function log(message) {
    return new Promise((resolve) => {
        let log = message;

        if (message instanceof Error) {
            if (message.stack) {
                log = `${message.toString()} at ${message.stack.toString()}`;
            } else {
                log = message.toString();
            }
        }

        log = `${new Date().toString()}: ${log}`;

        lpushAsync('updoot:logs', log).then(() => {
            ltrimAsync('updoot:logs', 0, 100).then(() => {
                resolve();
            }).catch(() => {
                resolve();
            });
        }).catch(() => {
            resolve();
        });
    });
}