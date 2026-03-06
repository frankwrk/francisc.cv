// AlignUI Avatar Empty Icons v0.0.0

"use client";

import * as React from "react";

export function IconEmptyUser(props: React.SVGProps<SVGSVGElement>) {
  const clipPathId = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 80 80"
      {...props}
      data-oid="8qqw2md"
    >
      <g fill="#fff" clipPath={`url(#${clipPathId})`} data-oid="irhxoey">
        <ellipse
          cx={40}
          cy={78}
          fillOpacity={0.72}
          rx={32}
          ry={24}
          data-oid="6.w.eqs"
        />
        <circle cx={40} cy={32} r={16} opacity={0.9} data-oid="qu-9z-l" />
      </g>
      <defs data-oid=":s1-esk">
        <clipPath id={clipPathId} data-oid="gkyey:d">
          <rect width={80} height={80} fill="#fff" rx={40} data-oid="mum8fnx" />
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
      xmlns="http://www.w3.org/2000/svg"
      width={56}
      height={56}
      fill="none"
      viewBox="0 0 56 56"
      {...props}
      data-oid="::9rtgg"
    >
      <g clipPath={`url(#${clipPathId})`} data-oid="lor6s45">
        <rect
          width={56}
          height={56}
          className="fill-bg-soft-200"
          rx={28}
          data-oid="v94feqw"
        />
        <path
          className="fill-bg-soft-200"
          d="M0 0h56v56H0z"
          data-oid="c04q4ro"
        />
        <g filter={`url(#${filterId1})`} opacity={0.48} data-oid="awwqwwe">
          <path
            fill="#fff"
            d="M7 24.9a2.8 2.8 0 012.8-2.8h21a2.8 2.8 0 012.8 2.8v49a2.8 2.8 0 01-2.8 2.8h-21A2.8 2.8 0 017 73.9v-49z"
            data-oid="3s5vss_"
          />
        </g>
        <path
          className="fill-bg-soft-200"
          d="M12.6 28.7a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2z"
          data-oid="zn26ul4"
        />

        <g filter={`url(#${filterId2})`} data-oid="nsmar.i">
          <path
            fill="#fff"
            fillOpacity={0.8}
            d="M21 14a2.8 2.8 0 012.8-2.8h21a2.8 2.8 0 012.8 2.8v49a2.8 2.8 0 01-2.8 2.8h-21A2.8 2.8 0 0121 63V14z"
            data-oid="-zo15pt"
          />
        </g>
        <path
          className="fill-bg-soft-200"
          d="M26.6 17.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7V22a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm9.8-29.4a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7V22a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2z"
          data-oid="d.6bgj7"
        />
      </g>
      <defs data-oid="8-_.ckn">
        <filter
          id={filterId1}
          width={34.6}
          height={62.6}
          x={3}
          y={18.1}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          data-oid="k39l9cg"
        >
          <feFlood
            floodOpacity={0}
            result="BackgroundImageFix"
            data-oid="i6hub_k"
          />
          <feGaussianBlur
            in="BackgroundImageFix"
            stdDeviation={2}
            data-oid="dirnl2h"
          />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_36237_4888"
            data-oid="ctoftmq"
          />

          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_36237_4888"
            result="shape"
            data-oid="ox:qgj0"
          />
        </filter>
        <filter
          id={filterId2}
          width={42.6}
          height={70.6}
          x={13}
          y={3.2}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          data-oid="w:cregd"
        >
          <feFlood
            floodOpacity={0}
            result="BackgroundImageFix"
            data-oid=".suhj9i"
          />
          <feGaussianBlur
            in="BackgroundImageFix"
            stdDeviation={4}
            data-oid="khv00d5"
          />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_36237_4888"
            data-oid="c-05x_s"
          />

          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_36237_4888"
            result="shape"
            data-oid="uh4n19b"
          />

          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            data-oid="35g3xlv"
          />

          <feOffset dy={4} data-oid="8h9hj93" />
          <feGaussianBlur stdDeviation={2} data-oid="x4wpael" />
          <feComposite
            in2="hardAlpha"
            k2={-1}
            k3={1}
            operator="arithmetic"
            data-oid="l39k3tq"
          />
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
            data-oid="48bxh4-"
          />
          <feBlend
            in2="shape"
            result="effect2_innerShadow_36237_4888"
            data-oid="4fn5w02"
          />
        </filter>
        <clipPath id={clipPathId} data-oid="hg21:.6">
          <rect width={56} height={56} fill="#fff" rx={28} data-oid="1fjyn-5" />
        </clipPath>
      </defs>
    </svg>
  );
}
