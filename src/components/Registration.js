import { useState } from "react";
import { Link } from "react-router-dom";

function Registration({ onRegistration }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleChangeEmail(evt) {
    setEmail(evt.target.value);
  }

  function handleChangePassword(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegistration(password, email);
  }

  return (
    <div className="form__container">
      <h2 className="popup__title form__title">Регистрация</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__input-container">
          <input
            type="email"
            name="registration-email"
            className="form__input form__input_theme_dark form__input_place_name"
            placeholder="Email"
            required
            value={email || ""}
            onChange={handleChangeEmail}
          />
          <span className="form__input-error registration-email-error"></span>
          <input
            type="password"
            name="registration-password"
            className="form__input form__input_theme_dark form__input_place_link"
            placeholder="Пароль"
            required
            value={password || ""}
            onChange={handleChangePassword}
          />
          <span className="form__input-error registration-password-error"></span>
        </div>

        <button className="form__button-save form__button-save_theme_dark">
          Зарегистрироваться
        </button>
      </form>
      <p className="form__option-text">
        Уже зарегистрированы?{" "}
        <Link className="form__link" to="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default Registration;
