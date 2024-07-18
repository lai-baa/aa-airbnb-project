import './DeleteModal.css';

const DeleteModal = ({ onDelete, onClose, message, type }) => {
    return (
        <div className="delete-modal-big-div">
            <div className="delete-modal">
                <h2>Confirm Delete</h2>
                <p>{message}</p>
                <div className="delete-modal-buttons">
                    <button className="delete-yes" onClick={onDelete}>Yes (Delete {type})</button>
                    <button className="delete-no" onClick={onClose}>No (Keep {type})</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;