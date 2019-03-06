# Q Isotype [![Build Status](https://travis-ci.com/nzzdev/Q-isotype.svg?token=g43MZxbtUcZ6QyxqUoJM&branch=dev)](https://travis-ci.com/nzzdev/Q-isotype) [![Greenkeeper badge](https://badges.greenkeeper.io/nzzdev/Q-isotype.svg?token=36bc6ddc1d30783a27da6e8cb5dba3acf833e860036df64acd816ec8300eabff&ts=1551342842727)](https://greenkeeper.io/)

[![Greenkeeper badge](https://badges.greenkeeper.io/nzzdev/Q-isotype.svg?token=36bc6ddc1d30783a27da6e8cb5dba3acf833e860036df64acd816ec8300eabff&ts=1551342842727)](https://greenkeeper.io/)

**Maintainer**: [manuelroth](https://github.com/manuelroth)

Q Isotype is one tool of the Q toolbox. Test it in the [playground](https://q-playground.st.nzz.ch/).

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Functionality](#functionality)
- [License](#license)

## Installation

```bash
git clone git@github.com:nzzdev/Q-isotype.git
cd ./Q-isotype
nvm use
npm install
npm run build
```

[to the top](#table-of-contents)

## Configuration

There is one env variable `IMAGE_SERVICE_URL` to be defined. It should contain a URL with 3 parameters that will get replaced before the URL is used to load the images.
`{key}` will be replaced by the string Q-server stored as the key when the file got uploaded through Q-servers `/file` endpoint provided by the [file plugin](https://github.com/nzzdev/Q-server/blob/dev/plugins/file/index.js)
`{width}` is replaced by the width the image should be loaded
`{format}` will be `png` or `webp` (a `picture` element is used in the HTML with multiple `source` elements)
Example: `https://q-images.nzz.ch/{key}?width={width}&format={format}`

[to the top](#table-of-contents)

## Development

Start the Q dev server:

```
npx @nzz/q-cli server
```

To run the tool create a new file called dev.js and use the env-variable listed above with the local urls.

```
process.env.IMAGE_SERVICE_URL = "https://q-images.nzz.ch/{key}?width=108&format=png&auto=webp";
require('./index.js');
```

You can then start the tool with:

```
node dev.js
```

[to the top](#table-of-contents)

## Testing

The testing framework used in this repository is [Code](https://github.com/hapijs/code).

Run the tests:

```
npm run test
```

### Implementing a new test

When changing or implementing...

- A `route`, it needs to be tested in the `e2e-tests.js` file
- Something on the frontend, it needs to be tested in the `dom-tests.js` file

[to the top](#table-of-contents)

## Deployment

We provide automatically built [docker images](https://hub.docker.com/r/nzzonline/q-isotype/).
There are three options for deployment:

- Use the provided images
- Build your own docker images
- Deploy the service using another technology

### Use the provided docker images

1. Deploy `nzzonline/q-isotype` to a docker environment
2. Set the ENV variables as described in the [configuration section](#configuration)

[to the top](#table-of-contents)

## Functionality

If a tool then it can use this reference to the Q-server documentation about Q-tools:

The tool structure follows the general structure of each Q tool. Further information can be found in [Q server documentation - Developing tools](https://nzzdev.github.io/Q-server/developing-tools.html).

Q Isotype uses the [svelte framework](https://svelte.technology/guide) to render the markup on server-side.

[to the top](#table-of-contents)

### Features

#### SVG reference

For displaying the `svg`s, we're using the [svg reference feature](https://css-tricks.com/svg-use-with-external-reference-take-2/).

##### Implementation details

- The reference is set in the [legend](https://github.com/nzzdev/Q-isotype/blob/dev/views/legend.html#L10-L12)
- In the list the used `svg` simply has to be referenced as following:

```
<svg>
  <use xlink:href="#{{ item.icons[loop.index0].key }}"></use>
</svg>
```

[to the top](#table-of-contents)

### Options

#### hideLegend

- This option allows to hide the header of each column. By default it's `false`.
- If the option is used, the [legend won't be rendered](https://github.com/nzzdev/Q-isotype/blob/dev/views/legend.html#L2)

#### iconsOneRow

- This option allows all icons to be next to each other. By default it's `false`.
- If the option is used, [everything will be rendered in the same div](https://github.com/nzzdev/Q-isotype/blob/dev/views/isotype.html#L7-L36)

#### highlightColumn

- This option allows the user to select a column and shows the other columns in a lower `opacity`.
- The option will be available if there are more than `2` columns
- When selecting a column, the class `q-isotype-lowlight` will be assinged to all other columns
- When selecting a column and the option `Show different icons next to each other` is selected, the class `q-isotype-lowlight` will be assinged to every `svg`.

#### Display options

Display options can be set before embedding the graphic in the article.

##### hideTitle

Allows to hide the title

[to the top](#table-of-contents)
