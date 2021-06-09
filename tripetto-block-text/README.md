# <a href="https://tripetto.com/"><img src="https://unpkg.com/tripetto/assets/banner.svg" alt="Tripetto"></a>

Tripetto is a full-fledged form kit. Rapidly build and run smart flowing forms and surveys. Drop the kit in your codebase and use all of it or just the parts you need. The visual [**builder**](https://www.npmjs.com/package/tripetto) is for form building, and the [**runners**](https://www.npmjs.com/package/tripetto-runner-foundation) are for running those forms in different UI variants. It is entirely extendible and customizable. Anyone can build their own building [**blocks**](https://docs.tripetto.com/guide/blocks) (e.g., question types) or runner UI's.

# Text block
[![Status](https://gitlab.com/tripetto/blocks/text/badges/master/pipeline.svg)](https://gitlab.com/tripetto/blocks/text/commits/master)
[![Version](https://img.shields.io/npm/v/tripetto-block-text.svg)](https://www.npmjs.com/package/tripetto-block-text)
[![License](https://img.shields.io/npm/l/tripetto-block-text.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/tripetto-block-text.svg)](https://www.npmjs.com/package/tripetto-block-text)
[![Follow us on Twitter](https://img.shields.io/twitter/follow/tripetto.svg?style=social&label=Follow)](https://twitter.com/tripetto)

Text block for Tripetto. Besides the block for the builder, this package includes a base class with the validation/condition logic of this block for use in the runners.

[![Try the demo](https://unpkg.com/tripetto/assets/button-demo.svg)](https://codepen.io/tripetto/debug/eMPLwv)
[![View the code](https://unpkg.com/tripetto/assets/button-codepen.svg)](https://codepen.io/tripetto/pen/eMPLwv)

# Get started
You need to install or import this block to use it in Tripetto. If you are using the CLI version of the builder, you can find instructions [here](https://docs.tripetto.com/guide/builder/#cli-configuration). If you are embedding the builder into your own project using the library, take a look [here](https://docs.tripetto.com/guide/builder/#library-blocks).

# Use cases
- Directly in your browser (add `<script src="https://unpkg.com/tripetto-block-text"></script>` to your HTML);
- In the CLI builder (install the block using `npm i tripetto-block-text -g` and update your Tripetto [config](https://docs.tripetto.com/guide/builder/#cli-configuration));
- In your builder implementation (just add `import "tripetto-block-text";` to your code);
- In your runner implementation (simply add `import { Text } from "tripetto-block-text/runner";` to your code to import the base class with the validation/condition logic of this block for use in the runner).

# Support
Run into issues or bugs? Report them [here](https://gitlab.com/tripetto/blocks/text/issues) and we'll look into them.

For general support contact us at [support@tripetto.com](mailto:support@tripetto.com). We're more than happy to assist you.

# License
Have a blast. [MIT](https://opensource.org/licenses/MIT).

# Contributors
- [Hisam A Fahri](https://gitlab.com/hisamafahri) (Indonesian translation)

# About us
If you want to learn more about Tripetto or contribute in any way, visit us at [Tripetto.com](https://tripetto.com/).
