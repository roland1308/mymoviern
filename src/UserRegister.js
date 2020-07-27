import React from 'react';
import { TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Icon, Input, Layout, Text, Button } from '@ui-kitten/components';

const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

export default function UserRegister() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );

    return (
        <Layout>
            <Text category='h1'>
                User Log In
            </Text>
            <Input
                value={username}
                label='Username'
                placeholder='Place your Text'
                onChangeText={nextUsername => setUsername(nextUsername)}
            />
            <Input
                value={password}
                label='Password'
                placeholder='Place your Text'
                caption='Should contain at least 8 symbols'
                accessoryRight={renderIcon}
                captionIcon={AlertIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={nextPassword => setPassword(nextPassword)}
            />
            <Layout style={styles.buttons}>
                <Button status='success'>Log In</Button>
                <Button>Cancel</Button>
            </Layout>
        </Layout>
    );
};

const styles = StyleSheet.create({
    buttons: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
    },
})
