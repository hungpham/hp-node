var Ticker = require('./ticker.js');
var ticker = new Ticker();

ticker.on('tick', function(count) {
	if(count >= this.limit) {
		this.tickStop();
	}
});

ticker.tickBySecond();
