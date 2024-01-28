function getLang()
{
	return 	document.getElementById('lang_selected').value;
}

function set_english_lang()
{
	fetch(baseUrl + ':8000' + 'users/changeLang', {
        credentials: 'include',
         headers: {
            'language': "en",
        },
    })
    .then(response => response.json())
    .then(data => {
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
    })
    .catch(error => {
        console.error("Error:", error);
    });
		
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
            button.textContent = 'Iniciar sesión';
        }
	    if (button.getAttribute('href') === '/users/logout') {
            button.textContent = 'Cerrar sesión';
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
            link.textContent = 'Início';
        }
	    if (link.getAttribute('href') === '/game') {
            link.textContent = 'Jogo';
        }
	    if (link.getAttribute('href') === '/tournament') {
            link.textContent = 'Torneio';
        }
	    if (link.getAttribute('href') === '/friends') {
            link.textContent = 'Amigos';
        }
	    if (link.getAttribute('href') === '/information') {
            link.textContent = 'Informação';
        }
	    if (link.getAttribute('href') === '/about-us') {
            link.textContent = 'Sobre nós';
        }
	});
	var buttons = document.querySelectorAll('a.navlink.btn');
	buttons.forEach(function (button) {
	    if (button.getAttribute('href') === '/profile') {
            button.textContent = 'Perfil';
        }
	    if (button.getAttribute('href') === '/users/register') {
            button.textContent = 'Nova Conta';
        }
	    if (button.getAttribute('href') === '/users/login') {
            button.textContent = 'Iniciar sessão';
        }
	    if (button.getAttribute('href') === '/users/logout') {
            button.textContent = 'Terminar a sessão';
        }
	});
	document.getElementById('copyright').textContent = '© 2023 CrazyPong. Todos os direitos reservados.';
	document.getElementById('lang-selector').textContent = 'Línguas';
	document.getElementById('lang-en').textContent = 'Inglês';
	document.getElementById('lang-es').textContent = 'Espanhol';
	document.getElementById('lang-pt').textContent = 'Português';
	document.getElementById('lang_selected').value = 'pt';
	handleNavRefresh()
}