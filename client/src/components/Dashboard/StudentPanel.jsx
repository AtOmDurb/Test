import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const StudentPanel = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <h1>Панель Судента</h1>
      <p>Добро пожаловать, {user?.username}!</p>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};

export default StudentPanel;