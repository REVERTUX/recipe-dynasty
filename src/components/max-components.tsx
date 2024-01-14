import { type MDXRemoteProps } from 'next-mdx-remote/rsc';

export const mdxComponents: MDXRemoteProps['components'] = {
  h1: (props) => <h1 className="text-primary" {...props} />,
  h2: (props) => <h2 className="text-primary" {...props} />,
  h3: (props) => <h3 className="text-primary" {...props} />,
  h4: (props) => <h4 className="text-primary" {...props} />,
  h5: (props) => <h5 className="text-primary" {...props} />,
  h6: (props) => <h6 className="text-primary" {...props} />,
  p: (props) => <p className="text-primary" {...props} />,
  strong: (props) => <strong className="text-primary" {...props} />,
  em: (props) => <em className="text-primary" {...props} />,
  u: (props) => <u className="text-primary" {...props} />,
  ul: (props) => <ul className="text-primary" {...props} />,
  li: (props) => <li className="text-primary" {...props} />,
};
