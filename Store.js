function Bird(name, price) {
    this.name = name;
    this.price = price;
    this.count = 0;
}

Bird.prototype.toString = function () {
    return this.name;
}

function Trade(bird, count, client) {
    this.bird = bird;
    this.count = count;
    this.client = client;
}

Trade.prototype.getAmount = function () {
    return this.bird.price * this.count;
}

function Client(name) {
    this.name = name;
    this.trades = [];
}

Client.prototype.toString = function () {
    return this.name;
}

function Store() {
    var birds = {};
    var clients = {};
    var trades = [];

    this.add = function (bird, count, price) {
        var birdValue = (typeof bird === 'string') ? this.getByName(bird) : bird;
        if (birdValue === undefined) {
            birdValue = new Bird(bird, price);
        }
        if (presentInStore(birdValue)) {
            birds[birdValue.name].count += count;
        } else {
            birds[birdValue.name] = birdValue;
            birdValue.count = count;
        }
        return birdValue;
    }

    this.sell = function (bird, count, client) {
        var birdValue = (typeof bird === 'string') ? this.getByName(bird) : bird;
        if (presentInStore(birdValue)) {
            if (moveToSold(birdValue, count)) {
                var trade = new Trade(birdValue, count, client);
                trades.push(trade);
                processClient(client, trade);
                console.log('Sold ' + count + ' ' + birdValue + ' to ' + client);
            } else {
                console.log('Not enough ' + birdValue + ' available in store: ' + birdValue.count);
            }
        } else {
            console.log('Bird is not available to sell');
        }
        return trade;
    }

    this.changePrice = function (bird, price) {
        var birdValue = (typeof bird === 'string') ? this.getByName(bird) : bird;
        if (birdValue !== undefined && birds.hasOwnProperty(birdValue.name)) {
            birds[birdValue.name].price = price;
        }
    }

    this.getBirds = function () {
        return Object.values(birds);
    }

    this.getClients = function () {
        return Object.values(clients);
    }

    this.getTransactions = function () {
        return trades;
    }

    this.getByName = function (name) {
        return birds[name];
    }

    var getClientByName = function (name) {
        return clients[name];
    }

    var presentInStore = function (bird) {
        if (bird !== undefined) {
            return birds.hasOwnProperty(bird.name);
        }
        return false;
    }

    var moveToSold = function (bird, count) {
        if (birds[bird.name].count < count) {
            return false;
        }
        birds[bird.name].count -= count;
        if (birds[bird.name].count === 0) {
            delete birds[bird.name];
        }
        return true;
    }

    var processClient = function (client, trade) {
        if (client !== undefined) {
            var clientValue = client;
            if (typeof client !== 'object' || !client.hasOwnProperty("trades")) {
                clientValue = getClientByName(client);
                if (clientValue === undefined) {
                    clientValue = new Client(client);
                }
            }
            clientValue.trades.push(trade);
            if (!clients.hasOwnProperty(clientValue.name)) {
                clients[clientValue.name] = clientValue;
            }
        }
    }
}

this.printTotalSoldAmount = function (store) {
    console.log('Sold amounts:');
    var soldByBirdType = {};
    for (var trade of store.getTransactions()) {
        if (soldByBirdType.hasOwnProperty(trade.bird.name)) {

            soldByBirdType[trade.bird.name] += trade.count;
        } else {
            soldByBirdType[trade.bird.name] = trade.count;
        }
    }
    for (var bird of Object.keys(soldByBirdType)) {
        console.log(bird + ' : ' + soldByBirdType[bird]);
    }
}

function printLessThanThree(store) {
    console.log('Birds with less than 3 available:');
    for (var bird of store.getBirds()) {
        if (bird.count < 3) {
            console.log(bird.name + ' : ' + bird.count);
        }
    }
}

function printAvailableBirds(store) {
    console.log('All birds in store:');
    for (var bird of store.getBirds()) {
        console.log(bird.name + ' : ' + bird.count);
    }
}

function printAllClients(store) {
    console.log('All client of the store:');
    for (var client of store.getClients()) {
        var amount = 0;
        for (var trade of client.trades) {
            amount += trade.count;
        }
        console.log(client + ' : bought ' + amount + ' birds');
    }
}
