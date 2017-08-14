"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Noty = require('noty');
var MessageDialogHelpers = (function () {
    function MessageDialogHelpers() {
    }
    MessageDialogHelpers.prototype.error = function (msg, timeout, position) {
        if (position === void 0) { position = 'topCenter'; }
        var options = {
            text: msg,
            type: 'error',
            layout: position,
            animation: {
                open: 'animated fadeInDown',
                close: 'animated fadeOutUp'
            }
        };
        if (timeout !== null) {
            options.timeout = timeout;
        }
        new Noty(options).show();
    };
    MessageDialogHelpers.prototype.success = function (msg, timeout, position) {
        if (position === void 0) { position = 'topCenter'; }
        var options = {
            text: msg,
            type: 'success',
            layout: position,
            animation: {
                open: 'animated fadeInDown',
                close: 'animated fadeOutUp'
            }
        };
        if (timeout !== null) {
            options.timeout = timeout;
        }
        new Noty(options).show();
    };
    MessageDialogHelpers.prototype.confirm = function (msg, callback) {
        var n = new Noty({
            text: msg,
            type: 'alert',
            layout: 'center',
            modal: true,
            animation: {
                open: 'animated fadeInDown',
                close: 'animated fadeOutUp'
            },
            buttons: [
                Noty.button('Yes, please', 'btn btn-success m-r-10', function () {
                    callback();
                    n.close();
                }),
                Noty.button('No', 'btn btn-default', function () {
                    n.close();
                })
            ]
        }).show();
    };
    return MessageDialogHelpers;
}());
exports.MessageDialogHelpers = MessageDialogHelpers;
