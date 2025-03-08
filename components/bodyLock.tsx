import { forwardRef, useRef, useImperativeHandle } from 'react';
import ReactModal, { Props as ReactModalProps } from 'react-modal';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

type BodyLockModalProps = ReactModalProps;

const BodyLockModal = forwardRef<HTMLDivElement, BodyLockModalProps>(
  ({ isOpen, onAfterOpen, onAfterClose, children, ...props }, ref) => {
    // This <div> will be the scroll-lock target
    const lockRef = useRef<HTMLDivElement>(null);

    // If you need to expose something via ref:
    useImperativeHandle(ref, () => lockRef.current as HTMLDivElement);

    return (
      <ReactModal
        // Pass through the ReactModal props
        isOpen={isOpen}
        // If you want custom logic, call the library’s function + user’s function
        onAfterOpen={() => {
          // body-scroll-lock logic
          if (lockRef.current) disableBodyScroll(lockRef.current);
          // Also call user’s callback if provided
          onAfterOpen?.();
        }}
        onAfterClose={() => {
          if (lockRef.current) enableBodyScroll(lockRef.current);
          onAfterClose?.();
        }}
        {...props} // Spread the rest (e.g., onRequestClose, overlayClassName, etc.)
      >
        <div ref={lockRef}>
          {children}
        </div>
      </ReactModal>
    );
  }
);

export default BodyLockModal;
