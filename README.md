# Q Isotype [![Build Status](https://travis-ci.com/nzzdev/Q-isotype.svg?token=g43MZxbtUcZ6QyxqUoJM&branch=dev)](https://travis-ci.com/nzzdev/Q-isotype) [![Greenkeeper badge](https://badges.greenkeeper.io/nzzdev/Q-isotype.svg?token=36bc6ddc1d30783a27da6e8cb5dba3acf833e860036df64acd816ec8300eabff&ts=1551342842727)](https://greenkeeper.io/)

**Maintainer**: [manuelroth](https://github.com/manuelroth)

Q Isotype is one tool of the Q toolbox. Test it in the [demo](https://editor.q.tools). 

## Table of contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Features](#features)
- [Options](#options)
- [License](#license)

## Installation
```bash
$ git clone git@github.com:nzzdev/Q-isotype.git
$ npm install
$ npm run build
```

[to the top](#table-of-contents)

## Configuration

The following environment variables must be specified when starting the tool:
- `IMAGE_SERVICE_URL`
Please have a look at the test environment for examples on what this variables should look like.

[to the top](#table-of-contents)

## Development
Install the Q cli and start the Q dev server:
```
$ Q server
``` 

To run the tool create a new file called dev.js and use the env-variable listed above with the local urls.
```
process.env.IMAGE_SERVICE_URL = "https://q-images.nzz.ch/{key}?width=108&format=png&auto=webp";
require('./index.js');
```
You can then start the tool with:
```
$ node dev.js
``` 

[to the top](#table-of-contents)

## Testing 
The testing framework used in this repository is [Code](https://github.com/hapijs/code).

Run the tests:
```
$ npm run test
```

### Implementing a new test
Rules of when and where to implement a new test

[to the top](#table-of-contents)

##  Tool implentation details
If a tool then it can use this reference to the Q-server documentation about Q-tools:

The tool structure follows the general structure of each Q tool. Further information can be found in [Q server documentation - Developing tools](https://nzzdev.github.io/Q-server/developing-tools.html).

[to the top](#table-of-contents)

## Features
Here are all features listed which will have an impact on the tool but are not options. For example spacing issues. If there's a visual aspect, a printscreen would be nice. 
The printscreen can be implemented as following: 
<img src="/doc/card-layout.png" align="right" width=300 height=355>

[to the top](#table-of-contents)

## Options
All options should be listed and explained. The varieties should be listed. If there's a visual aspect, a printscreen would be nice.
The printscreen can be implemented as following: 
<img src="/doc/card-layout.png" align="right" width=300 height=355>

[to the top](#table-of-contents)

## LICENSE
Adding the license + updating the year. 

## Installation



## Development

Install the [Q cli](https://github.com/nzzdev/Q-cli) and start the Q dev server:

```
$ Q server
```

Run the Q tool:
```
$ node index.js
```

## Implementation details
The tool structure follows the general structure of each Q tool. Further information can be found in [Q server documentation - Developing tools](https://nzzdev.github.io/Q-server/developing-tools.html).

## License
Copyright (c) 2018 Neue Zürcher Zeitung. All rights reserved.

This software is published under the MIT license.