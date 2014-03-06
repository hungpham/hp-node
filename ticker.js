var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var Ticker = function() {
	console.log('Ticker function init');
	this.timerInterval = 0;
	//TICK Stop after n times
	this.limit = Math.ceil(Math.random() * 10);
	this.count = 0;
};

util.inherits(Ticker, EventEmitter);



Ticker.prototype.tick = function() {
	var self = this;
	self.count++;
	console.log('TICK: ' + self.count);
	self.emit('tick', self.count);
};

Ticker.prototype.tickStop = function() {		
	console.log('TICK stop at: ' + this.limit);		
	clearInterval(this.timerInterval);
};

//Emitting an event every 1 second
Ticker.prototype.tickBySecond = function() {
	var self = this;
	console.log('tick by second...');
	this.timerInterval = setInterval(function(){
		self.tick();
	}, 1000);
};

module.exports = Ticker;

