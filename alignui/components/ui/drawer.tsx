// AlignUI Drawer v0.0.0

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { RiCloseLine } from '@remixicon/react';

import * as CompactButton from '@/components/ui/compact-button';
import { cn } from '@/utils/cn';

const DrawerRoot = DialogPrimitive.Root;
DrawerRoot.displayName = 'Drawer';

const DrawerTrigger = DialogPrimitive.Trigger;
DrawerTrigger.displayName = 'DrawerTrigger';

const DrawerClose = DialogPrimitive.Close;
DrawerClose.displayName = 'DrawerClose';

const DrawerPortal = DialogPrimitive.Portal;
DrawerPortal.displayName = 'DrawerPortal';

const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <DialogPrimitive.Overlay
      ref={forwardedRef}
      className={cn(
        // base
        'fixed inset-0 z-50 grid grid-cols-1 place-items-end overflow-hidden bg-overlay backdrop-blur-[10px]',
        // animation
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...rest}
      data-oid='9vahu63'
    />
  );
});
DrawerOverlay.displayName = 'DrawerOverlay';

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...rest }, forwardedRef) => {
  return (
    <DrawerPortal data-oid='y0ss.ph'>
      <DrawerOverlay data-oid='npmqhe.'>
        <DialogPrimitive.Content
          ref={forwardedRef}
          className={cn(
            // base
            'size-full max-w-[400px] overflow-y-auto',
            'border-l border-stroke-soft-200 bg-bg-white-0',
            // animation
            'data-[state=open]:duration-200 data-[state=open]:ease-out data-[state=open]:animate-in',
            'data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=closed]:animate-out',
            'data-[state=open]:slide-in-from-right-full',
            'data-[state=closed]:slide-out-to-right-full',
            className,
          )}
          {...rest}
          data-oid='e8:fdno'
        >
          <div className='relative flex size-full flex-col' data-oid='to.b9md'>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DrawerOverlay>
    </DrawerPortal>
  );
});
DrawerContent.displayName = 'DrawerContent';

function DrawerHeader({
  className,
  children,
  showCloseButton = true,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-stroke-soft-200 p-5',
        className,
      )}
      {...rest}
      data-oid='.qgwlbr'
    >
      {children}

      {showCloseButton && (
        <DrawerClose asChild data-oid='kq-jihk'>
          <CompactButton.Root variant='ghost' size='large' data-oid='apz8xt9'>
            <CompactButton.Icon as={RiCloseLine} data-oid='nj8-iwj' />
          </CompactButton.Root>
        </DrawerClose>
      )}
    </div>
  );
}
DrawerHeader.displayName = 'DrawerHeader';

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <DialogPrimitive.Title
      ref={forwardedRef}
      className={cn('flex-1 text-label-lg text-text-strong-950', className)}
      {...rest}
      data-oid='7llkwl6'
    />
  );
});
DrawerTitle.displayName = 'DrawerTitle';

function DrawerBody({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-1', className)} {...rest} data-oid='pd8bdy_'>
      {children}
    </div>
  );
}
DrawerBody.displayName = 'DrawerBody';

function DrawerFooter({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 border-stroke-soft-200 p-5',
        className,
      )}
      {...rest}
      data-oid='0rx29ck'
    />
  );
}
DrawerFooter.displayName = 'DrawerFooter';

export {
  DrawerRoot as Root,
  DrawerTrigger as Trigger,
  DrawerClose as Close,
  DrawerContent as Content,
  DrawerHeader as Header,
  DrawerTitle as Title,
  DrawerBody as Body,
  DrawerFooter as Footer,
};
