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
import * as Auth from "../utils/Auth";
import Registration from "./Registration";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";

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

  const [loggedIn, setLoggedIn] = useState(false);
  const [isDoneSignUp, setIsDoneSignUp] = useState(false);
  const [loggedEmail, setLoggedEmail] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  const handleCardClick = (props) => {
    setSelectedCard(props);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipOpen(false);
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

    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      Auth.checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedEmail(res.data.email);
            setLoggedIn(true);
            navigate("/");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [loggedIn]);

  const navigate = useNavigate();

  function handleRegistration(password, email) {
    Auth.register(password, email).then(
      (data) => {
        console.log(data);
        setIsDoneSignUp(true);
        setIsInfoTooltipOpen(true);
        navigate("/sign-in");
      },
      (err) => {
        console.log(`Ошибка регистрации: ${err}`);
        setIsDoneSignUp(false);
        setIsInfoTooltipOpen(true);
      }
    );
  }

  function handleAuthorization(password, email) {
    Auth.authorize(password, email).then(
      (data) => {
        setLoggedIn(true);
        localStorage.setItem("token", data.token);
        navigate("/");
      },
      (err) => console.log(`Ошибка авторизации: ${err}`)
    );
  }

  function onSignOut() {
    setLoggedIn(false);
    localStorage.removeItem("token");
    navigate("sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header loggedEmail={loggedEmail} onSignOut={onSignOut} />

        <Routes>
          <Route
            path="/sign-up"
            element={<Registration onRegistration={handleRegistration} />}
          />

          <Route
            path="/sign-in"
            element={<Login onAuthorization={handleAuthorization} />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                loggedIn={loggedIn}
              />
            }
          />

          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isDoneSignUp={isDoneSignUp}
          infoText={
            isDoneSignUp
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."
          }
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
