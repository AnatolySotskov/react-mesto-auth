import { useState } from "react";

function Login({ onAuthorization }) {
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
    onAuthorization(password, email);
  }

  return (
    <div className="form__container">
      <h2 className="popup__title form__title">Вход</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__input-container">
          <input
            type="email"
            name="registration-email"
            className="form__input form__input_theme_dark"
            placeholder="Email"
            required
            value={email || ""}
            onChange={handleChangeEmail}
          />
          <input
            type="password"
            name="registration-password"
            className="form__input form__input_theme_dark"
            placeholder="Пароль"
            required
            value={password || ""}
            onChange={handleChangePassword}
          />
        </div>

        <button className="form__button-save form__button-save_theme_dark">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
