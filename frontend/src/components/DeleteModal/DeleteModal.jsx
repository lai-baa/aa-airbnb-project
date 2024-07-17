const DeleteModal = ({onDelete, onClose}) => {
    <div className="delete-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <button id="delete-button" onClick={onDelete}>Yes (Delete Spot)</button>
      <button className="keep-button" onClick={onClose}>No (Keep Spot)</button>
    </div>
};

export default DeleteModal;