function getLang()
{
	return 	document.getElementById('lang_selected').value;
}

function set_english_lang()
{
	var links = document.querySelectorAll('li.nav-item > a.navlink.nav-link');
	links.forEach(function (link) {
	    if (link.getAttribute('href') === '/') {
            link.textContent = 'Home';
        }
	    if (link.getAttribute('href') === '/game') {
            link.textContent = 'Game';
        }
	    if (link.getAttribute('href') === '/tournament') {
            link.textContent = 'Tournament';
        }
	    if (link.getAttribute('href') === '/friends') {
            link.textContent = 'Friends';
        }
	    if (link.getAttribute('href') === '/information') {
            link.textContent = 'Information';
        }
	    if (link.getAttribute('href') === '/about-us') {
            link.textContent = 'About us';
        }
	});
	var buttons = document.querySelectorAll('a.navlink.btn');
	buttons.forEach(function (button) {
	    if (button.getAttribute('href') === '/profile') {
            button.textContent = 'Profile';
        }
	    if (button.getAttribute('href') === '/users/register') {
            button.textContent = 'Register';
        }
	    if (button.getAttribute('href') === '/users/login') {
            button.textContent = 'Login';
        }
	    if (button.getAttribute('href') === '/users/logout') {
            button.textContent = 'Logout';
        }
	});
	document.getElementById('copyright').textContent = '© 2023 CrazyPong. All rights reserved.';
	document.getElementById('lang-selector').textContent = 'Language';
	document.getElementById('lang-en').textContent = 'English';
	document.getElementById('lang-es').textContent = 'Spanish';
	document.getElementById('lang-pt').textContent = 'Portuguese';
	document.getElementById('lang_selected').value = 'en';
	handleNavRefresh()
}

function set_spanish_lang()
{
	var links = document.querySelectorAll('li.nav-item > a.navlink.nav-link');
	links.forEach(function (link) {
	    if (link.getAttribute('href') === '/') {
            link.textContent = 'Inicio';
        }
	    if (link.getAttribute('href') === '/game') {
            link.textContent = 'Partida';
        }
	    if (link.getAttribute('href') === '/tournament') {
            link.textContent = 'Torneo';
        }
	    if (link.getAttribute('href') === '/friends') {
            link.textContent = 'Amigos';
        }
	    if (link.getAttribute('href') === '/information') {
            link.textContent = 'Informacion';
        }
	    if (link.getAttribute('href') === '/about-us') {
            link.textContent = 'Nosotros';
        }
	});

	var buttons = document.querySelectorAll('a.navlink.btn');
	buttons.forEach(function (button) {
	    if (button.getAttribute('href') === '/profile') {
            button.textContent = 'Perfil';
        }
	    if (button.getAttribute('href') === '/users/register') {
            button.textContent = 'Nueva Cuenta';
        }
	    if (button.getAttribute('href') === '/users/login') {
            button.textContent = 'Loguear';
        }
	    if (button.getAttribute('href') === '/users/logout') {
            button.textContent = 'Desloguear';
        }
	});
	document.getElementById('copyright').textContent = '© 2023 CrazyPong. Todos los derechos reservados.';
	document.getElementById('lang-selector').textContent = 'Idiomas';
	document.getElementById('lang-en').textContent = 'Ingles';
	document.getElementById('lang-es').textContent = 'Español';
	document.getElementById('lang-pt').textContent = 'Portugues';
	document.getElementById('lang_selected').value = 'es';
	handleNavRefresh()
}

function set_portuguese_lang()
{
	var links = document.querySelectorAll('li.nav-item > a.navlink.nav-link');
	links.forEach(function (link) {
	    if (link.getAttribute('href') === '/') {
            link.textContent = 'porto1';
        }
	    if (link.getAttribute('href') === '/game') {
            link.textContent = 'porto2';
        }
	    if (link.getAttribute('href') === '/tournament') {
            link.textContent = 'porto3';
        }
	    if (link.getAttribute('href') === '/friends') {
            link.textContent = 'porto4';
        }
	    if (link.getAttribute('href') === '/information') {
            link.textContent = 'porto5';
        }
	    if (link.getAttribute('href') === '/about-us') {
            link.textContent = 'porto6';
        }
	});
	var buttons = document.querySelectorAll('a.navlink.btn');
	buttons.forEach(function (button) {
	    if (button.getAttribute('href') === '/profile') {
            button.textContent = 'porto7';
        }
	    if (button.getAttribute('href') === '/users/register') {
            button.textContent = 'porto8';
        }
	    if (button.getAttribute('href') === '/users/login') {
            button.textContent = 'porto9';
        }
	    if (button.getAttribute('href') === '/users/logout') {
            button.textContent = 'porto10';
        }
	});
	document.getElementById('copyright').textContent = 'porto11';
	document.getElementById('lang-selector').textContent = 'porto12';
	document.getElementById('lang-en').textContent = 'porto13';
	document.getElementById('lang-es').textContent = 'porto14';
	document.getElementById('lang-pt').textContent = 'porto15';
	document.getElementById('lang_selected').value = 'pt';
	handleNavRefresh()
}