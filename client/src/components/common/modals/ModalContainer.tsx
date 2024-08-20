import { observer } from "mobx-react-lite";
import { Modal } from "semantic-ui-react";
import { useStore } from "@/stores/store";

export default observer(function ModalContainer() {
  const { modalStore } = useStore();
  return (
    <Modal
      closeIcon
      dimmer="inverted"
      open={modalStore.modal.open}
      onClose={modalStore.closeModal}
      size="fullscreen"
      className="modalContent"
    >
      <Modal.Content>{modalStore.modal.body}</Modal.Content>
    </Modal>
  );
});
