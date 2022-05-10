const WebSocket = require('ws');
const events = require('events');

/**
 * @name Client
 * @description Client class for the bot
 */
class Client extends events {
    constructor() {
        super();
        this.ws = new WebSocket('wss://gateway.discord.gg/?encoding=json&v=9');
        this.ws.on('message', (data) => {
            const payload = JSON.parse(data.toString('utf8'));
            const { t, event, op, d } = payload;

            switch (op) {
                case 10: {
                    const { heartbeat_interval } = d;
                    setInterval(() => {
                        this.ws.send(JSON.stringify({
                            op: 1,
                            d: null
                        }));
                    }, heartbeat_interval);

                    break;
                };
            };
            switch (t) {
                case 'READY': {
                    Object.keys(d).forEach((key) => {
                        this[key] = d[key];
                    });
                    this.emit('ready');
                    break;
                };
                case 'MESSAGE_CREATE': {
                    this.emit('messageCreate', d);
                    break;
                };
            };
        });
    };
    /**
     * @description Login to the bot
     * @param {String} token Bot or User account token
     */
    login(token) {
        this.token = token;
        this.ws.on('open', () => {
            this.ws.send(JSON.stringify({
                op: 2,
                d: {
                    token: this.token,
                    properties: {
                        $os: 'windows',
                        $browser: 'chrome',
                        $device: 'pc'
                    }
                }
            }));
        });
    };
};

module.exports = Client;