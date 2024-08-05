import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native';



const UserForm = ({ onSubmit, initialUser = null }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [editing, setEditing] = useState(false); 

    // Added useEffect to handle initialUser
  useEffect(() => {
    if (initialUser) {
      setFirstName(initialUser.firstName);
      setLastName(initialUser.lastName);
      setPhoneNumber(initialUser.phoneNumber);
      setEmail(initialUser.email);
      setRole(initialUser.role);
    }
  }, [initialUser]);
  
    const handleSubmit = () => {
      const nameRegex = /^[a-zA-Zא-ת\s]+$/;
      const phoneRegex = /^[0-9]+$/;
  
      if (!nameRegex.test(firstName)) {
        alert('First Name can contain only letters');
        return;
      }

      if (!nameRegex.test(lastName)) {
        alert('Last Name can contain only letters');
        return;
      }
  
      if (!phoneRegex.test(phoneNumber)) {
        alert('Phone number can contain only numbers');
        return;
      }
  
      onSubmit({ firstName, lastName, phoneNumber, email, role });
    };
  
    return (
      <View style={styles.form}>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Manager" value="Manager" />
          <Picker.Item label="Waiter" value="Waiter" />
        </Picker>
        <Button title="Save" onPress={handleSubmit} />
      </View>
    );

  };

  const styles = StyleSheet.create({
      form: {
        padding: 2,
      },
      input: {
        height: 45,
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: 10,
        padding: 10,
        fontSize: 20,           
        fontWeight: 'bold',    
        color: 'black',    
      },
      saveButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 100,
        alignItems: 'center',
      },
      saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
});

export default UserForm;
