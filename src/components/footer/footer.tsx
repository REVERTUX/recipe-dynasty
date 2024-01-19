import dynamic from 'next/dynamic';

const ChangeLocale = dynamic(() => import('./change-locale'));

function Footer() {
  return (
    <div className="z-50 w-full bg-white shadow-md dark:bg-gray-900">
      <footer className="container mx-auto flex justify-end px-6 py-3 md:py-4">
        <ChangeLocale />
      </footer>
    </div>
  );
}

export default Footer;
