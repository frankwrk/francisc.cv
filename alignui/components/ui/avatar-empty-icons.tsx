// AlignUI Avatar Empty Icons v0.0.0

'use client';

import * as React from 'react';

export function IconEmptyUser(props: React.SVGProps<SVGSVGElement>) {
  const clipPathId = React.useId();

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 80 80'
      {...props}
      data-oid='qusyrgh'
    >
      <g fill='#fff' clipPath={`url(#${clipPathId})`} data-oid='wl.5pq4'>
        <ellipse
          cx={40}
          cy={78}
          fillOpacity={0.72}
          rx={32}
          ry={24}
          data-oid='ini-uf0'
        />
        <circle cx={40} cy={32} r={16} opacity={0.9} data-oid='xx6hg92' />
      </g>
      <defs data-oid='gv-j10o'>
        <clipPath id={clipPathId} data-oid='_k6oiyt'>
          <rect width={80} height={80} fill='#fff' rx={40} data-oid='85-4jf9' />
        </clipPath>
      </defs>
    </svg>
  );
}

export function IconEmptyCompany(props: React.SVGProps<SVGSVGElement>) {
  const clipPathId = React.useId();
  const filterId1 = React.useId();
  const filterId2 = React.useId();

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={56}
      height={56}
      fill='none'
      viewBox='0 0 56 56'
      {...props}
      data-oid='wy6zbyr'
    >
      <g clipPath={`url(#${clipPathId})`} data-oid='bj.s88g'>
        <rect
          width={56}
          height={56}
          className='fill-bg-soft-200'
          rx={28}
          data-oid='.7lgg7x'
        />
        <path
          className='fill-bg-soft-200'
          d='M0 0h56v56H0z'
          data-oid='5:um6xm'
        />
        <g filter={`url(#${filterId1})`} opacity={0.48} data-oid='83o:7k6'>
          <path
            fill='#fff'
            d='M7 24.9a2.8 2.8 0 012.8-2.8h21a2.8 2.8 0 012.8 2.8v49a2.8 2.8 0 01-2.8 2.8h-21A2.8 2.8 0 017 73.9v-49z'
            data-oid='w:p_1go'
          />
        </g>
        <path
          className='fill-bg-soft-200'
          d='M12.6 28.7a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2z'
          data-oid='750x4b-'
        />

        <g filter={`url(#${filterId2})`} data-oid='359vgxx'>
          <path
            fill='#fff'
            fillOpacity={0.8}
            d='M21 14a2.8 2.8 0 012.8-2.8h21a2.8 2.8 0 012.8 2.8v49a2.8 2.8 0 01-2.8 2.8h-21A2.8 2.8 0 0121 63V14z'
            data-oid='xgluw0a'
          />
        </g>
        <path
          className='fill-bg-soft-200'
          d='M26.6 17.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7V22a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm9.8-29.4a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7V22a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2z'
          data-oid='2335up-'
        />
      </g>
      <defs data-oid='p93-7xo'>
        <filter
          id={filterId1}
          width={34.6}
          height={62.6}
          x={3}
          y={18.1}
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'
          data-oid='fu--_e0'
        >
          <feFlood
            floodOpacity={0}
            result='BackgroundImageFix'
            data-oid='j5fbz0i'
          />
          <feGaussianBlur
            in='BackgroundImageFix'
            stdDeviation={2}
            data-oid='_u3emr0'
          />
          <feComposite
            in2='SourceAlpha'
            operator='in'
            result='effect1_backgroundBlur_36237_4888'
            data-oid='qz08pky'
          />

          <feBlend
            in='SourceGraphic'
            in2='effect1_backgroundBlur_36237_4888'
            result='shape'
            data-oid='4vod7p2'
          />
        </filter>
        <filter
          id={filterId2}
          width={42.6}
          height={70.6}
          x={13}
          y={3.2}
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'
          data-oid='tx8xicr'
        >
          <feFlood
            floodOpacity={0}
            result='BackgroundImageFix'
            data-oid='n_:2wjj'
          />
          <feGaussianBlur
            in='BackgroundImageFix'
            stdDeviation={4}
            data-oid='2f9elxt'
          />
          <feComposite
            in2='SourceAlpha'
            operator='in'
            result='effect1_backgroundBlur_36237_4888'
            data-oid='-11kiy4'
          />

          <feBlend
            in='SourceGraphic'
            in2='effect1_backgroundBlur_36237_4888'
            result='shape'
            data-oid='0g4whef'
          />

          <feColorMatrix
            in='SourceAlpha'
            result='hardAlpha'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            data-oid='a1erhub'
          />

          <feOffset dy={4} data-oid='sa0:935' />
          <feGaussianBlur stdDeviation={2} data-oid='_z9ya3z' />
          <feComposite
            in2='hardAlpha'
            k2={-1}
            k3={1}
            operator='arithmetic'
            data-oid='gvo2oce'
          />
          <feColorMatrix
            values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0'
            data-oid='hnbw-e5'
          />
          <feBlend
            in2='shape'
            result='effect2_innerShadow_36237_4888'
            data-oid='r2.b2ka'
          />
        </filter>
        <clipPath id={clipPathId} data-oid='zk66.up'>
          <rect width={56} height={56} fill='#fff' rx={28} data-oid='dqjxf4y' />
        </clipPath>
      </defs>
    </svg>
  );
}
