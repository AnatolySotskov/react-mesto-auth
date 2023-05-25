import registrationDoneImg from "../images/registration-good.svg";
import registrationFailImg from "../images/registration-fail.svg";
import usePopupClose from "../hooks/usePopupClose";

function InfoTooltip({ isOpen, onClose, isDoneSignUp, infoText }) {
  usePopupClose(isOpen, onClose);
  return (
    <div className={`popup ${isOpen && "popup_visible"}`}>
      <div className="popup__container popup__container_infotoltip">
        <button
          type="button"
          className="popup__button-close"
          onClick={onClose}
        />
        <img
          className="popup__icon"
          src={isDoneSignUp ? registrationDoneImg : registrationFailImg}
          alt={isDoneSignUp ? "Иконка успешно" : "Иконка ошибка"}
        />
        <h2 className="popup__title popup__title_infotoltip">{infoText}</h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
