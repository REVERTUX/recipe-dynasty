import { Separator } from '@/components/ui/separator';
import Informations from './Informations';
import Steps from './Steps';
import EditLink from './EditLink';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: PageProps) {
  return (
    <>
      <EditLink recipeId={id} />

      <div className="flex flex-col gap-4">
        <Informations recipeId={id} />
        <Separator className="bg-primary-foreground bg-slate-400" />
        <Steps recipeId={id} />
      </div>
    </>
  );
}
