// GitBook replaces .book during menu/history navigation. Module script tags in
// the injected page are not re-executed, so initialize through its lifecycle.
(function () {
    var moduleUrl = new URL('../assessment/app.mjs', document.currentScript.src).href;
    function initializeAssessment() {
        var root = document.getElementById('assessment-app');
        if (!root) return;
        import(moduleUrl).then(function (app) { app.boot(); }).catch(function () {
            if (root.isConnected) root.textContent = '자가 진단 화면을 불러오지 못했습니다. 새로고침 후 다시 시도하세요.';
        });
    }
    window.gitbook.events.on('page.change', initializeAssessment);
    initializeAssessment();
}());
