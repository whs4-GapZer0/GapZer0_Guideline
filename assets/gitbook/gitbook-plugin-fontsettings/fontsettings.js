require(['gitbook', 'jquery'], function (gitbook, $) {
    var night = false;
    try { night = localStorage.getItem('gapzer0.display.night') === 'true'; } catch (_) {}
    function apply() {
        $('.book').removeClass('color-theme-0 color-theme-1 color-theme-2').addClass(night ? 'color-theme-2' : 'color-theme-0');
        $('.night-mode-toggle').attr({'aria-label': night ? '주간 모드로 전환' : '야간 모드로 전환', 'title': night ? '주간 모드로 전환' : '야간 모드로 전환', 'aria-pressed': String(night)});
        $('.night-mode-toggle .fa').removeClass('fa-sun-o fa-moon-o').addClass(night ? 'fa-moon-o' : 'fa-sun-o');
    }
    gitbook.events.bind('start', function () {
        gitbook.toolbar.createButton({
            icon: 'fa fa-sun-o', label: '야간 모드로 전환', className: 'night-mode-toggle',
            onClick: function (e) {
                e.preventDefault();
                night = !night;
                try { localStorage.setItem('gapzer0.display.night', String(night)); } catch (_) {}
                apply();
            }
        });
        apply();
    });
    gitbook.events.bind('page.change', apply);
});
