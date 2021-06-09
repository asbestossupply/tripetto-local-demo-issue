const pkg = require("../../package.json");

module.exports = `${pkg.title} ${
    pkg.version
} - Copyright (C) ${new Date().getFullYear()} Tripetto B.V. - All Rights Reserved`;
