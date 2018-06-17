<div align="center">
  <img src="https://raw.githubusercontent.com/GetRayo/Assets/master/Images/Cover.png" alt="Rayo" /><br />

[![Codacy](https://api.codacy.com/project/badge/Grade/d392c578eaaa4860823b8e4f9dadda63)](https://www.codacy.com/app/aichholzer/rayo.js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=GetRayo/rayo.js&amp;utm_campaign=Badge_Grade)
[![CodeFactor](https://www.codefactor.io/repository/github/getrayo/rayo.js/badge)](https://www.codefactor.io/repository/github/getrayo/rayo.js)
[![Coverage Status](https://coveralls.io/repos/github/GetRayo/rayo.js/badge.svg?branch=master)](https://coveralls.io/github/GetRayo/rayo.js?branch=master)
[![Build status](https://travis-ci.org/GetRayo/rayo.js.svg?branch=master)](https://travis-ci.org/GetRayo/rayo.js)
[![Greenkeeper badge](https://badges.greenkeeper.io/GetRayo/rayo.js.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/GetRayo/rayo.js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/GetRayo/rayo.js?targetFile=package.json)
</div>

Node.js clustering done right. This module is what makes `rayo.js` be as fast as it is. It is generally compatible with any Node.js application.

## Install

```
$> npm i @rayo/storm
```


## Use

```js
const storm = require('@rayo/storm');

const yourAwesomeFunction = (workerId) => {
  console.log(`Hello, I am worker ${workerId}`);
};

storm(yourAwesomeFunction);
```


## API

#### storm(boot [, options = {}])
```
@param   {function} Called when starting a worker process.
@param   {object}   [options]
@returns {boolean}
```

- `options.workers` _{number}_
  - Number of workers to start.
  - `Default:` Number of available [CPU cores](https://nodejs.org/api/os.html#os_os_cpus).

- `options.boot` _{function}_
  - Called when starting a worker process.
  - If this is provided it will override the first argument passed into `storm`.

- `options.onMaster` _{function}_
  - Called when starting the master process.
  - This will only be called once.


## License

[MIT](https://github.com/GetRayo/rayo.js/blob/master/LICENSE)
