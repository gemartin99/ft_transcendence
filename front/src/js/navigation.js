
//var baseUrl = "http://localhost";
var baseUrl = window.location.origin;
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
        if (path == "/about-us/")
            aboutUs();
    })
    .catch(error => {
        console.error("Error:", error);
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
        else if (redirect_url == "/about-us/")
            aboutUs();
    })
    .catch(error => {
        console.error("Error:", error);
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
        if (hrefValue == "/about-us/")
            aboutUs();
        handleNavLinks()
        
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function handleNavRefresh() {
    checkURLCode();
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
        if (data.lang){
            setLang(data.lang);
        }
        if (hrefValue == "/about-us/")
            aboutUs();
        handleNavLinks()
    })
    .catch(error => {
        console.error("Error:", error);
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
        if (hrefValue == "/about-us/")
            aboutUs();
        handleNavLinks();
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

const initialPath = window.location.pathname;
fetchContent(initialPath);
handleNavLinks()
var initialpath = window.location.pathname;
if (initialpath == "/game/play/"){
    reconnect();
}