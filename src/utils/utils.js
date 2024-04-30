import { Alert } from 'react-native'

export const errorAlert = (title, message) =>
    Alert.alert(title, message, [
        { text: 'OK' }
    ]
);