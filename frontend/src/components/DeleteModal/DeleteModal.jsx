import './DeleteModal.css';

const DeleteModal = ({ onDelete, onClose }) => {
    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to remove this spot?</p>
                <div className="delete-modal-buttons">
                    <button className="delete-yes" onClick={onDelete}>Yes (Delete Spot)</button>
                    <button className="delete-no" onClick={onClose}>No (Keep Spot)</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;