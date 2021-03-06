'use strict';

module.exports = {
    name: 'spaceAroundComma',
    nodeTypes: ['arguments', 'parentheses'],
    message: 'Commas should%s be %s by %s space.',

    lint: function spaceAroundCommaLinter (config, node) {
        var results = [];
        var sprintf = require('sprintf-js').sprintf;
        var self = this;

        node.forEach('operator', function (element, index) {
            var startElement;
            var message;
            var nextElement;
            var prevElement;

            if (element.content !== ',') {
                return;
            }

            nextElement = node.content[index + 1];
            prevElement = node.content[index - 1];

            // setting `startElement` equal to nextElement as the default for
            // `style`is `after`
            startElement = nextElement;

            switch (config.style) {
                case 'after':
                    if (nextElement.type !== 'space' || nextElement.content !== ' ') {
                        message = sprintf(self.message, '', 'followed', 'one');
                    }
                    break;

                case 'before':
                    if (prevElement.type !== 'space' || prevElement.content !== ' ') {
                        startElement = prevElement;
                        message = sprintf(self.message, '', 'preceded', 'one');
                    }
                    break;

                case 'both':
                    if (nextElement.type !== 'space' || nextElement.content !== ' ' || !/^\s/.test(nextElement.content) ||
                       (prevElement.type !== 'space' || prevElement.content !== ' ') || !/\s$/.test(prevElement.content)) {

                        startElement = !/\s$/.test(prevElement.content) ? prevElement : nextElement;
                        message = sprintf(self.message, '', 'preceded and followed', 'one');
                    }
                    break;

                case 'none':
                    if (nextElement.type === 'space' || prevElement.type === 'space') {
                        startElement = prevElement.type === 'space' ? prevElement : nextElement;
                        message = sprintf(self.message, ' not', 'preceded nor followed', 'any');
                    }
                    break;

                default:
                    throw new Error(
                        'Invalid setting value for spaceAfterComma: ' + config.style
                    );
            }

            if (message) {
                results.push({
                    column: startElement.start.column,
                    line: startElement.start.line,
                    message: message
                });
            }
        });

        if (results.length) {
            return results;
        }
    }
};
