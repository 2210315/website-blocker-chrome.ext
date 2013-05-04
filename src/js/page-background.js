
var afterFunction = null;
var WB = new WebsiteBlocker();

chrome.tabs.onCreated.addListener(function(tab) {
//    console.log('tabs.onCreated:');
//    console.log(tab);

    WB.run(tab);
});

chrome.tabs.onActivated.addListener(function(info) {
//    console.log('tabs.onActivated:');
//    console.log(info);

    chrome.tabs.get(info.tabId, function(tab) {
        WB.run(tab);
    });
});

//chrome.tabs.onAttached.addListener(function(tabId, info) {
//    console.log('tabs.onAttached:');
//    console.log(info);
//});

//chrome.tabs.onHighlighted.addListener(function(info) {
//    console.log('tabs.onHighlighted:');
//    console.log(info);
//});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//    console.log('tabs.onUpdated:');
//    console.log(tab);

    if (changeInfo.status === 'loading') {
        WB.run(tab);
        return;
    }
});

function getUrl(callback) {
    chrome.tabs.getSelected(null, function(tab) {
        if (tab.url) {
            afterFunction = callback;
            try {
                chrome.tabs.executeScript(null, { file: 'js/injection.js' });
            }
            catch (e) {}
        }
        else {
            callback(null);
        }
    });
};

function checkCurrentTab() {
    chrome.tabs.getSelected(null, function(tab) {
        WB.run(tab);
    });
};

chrome.extension.onRequest.addListener(function(tab) {
//    console.log('extension.onRequest:');
//    console.log(tab);
    afterFunction(tab);
});

if (!db.get('regular_visitor', false)) {
    chrome.tabs.create({ url: 'welcome.html', selected: true })
    db.set('regular_visitor', true);
}

