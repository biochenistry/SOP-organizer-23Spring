import { useEffect } from "react";

type AutoOpenProps = {
  openModal: (data?: any) => void
}

/**
 * Automatically calls the `openModal` prop as soon as the component is rendered. This can be used to automatically open a modal if placed within a `ModalLauncher`.
 * 
 * ### Usage
 * 
 * ```jsx
 * <ModalLauncher modal={myModal}
 *   {({ openModal }) => (
 *     <AutoOpen openModal={openModal} />
 *   )}
 * </ModalLauncher>
 * ```
 * @param props 
 * @returns 
 */
export default function AutoOpen(props: AutoOpenProps) {
  const { openModal } = props;

  useEffect(() => {
    openModal();
  }, [openModal]);

  return null;
}