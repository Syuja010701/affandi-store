'use client';

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  dismissible?: boolean;
  primaryAction?: {
    label: string;
    disableButton? : boolean;
    onClick: () => void;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'gray';
  };
  secondaryAction?: {
    label: string;
    disableButton? : boolean;
    onClick: () => void;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'gray';
  };
}

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  dismissible = true,
  primaryAction,
  secondaryAction,
}: Props) {
  return (
    <Modal
      dismissible={dismissible}
      show={open}
      size={size}
      onClose={onClose}
    >
      {title && <ModalHeader>{title}</ModalHeader>}
      <ModalBody>{children}</ModalBody>
      <ModalFooter className='justify-end'>
        {secondaryAction && (
          <Button
            color={secondaryAction.color ?? 'gray'}
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disableButton}
          >
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            disabled={primaryAction.disableButton}
            color={primaryAction.color ?? 'blue'}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}