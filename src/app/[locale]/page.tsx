import dynamic from 'next/dynamic';

const NewestRecipes = dynamic(() => import('./newest-recipes'));

export default async function Page() {
  return (
    <main className="flex min-h-[calc(100vh-9rem)] flex-col items-center p-2 md:px-4 md:py-4">
      <NewestRecipes />
    </main>
  );
}
