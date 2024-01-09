def get_langs(lang):
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        #friends.html
        'text1': 'ADD FRIENDS',
        'text2': 'Search friends',
        'text3': 'Add',
        'text4': 'YOUR FRIENDS LIST',
    }
    return context

def get_lang_es():
    context = {
        #friends.html
        'text1': 'AGREGAR AMIGOS',
        'text2': 'Buscar amigos',
        'text3': 'Añadir',
        'text4': 'TU LISTA DE AMIGOS',
    }
    return context

def get_lang_pt():
    context = {
        #friends.html
        'text1': 'ADICIONAR AMIGOS',
        'text2': 'Encontrar amigos',
        'text3': 'Adicionar',
        'text4': 'A SUA LISTA DE AMIGOS',
    }
    return context

