export default {
  navigation: {
    home: 'Strona główna',
    recipes: 'Przepisy',
    admin: 'Admin',
    createRecipe: 'Stwórz przepis',
    title: 'Dynastia Przepisów',
    signIn: 'Zaloguj się',
    signOut: 'Wyloguj się',
    light: 'Tryb jasny',
    dark: 'Ciemny motyw',
    system: 'Użyj trybu urządzenia',
    en: 'Angielski',
    pl: 'Polski',
  },
  recipes: {
    search: 'Wyszukaj przepis...',
  },
  recipe: {
    createTitle: 'Stwórz przepis',
    create: 'Stwórz',
    editTitle: 'Zaaktualizuj przepis',
    edit: 'Zaaktualizuj',
    title: 'Tytuł',
    description: 'Opis',
    time: 'Czas',
    servings: 'Porcje',
    calories: 'Kalorie',
    nutrients: 'Składniki odżywcze',
    carbs: 'Węglowodany',
    protein: 'Białko',
    fat: 'Tłuszcze',
    hours: 'godzina(y)',
    uploadImage: {
      upload: 'Kliknij, aby przesłać obraz',
      uploaded: 'Przesłany obraz',
      files: 'Obraz PNG lub JPG',
    },
    delete: {
      title: 'Usuń przepis',
      description: 'Czy na pewno chcesz usunąć ten przepis?',
    },
    categories: {
      title: 'Kategorie',
      addRemove: 'Dodaj/Usuń',
    },
  },
  categories: {
    add: 'Dodaj kategorię',
    edit: {
      title: 'Edytuj kategorię',
      notification: {
        success: 'Pomyślnie zaaktualizowano kategorię',
        error: 'Nie udało się zaaktualizować kategorii',
      },
    },
    delete: {
      title: 'Usuń kategorię',
      description: 'Czy na pewno chcesz usunąć tą kategorię?',
      notification: {
        success: 'Pomyślnie usunięto kategorię',
        error: 'Nie udało się usunąć kategorii',
      },
    },
    create: {
      title: 'Dodaj kategorię',
      notification: {
        success: 'Pomyślnie stworzono kategorię',
        error: 'Nie udało się stworzyć kategorii',
      },
    },
  },
  pagination: {
    next: 'Następna',
    previous: 'Poprzednia',
    search: 'Szukaj',
  },
  common: {
    delete: 'Usuń',
    cancel: 'Anuluj',
    close: 'Zamknij',
    create: 'Stwórz',
    update: 'Zaaktualizuj',
    edit: 'Edytuj',
  },
} as const;
