import Link from 'next/link';
import * as Button from '@/components/ui/button';
import { RiGithubFill } from '@remixicon/react';

export default function Home() {
  return (
    <div className='container mx-auto flex-1 px-5' data-oid='-w:rbd1'>
      <div className='mt-48 flex flex-col items-center' data-oid='9_:_va-'>
        <h1
          className='max-w-3xl text-balance text-center text-title-h3 text-text-strong-950'
          data-oid='zs-57-x'
        >
          Quick Starter AlignUI Template with Next.js & Typescript
        </h1>

        <div className='mt-6 flex gap-4' data-oid='742bukr'>
          <Button.Root variant='neutral' asChild data-oid='3:bkwim'>
            <a
              href='https://github.com/alignui/alignui-nextjs-typescript-starter'
              target='_blank'
              data-oid='4-bee7x'
            >
              <Button.Icon as={RiGithubFill} data-oid='ypg:cqi' />
              Give a star
            </a>
          </Button.Root>

          <Button.Root
            variant='neutral'
            mode='stroke'
            asChild
            data-oid='wgw4.ny'
          >
            <Link
              href='https://alignui.com/docs'
              target='_blank'
              data-oid='4it5aau'
            >
              Read our docs
            </Link>
          </Button.Root>
        </div>

        <div className='mt-12' data-oid='e8jt3mw'>
          <h2
            className='text-lg text-text-primary font-semibold'
            data-oid='1gnv6de'
          >
            What&apos;s Included:
          </h2>
          <ul
            className='ml-6 mt-3 flex list-disc flex-col gap-2 font-mono text-paragraph-sm font-medium text-text-sub-600'
            data-oid='dvevb44'
          >
            <li data-oid='m4q-f6s'>Tailwind setup with AlignUI tokens.</li>
            <li data-oid='zcipc.7'>
              Base components are stored in{' '}
              <code
                className='rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950'
                data-oid='on663d7'
              >
                /components/ui
              </code>{' '}
              folder.
            </li>
            <li data-oid='ek.eel9'>
              Utils are stored in{' '}
              <code
                className='rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950'
                data-oid='rpr.v4f'
              >
                /utils
              </code>{' '}
              folder.
            </li>
            <li data-oid='majoh9n'>
              Custom hooks are stored in{' '}
              <code
                className='rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950'
                data-oid='_za:f_9'
              >
                /hooks
              </code>{' '}
              folder.
            </li>
            <li data-oid='e-337k-'>Dark mode setup.</li>
            <li data-oid='r2zj6a.'>Inter font setup.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
