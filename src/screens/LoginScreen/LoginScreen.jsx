import React, { useContext, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import styles from './styles';
import { AppContext } from '../../AppContext';
import { errorAlert } from '../../utils/utils';

export default function LoginScreen({navigation}) {

    const { setUser } = useContext(AppContext);

    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = async () => {
        Keyboard.dismiss()
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (response) => {
                if (response.user.emailVerified) {
                    const uid = response.user.uid;
                    try {
                        const docRef = doc(db, "users", uid);
                        const user = await getDoc(docRef);
                        if (user.exists()) {
                            setUser(user.data());
                        }
                        else {
                            errorAlert("Ops..!! Pengguna tidak ditemukan!");
                        }
                    } catch (error) {
                        console.log(error);
                        errorAlert("Maaf.. Terjadi kesalahan internal!");
                    }
                }
                else {
                    errorAlert("Ops..!! Email belum diverifikasi!")
                }
            })
            .catch(error => {
                console.log(error);
                errorAlert("Ops..!! Email atau password salah!");
            })
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
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}