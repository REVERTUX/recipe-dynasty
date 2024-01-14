import { mdxComponents } from '@/components/max-components';
import { api } from '@/trpc/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

interface StepsProps {
  recipeId: string;
}

async function Steps({ recipeId }: StepsProps) {
  const { steps } = await api.recipe.getStep.query({ id: recipeId });

  return (
    <div className="prose max-w-full">
      <MDXRemote
        source={steps}
        components={mdxComponents}
        options={{
          parseFrontmatter: true,
          mdxOptions: { remarkPlugins: [remarkGfm] },
        }}
      />
      ;
    </div>
  );
}

export default Steps;
