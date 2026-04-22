import { Modal } from "bootstrap";

const hideModal = (modalEl: HTMLElement | null, formData?: any, model?: any): void => {
  if (!modalEl) {
    return;
  }
  const myModal = Modal.getInstance(modalEl);
  myModal?.hide();
  formData = model;
};
const removeModalBackdrop = (): void => {
  if (document.querySelectorAll(".modal-backdrop.fade.show").length) {
    document.querySelectorAll(".modal-backdrop.fade.show").forEach((item) => {
      item.remove();
    });
  }
};

export { removeModalBackdrop, hideModal };
