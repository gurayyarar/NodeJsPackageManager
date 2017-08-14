"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatusHelpers = (function () {
    function StatusHelpers() {
    }
    StatusHelpers.prototype.setText = function (newText) {
        $('#status_text').html(newText);
    };
    StatusHelpers.prototype.setTextForPackageProcess = function (packageName, command, statu) {
        packageName = packageName.indexOf('||') !== -1 ? packageName.split('||')[0] : packageName;
        if (statu === 'start') {
            var processStartingText = 'installing';
            if (command === 'update')
                processStartingText = 'updating';
            if (command === 'downgrade')
                processStartingText = 'downgrading';
            if (command === 'uninstall')
                processStartingText = 'uninstalling';
            this.setText("<b>" + packageName + "</b> " + processStartingText + "...");
        }
        else {
            var processEndText = 'installed';
            if (command === 'update')
                processEndText = 'updated';
            if (command === 'downgrade')
                processEndText = 'downgraded';
            if (command === 'uninstall')
                processEndText = 'uninstalled';
            this.setText("<b>" + packageName + "</b> " + processEndText);
        }
    };
    StatusHelpers.prototype.getText = function () {
        $('#status_text').text();
    };
    StatusHelpers.prototype.getTextAsHtml = function () {
        $('#status_text').html();
    };
    StatusHelpers.prototype.reset = function () {
        $('#status_text').html('');
    };
    return StatusHelpers;
}());
exports.StatusHelpers = StatusHelpers;
