import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, Text, View, FlatList } from 'react-native'
import styles from './styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { signOut } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfig';
import { AppContext } from '../../AppContext';
import { collection, getDocs, query } from 'firebase/firestore';

export default function HomeScreen(props) {

    const { setUser } = useContext(AppContext);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            let listUsers = []
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                listUsers.push(doc.data())
            });
            setUsers(listUsers)
        }

        getUsers()
    }, ['users'])

    const onLogoutPress = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
            });
    }
      
    const Item = ({title}) => (
        <View style={styles.card} >
          <Text style={styles.h3} >{title.fullName}</Text>
          <Text>{title.email}</Text>
        </View>
      );

    return (
        <View style={styles.container}>
                <View style={styles.list}>
                    <Text style={styles.h2} >Usuários Cadastrados:</Text>
                    <FlatList
                        data={users}
                        renderItem={({item}) => <Item title={item} />}
                        keyExtractor={item => item.id}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => onLogoutPress()}>
                    <Text style={styles.buttonTitle}>Log out</Text>
                </TouchableOpacity>
        </View>
    )
}