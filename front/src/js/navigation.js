
//var baseUrl = "http://localhost";
var baseUrl = window.location.origin;
console.log('url:',baseUrl);
window.addEventListener('popstate', handlePopState);

function handlePopState(event) {
    const currentPath = window.location.pathname;
    fetchContent(currentPath);
}

function fetchContent(path) {
    var lang = getLang()
    if (path && path.slice(-1) !== '/') {
        path += '/';
    }
    fetch(baseUrl + ':8000' + path, {
        credentials: 'include',
         headers: {
            'language': lang,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            content.innerHTML = data.content;
        }
        if (data.redirect){
            handleRedirect(data.redirect);
        }
    })
    .catch(error => {
    });
}

function updateUrl(path) {
    const newPath = baseUrl + path;
    window.history.pushState({ path: newPath }, '', newPath);
}

function handleNavLinks()
{
    var navLinks = document.querySelectorAll('.navlink');
    navLinks.forEach(function (link) {
        link.addEventListener('click', handleNavLinkClick);
    });
}

function handleRedirect(redirect_url) {
    updateUrl(redirect_url);
    var lang = getLang()
    fetch(baseUrl + ':8000' + redirect_url, {
        credentials: 'include',
           headers: {
            'language': lang,
        },
    }) // Adjusted fetch URL
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            content.innerHTML = data.content;
        }
        else if (data.redirect) {
            handleRedirect(data.redirect);
            return ;
        }
        handleNavLinks()
        if (redirect_url == "/tournament/lobbyPage/")
            automaticLobby();
        else if (redirect_url == "/tournament/bracketPage/")
            automaticTournament();
    })
    .catch(error => {
    });
}

function handleNavLinkClick(event) {
    event.preventDefault(); // Prevents the default behavior (e.g., navigating to a new page)
    var hrefValue = event.currentTarget.getAttribute('href');
    if (hrefValue != "/"){
        hrefValue = hrefValue + "/"
    }
    else
        hrefValue = ""
    updateUrl(hrefValue);
    var lang = getLang()
    fetch(baseUrl + ':8000' + hrefValue, {
        credentials: 'include',
           headers: {
            'language': lang,
        },
    }) // Adjusted fetch URL
    .then(response => response.json())
    .then(data => {

        if (data.content) {
            content.innerHTML = data.content;
        }
        else if (data.redirect) {
            handleRedirect(data.redirect)
        }
        handleNavLinks()
        
    })
    .catch(error => {
    });
}

function handleNavRefresh() {
    checkURLCode();
    event.preventDefault();
    var hrefValue = window.location.href;
    hrefValue = hrefValue.substring(baseUrl.length, hrefValue.lenght);
    if (hrefValue && hrefValue.slice(-1) !== '/'){
        hrefValue = hrefValue + "/"
    }
    var lang = getLang();
    fetch(baseUrl + ':8000' + hrefValue, {
        credentials: 'include',
        headers: {
            'language': lang,
        },
    }) // Adjusted fetch URL
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            content.innerHTML = data.content;
        }
        else if (data.redirect) {
            handleRedirect(data.redirect)            
        }
        handleNavLinks()
    })
    .catch(error => {
    });
}


function handleNavLinkAction(hrefValue) {
    updateUrl(hrefValue);
    var lang = getLang()
    fetch(baseUrl + ':8000' + hrefValue, {
        credentials: 'include',
            headers: {
            'language': lang,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            content.innerHTML = data.content;
        }

        handleNavLinks();
    })
    .catch(error => {
    });
}

const initialPath = window.location.pathname;
fetchContent(initialPath);
handleNavLinks()
var initialpath = window.location.pathname;
if (initialpath == "/game/play/"){
    reconnect();
}
else if (initialpath == "/about-us/"){
    aboutUs();
}
