export class StatusHelpers {
    setText(newText: string) {
        $('#status_text').html(newText);
    }

    setTextForPackageProcess(packageName: string, command: string, statu: string) {
        packageName = packageName.indexOf('||') !== -1 ? packageName.split('||')[0] : packageName;

        if (statu === 'start') {
            let processStartingText: string = 'installing';
            if (command === 'update') processStartingText = 'updating';
            if (command === 'downgrade') processStartingText = 'downgrading';
            if (command === 'uninstall') processStartingText = 'uninstalling';

            this.setText(`<b>${packageName}</b> ${processStartingText}...`);
        } else {
            let processEndText: string = 'installed';
            if (command === 'update') processEndText = 'updated';
            if (command === 'downgrade') processEndText = 'downgraded';
            if (command === 'uninstall') processEndText = 'uninstalled';

            this.setText(`<b>${packageName}</b> ${processEndText}`);
            //setTimeout(() => { this.reset(); }, 3200);
        }
    }

    getText() {
        $('#status_text').text();
    }

    getTextAsHtml() {
        $('#status_text').html();
    }

    reset() {
        $('#status_text').html('');
    }
}