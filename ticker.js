var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var Ticker = function() {
	console.log('Ticker function init');
};

util.inherits(Ticker, EventEmitter);

var ticker = new Ticker();

ticker.on('tick', function() {	
	console.log('TICK');
});

//Emitting an event every 1 second
ticker.on('tickBySecond', function() {	
	console.log('tick by second...');
	setInterval(function(){
		ticker.emit('tick');
	}, 1000);
});

ticker.emit('tickBySecond');


module.exports = Ticker;

