import React, { useState, useEffect } from 'react';               // Import React and hooks
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert} from 'react-native'; // Import necessary components from React Native
import Modal from 'react-native-modal';                           // Import Modal component from react-native-modal
import UserForm from './UserForm';                                // Import UserForm component
const IP = '192.168.1.11';                                        // Define IP address
const PORT = '3000';                                              // Define port
const API_URL = `http://${IP}:${PORT}/users`;                         // Define base AP_URL for API
type User = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
}
const App = () => {
  const [users, setUsers] = useState <User[]>([]);                // State to store users
  const [isModalOpen, setIsModalOpen] = useState(false);          // State to control add user modal visibility
  const [editingUser, setEditingUser] = useState<User | null>(null);           // State to store the user being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // State to control edit user modal visibility

  useEffect(() => {
    fetchUsers();                                                 // Fetch users on component mount
  }, []);                                                         // Empty dependency array ensures this runs only once

  const fetchUsers = async () => {
    // Function to fetch users from the server
    try {
      const response = await fetch(API_URL);                          // Fetch users
      const data = await response.json();                         // Parse JSON response
      setUsers(data);                                             // Update users state
    } catch (error) {
      console.error('Error fetching users:', error);              // Log any errors
    }
  };

  const addUser = async (user: User) => {
    // Function to add a new user
    try {
      const response = await fetch(API_URL, {
        method: 'POST',                                          // HTTP method
        headers: {
          'Content-Type': 'application/json',                    // Set content type to JSON
        },
        body: JSON.stringify(user),                              // Convert user object to JSON string
      });
      const newUser = await response.json();                     // Parse JSON response
      setUsers([...users, newUser]);                             // Add new user to state
      setIsModalOpen(false);                                     // Close add user modal
    } catch (error) {
      console.error('Error adding user:', error);                // Log any errors
    }
  };

  const deleteUser = async (id: string) => {
    // Function to delete a user
    Alert.alert(
      'Confirm Deletion',                                        // Alert title
      'Are you sure you want to delete this user?',              // Alert message
      [
        { text: 'Cancel', style: 'cancel' },                     // Cancel button
        {
          text: 'OK',
          onPress: async () => {
            // OK button
            try {
              await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',                                // HTTP method
              });
              setUsers(users.filter(user => user.id !== id));    // Remove user from state
            } catch (error) {
              console.error('Error deleting user:', error);      // Log any errors
            }
          },
        },
      ],
      { cancelable: false }                                      // Disable outside touch to cancel
    );
  };

  const updateUser = async (user: User) => {
    // Function to update a user
    try {
      const response = await fetch(`${API_URL}/${editingUser?.id}`, {
        method: 'PUT',                                           // HTTP method
        headers: {
          'Content-Type': 'application/json',                    // Set content type to JSON
        },
        body: JSON.stringify(user),                              // Convert user object to JSON string
      });
      const updatedUser = await response.json();                 // Parse JSON response
      setUsers(users.map((u) => (u.id === editingUser?.id ? updatedUser : u))); // Update user in state
      setIsEditModalOpen(false);                                 // Close edit user modal
      setEditingUser(null);                                      // Clear editing user state
    } catch (error) {
      console.error('Error updating user:', error);              // Log any errors
    }
  };

  const openEditModal = (user: User) => {
    // Function to open the edit user modal
    setEditingUser(user);                                        // Set the user to be edited
    setIsEditModalOpen(true);                                    // Open edit user modal
  };

  const renderItem = ({ item, index }: {
    item: User;
    index: number;
  }) => (
    // Function to render each user in the list
    <View style={[styles.row, { backgroundColor: index % 2 === 0 ? '#a5a8a5' : '#ffffff' }]}>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.role}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(item.id)} activeOpacity={1}>
        <Text style={styles.deleteButton}>delete</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateButton} onPress={() => openEditModal(item)} activeOpacity={1}>
        <Text style={styles.updateButton}>update</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // Main component return
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>First Name</Text>
            <Text style={styles.headerCell}>Last Name</Text>
            <Text style={styles.headerCell}>Phone Number</Text>
            <Text style={styles.headerCell}>Email</Text>
            <Text style={styles.headerCell}>Role</Text>
            <Text style={styles.headerCell}>delete</Text>
            <Text style={styles.headerCell}>update</Text>
          </View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            style={styles.flatList}
          />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => setIsModalOpen(true)} style={styles.addButton} activeOpacity={1}>
        <Text style={styles.addButtonText}>Add User</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalOpen} onBackdropPress={() => setIsModalOpen(false)}>
        <View style={styles.modalContent}>
          <UserForm onSubmit={addUser} />
          <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeButton} activeOpacity={1}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={isEditModalOpen} onBackdropPress={() => setIsEditModalOpen(false)}>
        <View style={styles.modalContent}>
          <UserForm onSubmit={updateUser} initialUser={editingUser} />
          <TouchableOpacity onPress={() => setIsEditModalOpen(false)} style={styles.closeButton} activeOpacity={1}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                     // Flex container to take up all available space
    padding: 20,                 // Padding around the container
  },
  table: {
    borderWidth: 1,              // Border width for the table
    borderColor: '#020302',      // Border color
    width: '100%',               // Table width
  },
  headerRow: {
    flexDirection: 'row',        // Align items in a row
    backgroundColor: '#f8f8f8',  // Background color for the header row
    borderBottomWidth: 2,        // Border width at the bottom
    borderColor: '#020302',      // Border color
  },
  headerCell: {
    width: 120,                  // Fixed width for each column
    justifyContent: 'center',    // Center align text vertically
    alignItems: 'center',        // Center align text horizontally
    borderRightWidth: 1,         // Border width at the right
    borderColor: '#020302',      // Border color
    padding: 10,                 // Padding inside the cell
    fontSize: 14,                // Font size
    fontWeight: 'bold',          // Font weight
    color: '#333',               // Text color
    textAlign: 'center',         // Center align text horizontally
  },
  headerText: {
    fontWeight: 'bold',          // Bold font weight for the header text
    textAlign: 'center',         // Center align text horizontally
  },
  row: {
    flexDirection: 'row',        // Align items in a row
    borderBottomWidth: 1,        // Border width at the bottom
    borderColor: '#020302',      // Border color
  },
  cell: {
    width: 120,                  // Fixed width for each column
    justifyContent: 'center',    // Center align text vertically
    alignItems: 'center',        // Center align text horizontally
    borderRightWidth: 1,         // Border width at the right
    borderColor: '#020302',      // Border color
    padding: 10,                 // Padding inside the cell
    fontSize: 16,                // Font size for the cell text
    fontWeight: 'bold',          // Font weight for the cell text
    color: '#333',               // Text color
    textAlign: 'center',         // Center align text horizontally
  },
  cellText: {
    textAlign: 'center',         // Center align text horizontally
    fontWeight: 'bold',          // Bold font weight for the text
    fontSize: 1,                 // Font size (probably should be adjusted)
    color: '#333',               // Text color
  },
  deleteButton: {
    backgroundColor: '#ff4747',  // Background color for delete button
    padding: 1,                  // Padding inside the button
    borderRadius: 1,             // Border radius for rounded corners
    justifyContent: 'center',    // Center align content vertically
    alignItems: 'center',        // Center align content horizontally
    width: 120,                  // Fixed width for the button
    textAlign: 'center',         // Center align text horizontally
    fontSize: 16,                // Font size for the button text
    fontWeight: 'bold',          // Font weight for the button text
    color: '#333',               // Text color
  },
  updateButton: {
    backgroundColor: '#77e67f',  // Background color for update button
    padding: 1,                  // Padding inside the button
    borderRadius: 1,             // Border radius for rounded corners
    justifyContent: 'center',    // Center align content vertically
    alignItems: 'center',        // Center align content horizontally
    width: 120,                  // Fixed width for the button
    textAlign: 'center',         // Center align text horizontally
    fontSize: 16,                // Font size for the button text
    fontWeight: 'bold',          // Font weight for the button text
    color: '#333',               // Text color
  },
  deleteButtonText: {
    color: 'white',              // Text color for delete button
    fontWeight: 'bold',          // Font weight for the text
  },
  addButton: {
    backgroundColor: 'blue',     // Background color for add button
    padding: 15,                 // Padding inside the button
    marginTop: 20,               // Margin at the top
    borderRadius: 100,           // Border radius for rounded corners
    alignItems: 'center',        // Center align content horizontally
  },
  addButtonText: {
    color: 'white',              // Text color for add button
    fontWeight: 'bold',          // Font weight for the text
  },
  modalContent: {
    backgroundColor: 'white',    // Background color for modal content
    padding: 22,                 // Padding inside the modal
    justifyContent: 'center',    // Center align content vertically
    alignItems: 'center',        // Center align content horizontally
    borderRadius: 25,            // Border radius for rounded corners
    borderColor: 'rgba(0, 0, 0, 0.1)', // Border color with transparency
  },
  closeButton: {
    backgroundColor: 'grey',     // Background color for close button
    padding: 14,                 // Padding inside the button
    borderRadius: 5,             // Border radius for rounded corners
    marginTop: 20,               // Margin at the top
  },
  closeButtonText: {
    color: 'white',              // Text color for close button
    fontWeight: 'bold',          // Font weight for the text
  },
  flatList: {
    flex: 1,                     // Flex to take up all available space
  },
});

export default App;              // Export the component as default

