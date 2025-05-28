import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Table, Button, Modal, Form, Input, Select, message, Tabs, Tag, Space } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentTab, setCurrentTab] = useState('users');
  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [usersRes, groupsRes, disciplinesRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/groups'),
        axios.get('/api/admin/disciplines')
      ]);
      setUsers(usersRes.data);
      setGroups(groupsRes.data);
      setDisciplines(disciplinesRes.data);
    } catch (error) {
      message.error('Ошибка загрузки данных');
    }
  };

  const userColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Имя', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'admin' ? 'red' : role === 'teacher' ? 'blue' : 'green'}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit('users', record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete('users', record.id)} />
        </Space>
      )
    }
  ];

  const groupColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Дисциплина',
      dataIndex: 'discipline_id',
      key: 'discipline_id',
      render: id => disciplines.find(d => d.id === id)?.title || 'Не указано'
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit('groups', record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete('groups', record.id)} />
        </Space>
      )
    }
  ];

  const disciplineColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Название', dataIndex: 'title', key: 'title' },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit('disciplines', record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete('disciplines', record.id)} />
        </Space>
      )
    }
  ];

  const handleAdd = (type) => {
    setCurrentItem(null);
    setCurrentTab(type);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (type, item) => {
    setCurrentItem(item);
    setCurrentTab(type);
    form.setFieldsValue(item);
    setIsModalVisible(true);
  };

  const handleDelete = async (type, id) => {
    Modal.confirm({
      title: `Удалить ${getTypeName(type)}?`,
      content: 'Это действие нельзя отменить',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await axios.delete(`/api/${type}/${id}`);
          message.success('Удалено успешно');
          fetchData();
        } catch (error) {
          message.error('Ошибка удаления');
        }
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (currentItem) {
        await axios.put(`/api/${currentTab}/${currentItem.id}`, values);
        message.success('Изменения сохранены');
      } else {
        await axios.post(`/api/${currentTab}`, values);
        message.success('Создано успешно');
      }

      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Ошибка: ' + (error.response?.data?.message || error.message));
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'users': return 'пользователя';
      case 'groups': return 'группу';
      case 'disciplines': return 'дисциплину';
      default: return '';
    }
  };

  const renderForm = () => {
    switch (currentTab) {
      case 'users':
        return (
          <>
            <Form.Item name="username" label="Имя" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            {!currentItem && (
              <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
            )}
            <Form.Item name="role" label="Роль" rules={[{ required: true }]}>
              <Select>
                <Option value="student">Студент</Option>
                <Option value="teacher">Преподаватель</Option>
                <Option value="admin">Администратор</Option>
              </Select>
            </Form.Item>
          </>
        );
      case 'groups':
        return (
          <>
            <Form.Item name="name" label="Название" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="discipline_id" label="Дисциплина" rules={[{ required: true }]}>
              <Select>
                {disciplines.map(d => (
                  <Option key={d.id} value={d.id}>{d.title}</Option>
                ))}
              </Select>
            </Form.Item>
          </>
        );
      case 'disciplines':
        return (
          <>
            <Form.Item name="title" label="Название" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Описание">
              <Input.TextArea />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h1>Доступ запрещен</h1>
        <p>У вас нет прав для просмотра этой страницы</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Панель администратора</h1>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Выйти ({user.username})
        </Button>
      </div>

      <Tabs defaultActiveKey="users" onChange={setCurrentTab}>
        <TabPane tab={<span><UserOutlined />Пользователи</span>} key="users">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAdd('users')}
            style={{ marginBottom: '16px' }}
          >
            Добавить пользователя
          </Button>
          <Table dataSource={users} columns={userColumns} rowKey="id" />
        </TabPane>
        <TabPane tab={<span><TeamOutlined />Группы</span>} key="groups">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAdd('groups')}
            style={{ marginBottom: '16px' }}
          >
            Добавить группу
          </Button>
          <Table dataSource={groups} columns={groupColumns} rowKey="id" />
        </TabPane>
        <TabPane tab={<span><BookOutlined />Дисциплины</span>} key="disciplines">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAdd('disciplines')}
            style={{ marginBottom: '16px' }}
          >
            Добавить дисциплину
          </Button>
          <Table dataSource={disciplines} columns={disciplineColumns} rowKey="id" />
        </TabPane>
      </Tabs>

      <Modal
        title={currentItem ? `Редактировать ${getTypeName(currentTab)}` : `Добавить ${getTypeName(currentTab)}`}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          {renderForm()}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;