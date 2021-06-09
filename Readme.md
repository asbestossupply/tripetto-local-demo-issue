# What is this?

This demonstrates an issue I'm having with Tripetto whereby local blocks are not showing up in the builder.

The `/app` directory contains a simple React app that embeds the Tripetto builder with a single block, the text block.

The `/tripetto-block-text` directory contains a copy of the `tripetto-block-text` code straight from gitlab (to create this directory I merely cloned https://gitlab.com/tripetto/blocks/text.git and then deleted the `.git` directory).

# How to use

Here is how to use this repository:

## The happy path

Run `> ./run_happy` to easily run the happy path.

This script does the following:
1. adds the `tripetto-block-text` from the npm repository into the `/app` folder
2. runs `yarn start` inside `/app` to start the react app (on port 3000)

## The sad path

Run `> ./run_sad` to easily run the sad path.

This script does the following:

1. builds the `/tripetto-block-text` directory by running `npm install` and `npm run make` inside the `/tripetto-block-text` directory
2. removes the npm version of `tripetto-block-text` package from the `/app` directory by running `yarn remove tripetto-block-text` inside the `/app` directory
3. adds the local version of `tripetto-block-text` by running `yarn add file:../tripetto-block-text` from the `/app` directory
5. runs `yarn start` inside the `/app` directory to start the react app (on port 3000)

# The error

When importing `tripetto-block-text` from the npm repository everything works fine. But when running from the local folder the block doesn't show up!

WHY?!