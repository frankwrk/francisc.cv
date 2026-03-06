// AlignUI Table v0.0.0

import * as React from 'react';

import * as Divider from '@/components/ui/divider';
import { cn } from '@/utils/cn';

const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <div className={cn('w-full overflow-x-auto', className)} data-oid='topnbh2'>
      <table
        ref={forwardedRef}
        className='w-full'
        {...rest}
        data-oid='5i:._r1'
      />
    </div>
  );
});
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ ...rest }, forwardedRef) => {
  return <thead ref={forwardedRef} {...rest} data-oid='a4ehb9j' />;
});
TableHeader.displayName = 'TableHeader';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <th
      ref={forwardedRef}
      className={cn(
        'bg-bg-weak-50 px-3 py-2 text-left text-paragraph-sm text-text-sub-600 first:rounded-l-lg last:rounded-r-lg',
        className,
      )}
      {...rest}
      data-oid='iz:2enx'
    />
  );
});
TableHead.displayName = 'TableHead';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    spacing?: number;
  }
>(({ spacing = 8, ...rest }, forwardedRef) => {
  return (
    <>
      {/* to have space between thead and tbody */}
      <tbody
        aria-hidden='true'
        className='table-row'
        style={{
          height: spacing,
        }}
        data-oid='_s6_j9_'
      />

      <tbody ref={forwardedRef} {...rest} data-oid='a_awvg6' />
    </>
  );
});
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <tr
      ref={forwardedRef}
      className={cn('group/row', className)}
      {...rest}
      data-oid='aq2ckul'
    />
  );
});
TableRow.displayName = 'TableRow';

function TableRowDivider({
  className,
  dividerClassName,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Divider.Root> & {
  dividerClassName?: string;
}) {
  return (
    <tr aria-hidden='true' className={className} data-oid='thspj3w'>
      <td colSpan={999} className='py-1' data-oid='cxwsxsr'>
        <Divider.Root
          variant='line-spacing'
          className={dividerClassName}
          {...rest}
          data-oid='lyjpl_w'
        />
      </td>
    </tr>
  );
}
TableRowDivider.displayName = 'TableRowDivider';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <td
      ref={forwardedRef}
      className={cn(
        'h-16 px-3 transition duration-200 ease-out first:rounded-l-xl last:rounded-r-xl group-hover/row:bg-bg-weak-50',
        className,
      )}
      {...rest}
      data-oid='okk13d0'
    />
  );
});
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...rest }, forwardedRef) => (
  <caption
    ref={forwardedRef}
    className={cn('mt-4 text-paragraph-sm text-text-sub-600', className)}
    {...rest}
    data-oid='.kqvlm1'
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table as Root,
  TableHeader as Header,
  TableBody as Body,
  TableHead as Head,
  TableRow as Row,
  TableRowDivider as RowDivider,
  TableCell as Cell,
  TableCaption as Caption,
};
