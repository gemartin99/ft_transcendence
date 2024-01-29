

def get_coal(n):
    if (n == 0):
        return "/imgs/invaders.png"
    if (n == 1):
        return "/imgs/pacman.png"
    if (n == 2):
        return "/imgs/tetris.png"
    if (n == 3):
        return "/imgs/invaders.png"
    if (n == 4):
        return "/imgs/tetris.png"

def get_pict(n):
    if (n == 0):
        return "/imgs/jferrer-.jpg"
    if (n == 1):
        return "/imgs/marza-ga.jpg"
    if (n == 2):
        return "/imgs/gemartin-.png"
    if (n == 3):
        return "/imgs/jareste-.png"
    if (n == 4):
        return "/imgs/baltes-g.jpg"

def get_color(n):
    if (n == 0):
        return "#87c55b"
    if (n == 1):
        return "#f2b65a"
    if (n == 2):
        return "#6b6cf5"
    if (n == 3):
        return "#87c55b"
    if (n == 4):
        return "#6b6cf5"

def get_name(n):
    if (n == 0):
        return "Jaime Ferrer"
    if (n == 1):
        return "Marc Arza"
    if (n == 2):
        return "Gerard Martinez"
    if (n == 3):
        return "Joan Areste"
    if (n == 4):
        return "Biel Altes"
    
def get_github(n):
    if (n == 0):
        return "https://github.com/jferrer-l"
    if (n == 1):
        return "https://github.com/CodeMarc42"
    if (n == 2):
        return "https://github.com/gemartin99"
    if (n == 3):
        return "https://github.com/jareste"
    if (n == 4):
        return "https://github.com/bielaltes"
    
def get_linkedin(n):
    if (n == 0):
        return "https://www.linkedin.com/in/jaime-ferrer-luengo/"
    if (n == 1):
        return "https://www.linkedin.com/in/marcarzagarcia/"
    if (n == 2):
        return "https://www.linkedin.com/in/gemartin99/"
    if (n == 3):
        return "https://www.linkedin.com/in/joan-arest%C3%A9-443b79217/"
    if (n == 4):
        return "https://www.linkedin.com/in/biel-altes-569799267/"
    

def get_intra(n):
    if (n == 0):
        return "https://profile.intra.42.fr/users/jferrer-"
    if (n == 1):
        return "https://profile.intra.42.fr/users/marza-ga"
    if (n == 2):
        return "https://profile.intra.42.fr/users/gemartin"
    if (n == 3):
        return "https://profile.intra.42.fr/users/jareste"
    if (n == 4):
        return "https://profile.intra.42.fr/users/baltes-g"

def get_context_aboutus(list):
    context = {
        'coal1': get_coal(list[0]),
        'coal2': get_coal(list[1]),
        'coal3': get_coal(list[2]),
        'coal4': get_coal(list[3]),
        'coal5': get_coal(list[4]),
        'pict1': get_pict(list[0]),
        'pict2': get_pict(list[1]),
        'pict3': get_pict(list[2]),
        'pict4': get_pict(list[3]),
        'pict5': get_pict(list[4]),
        'name1': get_name(list[0]),
        'name2': get_name(list[1]),
        'name3': get_name(list[2]),
        'name4': get_name(list[3]),
        'name5': get_name(list[4]),
        'github1': get_github(list[0]),
        'github2': get_github(list[1]),
        'github3': get_github(list[2]),
        'github4': get_github(list[3]),
        'github5': get_github(list[4]),
        'linkedin1': get_linkedin(list[0]),
        'linkedin2': get_linkedin(list[1]),
        'linkedin3': get_linkedin(list[2]),
        'linkedin4': get_linkedin(list[3]),
        'linkedin5': get_linkedin(list[4]),
        'intra1': get_intra(list[0]),
        'intra2': get_intra(list[1]),
        'intra3': get_intra(list[2]),
        'intra4': get_intra(list[3]),
        'intra5': get_intra(list[4]),
        'color1': get_color(list[0]),
        'color2': get_color(list[1]),
        'color3': get_color(list[2]),
        'color4': get_color(list[3]),
        'color5': get_color(list[4]),

    }
    return context
