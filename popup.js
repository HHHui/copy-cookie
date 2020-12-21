// When the popup Paste Button is clicked
const onCopyButtonClick = () => {
    chrome.tabs.query(
        {
            currentWindow: true,
            active: true,
        },
        tab => {
            chrome.cookies.getAll({ url: tab[0].url }, cookie => {
                localStorage.copyCookieData = btoa(JSON.stringify(cookie));
                setTimeout(() => handlePopupUI('copy'), 50); // Buffer time to set local storage
            });
        },
    );
};

const removeCookies = (cookies, index, url, callback) => {
    if (!cookies[index]) return callback();

    chrome.cookies.remove({
        url: url + cookies[index].path,
        name: cookies[index].name,
    }, () => removeCookies(cookies, index + 1, url, callback));
};

const setNewCookies = (cookies, index, url, callback) => {
    if (!cookies[index]) return callback();

    const { name, value, path, domain } = cookies[index];
    try {
        chrome.cookies.set({
            url,
            name,
            value,
            path,
            domain: 'localhost',
        }, () => setNewCookies(cookies, index + 1, url, callback));
    } catch (e) {
        console.warn(`There was an error setting the cookies: ${error}`);
    }
};

// When the popup Paste Button is clicked
const onPasteButtonClick = () => {
    let copyCookieData;
    try {
        copyCookieData = localStorage.copyCookieData
            ? JSON.parse(atob(localStorage.copyCookieData))
            : null;
    } catch (e) {
        return alert('Error parsing cookies. Please try again.');
    }

    if (!copyCookieData)
        return alert('Oh Man! You need to copy the cookies first.');

    let title = document.getElementById('titleInput').value.trim();
    if(!title) return alert('Please Input target tab HTML title');

    // ENABLE LOADER
    const spinner = document.getElementById('loader');
    spinner.setAttribute('style', 'display: flex;');

    chrome.tabs.query(
        {
            active: false,
            title
        },
        tab => {
            if (!tab?.[0]?.url) {
                spinner.setAttribute('style', 'display: none;');
                return alert('Tab with invalid URL. Are you kidding me ???');
            }
            console.log('paste target url', tab[0].url);
            chrome.cookies.getAll({ url: tab[0].url }, cookies => {
                removeCookies(cookies, 0, tab[0].url, () => {
                    setNewCookies(copyCookieData, 0, tab[0].url, () => {
                        spinner.setAttribute('style', 'display: none;');
                        chrome.storage.sync.set({title}, function() {
                            console.log("chorme.storage save title success!");
                        });
                        return onResetButtonClick('paste');
                    });
                });
            });
        },
    );
};

// When the popup Reset Button is clicked
const onResetButtonClick = action => {
    localStorage.removeItem('copyCookieData');
    handlePopupUI(action);
};

const handlePopupUI = action => {
    const copyCookieData = localStorage.copyCookieData
    const containerElement = document.getElementById('container');
    containerElement.setAttribute('class', '');
    if (copyCookieData) {
        containerElement.classList.add('container2');
    } else {
        containerElement.classList.add('container1');
    }

    const successPasteLabel = document.getElementById('successPasteLabel');
    const welcomeLabel = document.getElementById('welcomeLabel');
    if (action === 'paste') {
        successPasteLabel.setAttribute('style', 'display: block');
    } else {
        successPasteLabel.setAttribute('style', 'display: none');
    }
    if (action === 'copy' || copyCookieData) {
        chrome.storage.sync.get(['title'], function({title}) {
            console.log("copy cookie on load, get saved title", title);
            document.getElementById('titleInput').value = title;
        });
        welcomeLabel.setAttribute('style', 'display: none');
    } else if (action === 'reset') {
        welcomeLabel.setAttribute('style', 'display: block');
    }
};

// When the popup HTML has loaded
window.addEventListener('load', () => {
    handlePopupUI();

    document
        .getElementById('copyButton')
        .addEventListener('click', onCopyButtonClick);
    document
        .getElementById('pasteButton')
        .addEventListener('click', onPasteButtonClick);
    document
        .getElementById('resetButton')
        .addEventListener('click', () => onResetButtonClick('reset'));
});
