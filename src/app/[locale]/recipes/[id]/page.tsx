import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { api } from '@/trpc/server';

import Informations from './Informations';
import Steps from './Steps';
import EditLink from './EditLink';

interface PageProps {
  params: {
    id: string;
  };
}

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipeId = params.id;

  const { title, description } = await api.recipe.getOne.query({
    id: recipeId,
  });

  return {
    title,
    description,
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
