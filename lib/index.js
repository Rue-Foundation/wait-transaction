'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (web3) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options.maxAttempts = options.maxAttempts || 240;
  options.timeInterval = options.timeInterval || 1000;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      var _web3$eth;

      var callback = function callback(error, tx) {
        var interval = void 0;
        var attempts = 0;

        if (error) {
          reject(error);
          return;
        }

        var makeAttempt = function makeAttempt() {
          web3.eth.getTransaction(tx, function (e, txInfo) {
            // If there's an error ignore it.
            if (e) {
              return;
            }

            if (txInfo.blockHash && txInfo.blockHash) {
              clearInterval(interval);
              resolve(tx);
            }

            if (attempts >= options.maxAttempts) {
              clearInterval(interval);
              reject(new Error('Transaction ' + tx + ' wasn\'t processed in ' + attempts + ' attempts!'));
            }

            attempts++;
          });
        };

        interval = setInterval(makeAttempt, options.timeInterval);
        makeAttempt();
      };

      (_web3$eth = web3.eth).sendTransaction.apply(_web3$eth, [].concat(args, [callback]));
    });
  };
};