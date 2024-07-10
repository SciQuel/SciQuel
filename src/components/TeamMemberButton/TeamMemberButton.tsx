import React, { useState } from 'react';
import styles from './TeamMemberButton.module.css';
import TeamMemberModal from './TeamMemberModal';

interface TeamMemberProps {
  name: string;
  title: string;
  index: number;
  elementNumber: number;
  history: string;
  email: string;
  phone: string;
}

const TeamMemberButton: React.FC<TeamMemberProps> = ({ name, title, index, elementNumber, history, email, phone }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initials = name.split(' ').map(word => word[0].toUpperCase()).join('');
  const backgroundColor = index % 2 === 0 ? 'white' : '#379DA2'; 

  return (
    <>
      <button 
        className={styles.teamMemberButton}
        style={{ backgroundColor }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className={styles.elementNumber}>{elementNumber}</div>
        <div className={styles.initials}>{initials}</div>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.title}>{title}</p>
      </button>
      {isModalOpen && (
        <TeamMemberModal
          name={name}
          title={title}
          history={history}
          email={email}
          phone={phone}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default TeamMemberButton;