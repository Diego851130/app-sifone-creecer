import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
function SifoneTextInputLogin(props, ref) {
    const { light, passw, user, errorMessage, containerStyle, setHidePass, textInputStyle, errorStyle, hidePass, background, ...otherProps } = props;

    return (
        <View>
            <View style={styles.textInputContainer} >
                <View style={styles.textInputContainerLeft} >

                    <TextInput
                        style={textInputStyle}
                        ref={ref}
                        {...otherProps}
                        placeholderTextColor="#E1E1E1"
                        secureTextEntry={hidePass ? true : false}
                        autoCapitalize="none" autoCorrect={false}
                    />
                </View>
                {passw &&
                    <Icon
                        style={styles.iconStyle}
                        name={hidePass ? 'eye-slash' : 'eye'}
                        size={15}
                        color={background ? background : "#00D2A4"}
                        onPress={() => setHidePass(!hidePass)}
                    />
                }
            </View>
            {errorMessage &&
                <Text style={StyleSheet.compose(styles.errorText, errorStyle)}>
                    {errorMessage}
                </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    textInputContainer: {
        borderRadius: 20,
        height: 40,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 9,
        marginHorizontal: 30
    },
    textInputContainerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconStyle: {
        paddingRight: 10,
        marginLeft: 10
    },
    textInput: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginRight: 10, textAlign: 'center'
    },
});

export default React.forwardRef(SifoneTextInputLogin);
