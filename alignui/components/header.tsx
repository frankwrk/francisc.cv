import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicThemeSwitch = dynamic(() => import('./theme-switch'), {
  ssr: false,
});

export default function Header() {
  return (
    <div className='border-b border-stroke-soft-200' data-oid='0u_olae'>
      <header
        className='mx-auto flex h-14 max-w-5xl items-center justify-between px-5'
        data-oid='ae0shc6'
      >
        <Link
          href='/'
          className='flex items-center gap-2 text-label-md text-text-strong-950'
          data-oid='xw0cw:e'
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/images/logo.svg'
            alt=''
            className='size-9 object-contain'
            data-oid='04z_-s5'
          />
          AlignUI
        </Link>

        <DynamicThemeSwitch data-oid='q8ovd4m' />
      </header>
    </div>
  );
}
