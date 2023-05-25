import PopupWithForm from "./PopupWithForm";
import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, buttonText, onPatchProfile }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  function handleChangeName(evt) {
    setName(evt.target.value);
  }

  function handleChangeAbout(evt) {
    setAbout(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onPatchProfile({ name, about });
  }

  useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={buttonText}
      onSubmit={handleSubmit}
    >
      <input
        id="nameProfile-input"
        name="name"
        type="text"
        className="popup__input popup__input_name_profile-name"
        placeholder="Введите имя"
        required
        minLength="2"
        maxLength="40"
        value={name || ""}
        onChange={handleChangeName}
      />
      <span className="popup__input-error nameProfile-input-error"></span>

      <input
        id="textProfile-input"
        name="about"
        type="text"
        className="popup__input popup__input_name_profile-description"
        placeholder="Введите описание"
        required
        minLength="2"
        maxLength="200"
        value={about || ""}
        onChange={handleChangeAbout}
      />
      <span className="popup__input-error textProfile-input-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
