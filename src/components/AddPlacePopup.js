import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ buttonText, onAddPlace, isOpen, onClose }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  function handleChangeName(evt) {
    setName(evt.target.value);
  }

  function handleChangeLink(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace({ name, link });
  }

  useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={buttonText}
      onSubmit={handleSubmit}
    >
      <input
        id="nameMesto-input"
        name="name"
        type="text"
        className="popup__input popup__input_name_photo-name"
        placeholder="Название"
        required
        minLength="2"
        maxLength="40"
        onChange={handleChangeName}
        value={name || ""}
      />
      <span className="popup__input-error nameMesto-input-error"></span>

      <input
        id="urlMesto-input"
        name="link"
        type="url"
        className="popup__input popup__input_name_url-photo"
        placeholder="Ссылка на картинку"
        required
        onChange={handleChangeLink}
        value={link || ""}
      />
      <span className="popup__input-error urlMesto-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
