'use client';

import { useTheme } from 'next-themes';
import * as SegmentedControl from '@/components/ui/segmented-control';
import { RiEqualizer3Fill, RiMoonLine, RiSunLine } from '@remixicon/react';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <SegmentedControl.Root
      value={theme}
      onValueChange={setTheme}
      defaultValue={theme}
      data-oid='q0pk37n'
    >
      <SegmentedControl.List data-oid='.fvfn2p'>
        <SegmentedControl.Trigger
          value='light'
          className='aspect-square'
          data-oid='bm45_0r'
        >
          <RiSunLine className='size-4' data-oid='15x:yj4' />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger
          value='dark'
          className='aspect-square'
          data-oid='jp.8z7z'
        >
          <RiMoonLine className='size-4' data-oid='_3bagks' />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger
          value='system'
          className='aspect-square'
          data-oid='sfieo6e'
        >
          <RiEqualizer3Fill className='size-4' data-oid='2izsrgr' />
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
