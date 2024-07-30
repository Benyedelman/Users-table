import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Modal from 'react-native-modal';
import UserForm from './UserForm';

const App = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://192.168.1.10:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async (user) => {
    try {
      const response = await fetch('http://192.168.1.10:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => {
            try {
              await fetch(`http://192.168.1.10:3000/users/${id}`, {
                method: 'DELETE',
              });
              setUsers(users.filter(user => user.id !== id));
            } catch (error) {
              console.error('Error deleting user:', error);
            }
          }
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ( {item} ) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.role}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.table}>
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
            style={styles.flatList}
          />
        </View>
      </ScrollView>
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
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  headerCell: {
    width: 120, // Set a fixed width for each column
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    width: 120,        // Set a fixed width for each column
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  cellText: {
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 1,
    borderRadius: 1,
    justifyContent: 'center', // Center align text vertically
    alignItems: 'center',     // Center align text horizontally
    width: 120,               // Ensure delete button fills the entire cell width
    textAlign: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 15,
    marginTop: 20,
    borderRadius: 100,
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
    borderRadius: 25,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    backgroundColor: 'grey',
    padding: 14,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
});

export default App;