import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ onCardClick, data, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = data.owner._id === currentUser._id;
  const isLiked = data.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClassName = `card__like ${
    isLiked && "card__like_active"
  }`;

  const handleCardClick = () => {
    onCardClick(data);
  };

  function handleLikeClick() {
    onCardLike(data);
  }

  function handleDeleteClick() {
    onCardDelete(data);
  }

  return (
    <article className="card">
      <img
        className="card__photo"
        src={data.link}
        alt={data.name}
        onClick={handleCardClick}
      />
      <div className="card__content">
        <h2 className="card__title">{data.name}</h2>
        <div className="card__like-block">
          <button
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <p className="card__like-count">{data.likes.length}</p>
        </div>
        {isOwn && (
          <button
            className="card__delete-button"
            type="button"
            onClick={handleDeleteClick}
          ></button>
        )}
      </div>
    </article>
  );
}

export default Card;
