import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import UserForm from './UserForm';

const App = () => {
  const [users, setUsers] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', email: 'john@example.com', role: 'Manager' },
    { id: 2, firstName: 'Jane', lastName: 'Doe', phoneNumber: '09876543', email: 'jane@example.com', role: 'Waiter' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addUser = (user) => {
    setUsers([...users, { id: Date.now(), ...user }]);
    setIsModalOpen(false);
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.role}</Text>
      <TouchableOpacity onPress={() => deleteUser(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>First Name</Text>
        <Text style={styles.headerCell}>Last Name</Text>
        <Text style={styles.headerCell}>Phone Number</Text>
        <Text style={styles.headerCell}>Email</Text>
        <Text style={styles.headerCell}>Role</Text>
        <Text style={styles.headerCell}></Text>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity onPress={() => setIsModalOpen(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add User</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalOpen} onBackdropPress={() => setIsModalOpen(false)}>
        <View style={styles.modalContent}>
          <UserForm onSubmit={addUser} />
          <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
