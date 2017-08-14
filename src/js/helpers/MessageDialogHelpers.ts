const Noty = require('noty');

export class MessageDialogHelpers {
    error(msg: string, timeout?: number, position: string = 'topCenter') {
        let options = {
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
    }

    success(msg: string, timeout?: number, position: string = 'topCenter') {
        let options = {
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
    }

    confirm(msg: string, callback: any) {
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
                Noty.button('Yes, please', 'btn btn-success m-r-10', () => {
                    callback();
                    n.close();
                }),

                Noty.button('No', 'btn btn-default', () => {
                    n.close();
                })
            ]
        }).show();
    }
}