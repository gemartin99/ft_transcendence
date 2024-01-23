
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
    console.log('fetchContent');
    if (path && path.slice(-1) !== '/') {
        path += '/';
    }
    console.log(baseUrl + ':8000' + path);
    fetch(baseUrl + ':8000' + path, {
        credentials: 'include',
         headers: {
            'language': lang,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from backend:', data);

        if (data.content) {
            content.innerHTML = data.content;
        }
        if (data.redirect){
            console.log("yeeeeeeey");
            handleRedirect(data.redirect);
        }
        else {
            console.log('Invalid response from backend');
        }
    })
    .catch(error => {
        console.log('error que lo flipas');
        console.error('Error:', error);
    });
}

function updateUrl(path) {
    console.log('path:', path);
    const newPath = baseUrl + path;
    window.history.pushState({ path: newPath }, '', newPath);
}

function handleNavLinks()
{
    console.log('handleNavLinks');
    var navLinks = document.querySelectorAll('.navlink');
    navLinks.forEach(function (link) {
        link.addEventListener('click', handleNavLinkClick);
    });
}

function handleRedirect(redirect_url) {
    console.log('handleRedirect');
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
        console.log('Response from backend:', data);
        console.log('que si que estoy handleando esto');
        if (data.content) {
            content.innerHTML = data.content;
        }
        else if (data.redirect) {
            handleRedirect(data.redirect);
            return ;
            console.log('Invalid response from backend 1', data.redirect);
        } else {
            console.log('Invalid response from backend 1', data);
        }
        
        handleNavLinks()
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function handleNavLinkClick(event) {
    console.log('handleNavLinkClick');
    event.preventDefault(); // Prevents the default behavior (e.g., navigating to a new page)
    console.log("NavLink clicked!");
    var hrefValue = event.currentTarget.getAttribute('href');
    if (hrefValue != "/"){
        hrefValue = hrefValue + "/"
    }
    else
        hrefValue = ""
    updateUrl(hrefValue);
    console.log(baseUrl + ':8000' + hrefValue);
    var lang = getLang()
    fetch(baseUrl + ':8000' + hrefValue, {
        credentials: 'include',
           headers: {
            'language': lang,
        },
    }) // Adjusted fetch URL
    .then(response => response.json())
    .then(data => {
        console.log('Response from backend: here: ', data);

        if (data.content) {
            content.innerHTML = data.content;
        }
        else if (data.redirect) {
            handleRedirect(data.redirect)
            console.log('Response is a redirect');
        } else {
            console.log('Invalid response from backend 1 oooooo');
        }
        
        handleNavLinks()
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function handleNavRefresh() {
    checkURLCode();
    event.preventDefault(); // Prevents the default behavior (e.g., navigating to a new page)
    console.log("Refresh required!");
    var hrefValue = window.location.href;
    hrefValue = hrefValue.substring(baseUrl.length, hrefValue.lenght);
    if (hrefValue && hrefValue.slice(-1) !== '/'){
        hrefValue = hrefValue + "/"
    }
    // else
    //     hrefValue = ""
    console.log('href:', hrefValue);
    //updateUrl(hrefValue);
    var lang = getLang();
    fetch(baseUrl + ':8000' + hrefValue, {
        credentials: 'include',
        headers: {
            'language': lang,
        },
    }) // Adjusted fetch URL
    .then(response => response.json())
    .then(data => {
        console.log('Response from backend:', data);

        if (data.content) {
            content.innerHTML = data.content;
        }
        else if (data.redirect) {
            handleRedirect(data.redirect)
            
            console.log('Response is a redirect');
        } else {
            console.log('Invalid response from backend 1');
        }
        
        handleNavLinks()
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function handleNavLinkAction(hrefValue) {
    console.log('handleNavLinkAction');
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
        console.log('Response from backend:', data);
        console.log('href::',hrefValue);
        if (data.content) {
            content.innerHTML = data.content;
        } else {
            console.log('Invalid response from backend 1');
        }

        handleNavLinks();
    })
    .catch(error => {
        console.error('Error:', error);
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
console.log('URL Parameters:', initialpath);