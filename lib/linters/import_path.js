'use strict';

var helpers = require('../helpers');

module.exports = {
    name: 'importPath',
    nodeTypes: ['atrule'],
    message: {
        extension: 'Imported file, "%s" should%s include the file extension.',
        underscore: 'Imported file, "%s" should%s include a leading underscore.'
    },

    lint: function importPathLinter (config, node) {
        var path = require('path');
        var filename = path.basename(config.path);
        var results = [];
        var excludes;
        var value;
        var file;
        var sprintf = require('sprintf-js').sprintf;

        if (node.first('atkeyword').first('ident').content !== 'import') {
            return null;
        }

        if (node.first('uri')) {
            value = node.first('uri');
            value = value.first('string') || value.first('raw');
        } else {
            value = node.first('string');
        }

        file = value.content.replace(/['"]/g, '');

        // Ignore absolute URLs
        if (helpers.isAbsoluteURL(file)) {
            return null;
        }

        // Check if file is excluded
        if (config.exclude.indexOf(file) !== -1) {
            return null;
        }

        // Check extension
        switch (config.filenameExtension) {
            case false:
                if (path.extname(file)) {
                    results.push({
                        column: value.start.column,
                        line: value.start.line,
                        message: sprintf(this.message.extension, file, ' not')
                    });
                }

                break;
            case true:
                if (!path.extname(file)) {
                    results.push({
                        column: value.start.column,
                        line: value.start.line,
                        message: sprintf(this.message.extension, file, '')
                    });
                }

                break;
        }

        // Check leading underscore
        switch (config.leadingUnderscore) {
            case false:
                if (/^_/.test(file)) {
                    results.push({
                        column: value.start.column,
                        line: value.start.line,
                        message: sprintf(this.message.underscore, file, ' not')
                    });
                }

                break;
            case true:
                if (!/^_/.test(file)) {
                    results.push({
                        column: value.start.column,
                        line: value.start.line,
                        message: sprintf(this.message.underscore, file, '')
                    });
                }

                break;
        }

        if (results.length) {
            return results;
        }
    }
};
