import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { api } from '../utils/Api';
import { CurrentUserContext } from '../context/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmDeleteCard, setIsConfirmDeleteCard] = React.useState(false);
  const [isConfirmating, setIsConfirmatiing] = React.useState(false);


  React.useEffect(() => {
    setIsLoading(true);
    Promise.all([api.getInitialUser(), api.getInitialCards()])
    .then(([userData, initialCards]) => {
      //установка данных пользователя
      setCurrentUser(userData);
      setCards(initialCards)
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => setIsLoading(false));
  }, []);

  function handleCardLike(card) {
                                    
    const isLiked = card.likes.some(i => i._id === currentUser._id); // Снова проверяем, есть ли уже лайк на этой карточке
                                    
    if (!isLiked) {
      api.getAddLike(card._id) // Отправляем запрос в API и получаем обновлённые данные карточки
      .then((newCard) => {
        setCards((prevCards) => {  //Обновляем стейт через колбек по предидущему значению стейта без замыкания
          return prevCards.map((c) => c._id === card._id ? newCard : c);
        })
      })
      .catch(err => {
        console.log(err)
      });
    } else {
      api.getRemoveLike(card._id)
      .then((newCard) => {     
        setCards((prevCards) => {  //Обновляем стейт через колбек по предидущему значению стейта без замыкания
          return prevCards.map((c) => c._id === card._id ? newCard : c);
        })                               
      })
      .catch(err => {
        console.log(err)
      });
    }
  }

  function handleCardDelete(card) {
    setIsConfirmatiing(true);
    api.getDeleteCard(card._id)
    .then(() => {
      setCards((prevCards) => {  //Обновляем стейт через колбек по предидущему значению стейта без замыкания
        return prevCards.filter(c => c._id !== card._id);
      })
      closeAllPopups();
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => setIsConfirmatiing(false));
  }

  function handleUpdateUser(data) {
    setIsConfirmatiing(true);
    api.getChangeUserInfo(data)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => setIsConfirmatiing(false));
  }

  function handleUpdateAvatar(link) {
    setIsConfirmatiing(true);
    api.getChangeAvatar(link)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => setIsConfirmatiing(false));
  }

  function handleAddPlaceSubmit(cardItem) {
    setIsConfirmatiing(true);
    api.getNewCard(cardItem)
    .then((newCardItem) => {
      setCards([newCardItem, ...cards]);
      closeAllPopups();
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => setIsConfirmatiing(false));
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleImageClick() {
    setIsImagePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleConfirmDelete(card) {
    setSelectedCard(card);
  }

  function handleTrashClick() {
    setIsConfirmDeleteCard(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard(null);
    setIsConfirmDeleteCard(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container">
          <Header />
          <Main 
            onEditProfile={handleEditProfileClick}
            onEditAvatar={handleEditAvatarClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onImageClick={handleImageClick}
            cards={cards}
            onCardClickLike={handleCardLike}
            onCardDelete={handleConfirmDelete}
            onTrashClick={handleTrashClick}
            isLoading={isLoading}/>
          <Footer />
        </div>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isConfirm={isConfirmating}/>
        <EditProfilePopup />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isConfirm={isConfirmating}/>
        <EditAvatarPopup />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isConfirm={isConfirmating}/>
        <AddPlacePopup />
        <ConfirmationPopup
          isOpen={isConfirmDeleteCard}
          onClose={closeAllPopups}
          onConfirmDelete={handleCardDelete}
          card={selectedCard}
          isConfirm={isConfirmating}/>
        <ConfirmationPopup />
        <ImagePopup
          card={selectedCard} 
          isOpen={isImagePopupOpen} 
          onClose={closeAllPopups}/>
        <ImagePopup/> 
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;



