import Informations from './Informations';
import Steps from './Steps';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: PageProps) {
  return (
    <div className="max-w-5xl">
      <Informations recipeId={id} />
      <Steps recipeId={id} />
    </div>
  );
}
