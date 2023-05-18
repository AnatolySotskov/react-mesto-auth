import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);

  const handleCardClick = (props) => {
    setSelectedCard(props);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
  };

  function getUserData() {
    api
      .getInfoUser()
      .then((userData) => setCurrentUser(userData))
      .catch((err) => `Ошибка получения данных пользователя: ${err}`);
  }

  function getCardsData() {
    api
      .getCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getUserData();
    getCardsData();
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api.toggleLike(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    })
    .catch((err) => console.log(`Ошибка лайка: ${err}`));
  }

  function handleCardDelete(card) {
    api
      .deleteCards(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка удаления: ${err}`));
  }

  function handlePatchProfile({ name, about }) {
    api
      .patchProfile({ name, about })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка обновления профиля: ${err}`));
  }

  function handleUpdateAvatar(avatar) {
    api
      .patchAvatar(avatar)
      .then((newData) => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка обновления аватара: ${err}`));
  }

  function handleAddPlace({ name, link }) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка обновления данных профиля: ${err}`));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />

        {/* <!-- ПОПАП РЕДАКТИРОВАТЬ ПРОФИЛЬ --> */}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          buttonText="Сохранить"
          onPatchProfile={handlePatchProfile}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          buttonText="Создать"
          onAddPlace={handleAddPlace}
        />

        {/* <!-- ПОПАП ОТКРЫТИЕ КАРТОЧКИ --> */}
        <ImagePopup name="view" card={selectedCard} onClose={closeAllPopups} />

        {/* <!-- ПОПАП ЗАМЕНЫ АВАТАРА --> */}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          buttonText="Сохранить"
          onUpdateAvatar={handleUpdateAvatar}
        />

        {/* <!--ПОПАП ПОДТВЕРЖДЕНИЯ УДАЛЕНИЕ ФОТО--> */}
        <div className="popup popup_type_delete">
          <div className="popup__container">
            <button type="button" className="popup__button-close"></button>
            <h2 className="popup__title popup__title_delete">Вы уверены?</h2>
            <form
              action="#"
              className="popup__form popup__form-delete"
              name="popup-delete-card"
              noValidate
            >
              <button type="submit" className="popup__button-save">
                Да
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
