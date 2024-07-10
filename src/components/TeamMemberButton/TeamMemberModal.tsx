import React from 'react';
import styles from './TeamMemberModal.module.css';

interface TeamMemberModalProps {
  name: string;
  title: string;
  history: string;
  email: string;
  phone: string;
  onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ name, title, history, email, phone, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2><b>{name}</b></h2>
        <h3><b>{title}</b></h3>
        <p>{history}</p>
        <div className={styles.contactInfo}>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;