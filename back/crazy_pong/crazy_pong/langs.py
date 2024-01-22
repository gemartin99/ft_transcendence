def get_langs(lang):
    if lang == "en":
        return get_lang_en()
    if lang == "es":
        return get_lang_es()
    if lang == "pt":
        return get_lang_pt()

def get_lang_en():
    context = {
        'text1': 'Hello',
        'text2': 'World',
    }
    return context

def get_lang_es():
    context = {
        'text1': 'Hola',
        'text2': 'Mundo',
    }
    return context

def get_lang_pt():
    context = {
        'text1': 'Oula',
        'text2': 'Mondo',
    }
    return context