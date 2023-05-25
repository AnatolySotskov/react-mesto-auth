import { apiSettings } from "./constants";

class Api {
  constructor(apiSettings) {
    this._token = apiSettings.token;
    this._address = apiSettings.address;
    this._headers = {
      authorization: this._token,
      "Content-Type": "application/json",
    };
  }

  _handleResponse = (res) => {
    if (res.ok) {
      return res.json();
    } else {
      Promise.reject(`Ошибка ${res.status}`);
    }
  };

  getCards() {
    return fetch(`${this._address}/cards`, {
      headers: this._headers,
    }).then(this._handleResponse);
  }

  getInfoUser() {
    return fetch(`${this._address}/users/me`, {
      headers: this._headers,
    }).then(this._handleResponse);
  }

  patchProfile({ name, about }) {
    return fetch(`${this._address}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    }).then(this._handleResponse);
  }

  patchAvatar(avatar) {
    return fetch(`${this._address}/users/me/avatar`, {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
      headers: this._headers,
    }).then(this._handleResponse);
  }

  addCard({ name, link }) {
    return fetch(`${this._address}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    }).then(this._handleResponse);
  }

  _setLike(id) {
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then(this._handleResponse);
  }

  _removeLike(id) {
    return fetch(`${this._address}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._handleResponse);
  }

  toggleLike(cardId, isLiked) {
    if (isLiked === true) {
      return this._removeLike(cardId);
    } else {
      return this._setLike(cardId);
    }
  }

  deleteCards(cardId) {
    return fetch(`${this._address}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._handleResponse);
  }
}

const api = new Api(apiSettings);

export default api