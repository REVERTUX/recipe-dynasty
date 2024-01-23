export default {
  navigation: {
    home: 'Home',
    recipes: 'Recipes',
    admin: 'Admin',
    createRecipe: 'Create recipe',
    title: 'Recipe Dynasty',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    en: 'English',
    pl: 'Polish',
  },
  recipes: {
    search: 'Search for recipe...',
  },
  recipe: {
    createTitle: 'Create Recipe',
    create: 'Create',
    editTitle: 'Update Recipe',
    edit: 'Update',
    title: 'Title',
    description: 'Description',
    time: 'Time',
    servings: 'Servings',
    calories: 'Calories',
    nutrients: 'Nutrients',
    carbs: 'Carbs',
    protein: 'Protein',
    fat: 'Fat',
    hours: 'hour(s)',
    uploadImage: {
      upload: 'Click to upload',
      uploaded: 'Image uploaded',
      files: 'PNG orJPG file',
    },
    delete: {
      title: 'Delete recipe',
      description: 'Are you sure that you want to delete this recipe?',
    },
    categories: {
      title: 'Categories',
      addRemove: 'Add/Remove',
    },
  },
  categories: {
    add: 'Add category',
    edit: {
      title: 'Edit category',
    },
    delete: {
      title: 'Delete category',
      description: 'Are you sure that you want to delete this category?',
    },
    create: {
      title: 'Add category',
    },
  },
  pagination: {
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
  },
  common: {
    delete: 'Delete',
    cancel: 'Cancel',
    close: 'Close',
    create: 'Create',
    update: 'Update',
    edit: 'Edit',
  },
} as const;
