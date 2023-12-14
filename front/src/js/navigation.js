//const baseUrl = "http://crazy-pong.com";

const baseUrl = "http://localhost";

window.addEventListener('popstate', handlePopState);

function handlePopState(event) {
    const currentPath = window.location.pathname;
    fetchContent(currentPath);
}

function fetchContent(path) {
    fetch(baseUrl + ':8000' + path, {
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from backend:', data);

        if (data.content) {
            content.innerHTML = data.content;
        } else {
            console.log('Invalid response from backend');
        }
    })
    .catch(error => {
        console.error('Error:', error);
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

function handleNavLinkClick(event) {
    event.preventDefault();
    console.log("NavLink clicked!");
    var hrefValue = event.currentTarget.getAttribute('href');
    if (hrefValue != "/"){
        hrefValue = hrefValue + "/"
    }
    else
        hrefValue = ""
    updateUrl(hrefValue);
    fetch(baseUrl + ':8000' + hrefValue, {
        credentials: 'include',
    }) // Adjusted fetch URL
    .then(response => response.json())
    .then(data => {
        console.log('Response from backend:', data);

        if (data.content) {
            content.innerHTML = data.content;
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
    console.log("NavLink clicked!");
    if (hrefValue != "/"){
        hrefValue = hrefValue + "/"
    }
    updateUrl(hrefValue);
    fetch(baseUrl + ':8000' + hrefValue, {
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from backend:', data);
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
console.log('URL Parameters:', initialpath);