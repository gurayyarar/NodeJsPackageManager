export class WindowHelpers {
    setPackageDetailContentHeight() {
        this.getPackageDetailContentHeight();

        window.addEventListener('resize', (e) => {
            e.preventDefault();
            this.getPackageDetailContentHeight();
        });

        $.each($('.package-detail-container .tab-content .tab-pane'), (i: number, value: any) => {
            this.initScrollToTop(value);
        })
    }

    initScrollToTop(element: any) {
        let $el: any = $(element);
        let $scrollTop: any;

        if ($el.find('.scroll-to-top').length === 0) {
            $scrollTop = $('<a href="javascript:void(0);" class="scroll-to-top" title="Scroll To Top"><i class="fa fa-arrow-up"></i></a>');
            $scrollTop.hide();
            $el.append($scrollTop);
        }

        $('.package-detail-container .tab-content .tab-pane').on('click', '.scroll-to-top', () => {
            if ($el.hasClass('active')) $el.animate({ scrollTop: 0 }, 'slow');
        });

        $el.scroll(() => {
            if ($el.scrollTop() > 240) { $el.find('.scroll-to-top').fadeIn(); } else { $el.find('.scroll-to-top').fadeOut(); }
        });
    }

    private getPackageDetailContentHeight() {
        const height: number = $('body').height() - ($('.package-detail-container .header').innerHeight() + $('footer').innerHeight() + $('.package-detail-container .nav-tabs').innerHeight()) - 31;
        $('.package-detail-info-container .tab-content .tab-pane').height(height);
    }
}