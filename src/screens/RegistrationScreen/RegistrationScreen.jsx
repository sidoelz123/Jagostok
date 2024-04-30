import React, { useContext, useState } from 'react'
import { ActivityIndicator, Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfig';
import styles from './styles';
import { setDoc, doc, collection } from 'firebase/firestore';
import { errorAlert } from '../../utils/utils';

export default function RegistrationScreen({navigation}) {

    const [loading, setLoading] = useState(false)

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = async () => {
        Keyboard.dismiss()
        if (password !== confirmPassword) {
            alert("Sandi Anda tidak cocok!")
            return
        }

        setLoading(true)
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (response) => {
                const uid = response.user.uid
                const user = { id: uid, email, fullName };
                try {
                    const userRef = collection(db, "users");
                    await setDoc(doc(userRef, uid), user);
                    console.log("ID Anda: " + uid);

                    await sendEmailVerification(auth.currentUser);
                    navigation.navigate('Login')
                } catch (e) {
                    console.log("Error adding doc: " + e);
                    errorAlert("Maaf..! Terjadi kesalahan internal!");
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log("Error creating user/auth: " + errorMessage);
                errorAlert("Ups..!! Semua kolom harus diisi dengan benar!");
            });
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            {loading &&
                <View style={styles.loading}>
                    <ActivityIndicator size='large' />
                </View>
            }
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/sol.webp')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}