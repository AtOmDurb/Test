import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <h1>Панель администратора</h1>
      <p>Добро пожаловать, {user?.username}!</p>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};

export default AdminPanel;