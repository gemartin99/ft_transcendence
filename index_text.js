const translations = {
    en: {
        home: "Home",
        game: "Game",
        tournament: "Tournament",
        friends: "Friends",
        information: "Information",
        aboutUs: "About us",
        welcomeHeading: "Welcome to my final project for 42 school",
        welcomeText: "\"Crazy Pong is a tribute to the classic Atari Pong game, This version takes the original gameplay and adds a twist with new features such as power-ups, obstacles, and multiple levels. The user interface has also been updated for a modern look and feel. Whether you're a fan of the original Pong or just looking for a fun and challenging game, Crazy Pong is sure to provide hours of entertainment. Try it out now and see if you have what it takes to beat the high score!\"",
        showOnlineUsers: "Show Online Users",
        activateMail2FA: "Activate Mail 2FA",
        activateGoogle2FA: "Activate Google 2FA",
        rightsReserved: "&copy; 2023 CrazyPong. All rights reserved.",
    },
    es: {
        home: "Inicio",
        game: "Juego",
        tournament: "Torneo",
        friends: "Amigos",
        information: "Información",
        aboutUs: "Sobre nosotros",
        welcomeHeading: "Bienvenido a nuestro proyecto final para 42",
        welcomeText: "\"CrazyPong es un tributo al clásico juego de Atari Pong. Esta versión mantiene la jugabilidad original y le añade un toque especial con nuevas características como mejoras, obstáculos y varios niveles. La interfaz de usuario también ha sido actualizada para darle un aspecto y sensación modernos. Ya seas fan del Pong original o simplemente estés buscando un juego divertido y desafiante, Crazy Pong seguramente te brindará horas de entretenimiento. ¡Pruébalo ahora y descubre si tienes lo necesario para vencer la puntuación más alta!\"",
        showOnlineUsers: "Usuarios en línea",
        activateMail2FA: "Activar mail 2FA",
        activateGoogle2FA: "Activar Google 2FA",
        rightsReserved: "&copy; 2023 CrazyPong. Todos los derechos reservados.",
    },
};

// Default language
let currentLanguage = "en";

function updateTextContent(language) {
    currentLanguage = language;

    document.getElementById('home').innerText = translations[language].home;
    document.getElementById('game').innerText = translations[language].game;
    document.getElementById('tournament').innerText = translations[language].tournament;
    document.getElementById('friends').innerText = translations[language].friends;
    document.getElementById('information').innerText = translations[language].information;
    document.getElementById('aboutUs').innerText = translations[language].aboutUs;

    document.getElementById('welcomeHeading').innerText = translations[language].welcomeHeading;
    document.getElementById('welcomeText').innerText = translations[language].welcomeText;

    document.getElementById('showOnlineUsers').innerText = translations[language].showOnlineUsers;
    document.getElementById('activateMail').innerText = translations[language].activateMail2FA;
    document.getElementById('activateGoogle').innerText = translations[language].activateGoogle2FA;
    document.getElementById('rightsReserved').innerText = translations[language].rightsReserved;
}

// Init Page
updateTextContent(currentLanguage);
