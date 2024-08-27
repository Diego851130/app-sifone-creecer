import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
export default function SifoneButton(props) {
    const {
        style,
        textStyle,
        variant,
        children,
        textProps,
        disabled = false,
        formed,
        ...otherProps
    } = props;


    const variantOrDefault = variant !== undefined ? variant : 'outlined';

    const stylesByVariant = {
        outlined: {
            button: [baseStyles.button, baseStyles.outlined],
            text: [baseStyles.text],
        },
        darkBlue: {
            button: [formed ? baseStyles.buttonFormed : baseStyles.button, baseStyles.darkBlue],
            text: [baseStyles.text],
        },
        whiteShaddown: {
            button: [baseStyles.button, baseStyles.whiteShaddown],
            text: [baseStyles.text],
        },
        iphoneWhiteShaddown: {
            button: [baseStyles.button, baseStyles.iphoneWhiteShaddown],
            text: [baseStyles.text],
        },
        grayScanBotton: {
            button: [baseStyles.button, baseStyles.grayScanBotton],
            text: [baseStyles.text],
        },
        filled: {
            button: [baseStyles.button, baseStyles.filled],
            text: [baseStyles.text, baseStyles.textFilled],
        },
        bordered: {
            button: [baseStyles.button, baseStyles.filled, baseStyles.bordered],
            text: [baseStyles.text, baseStyles.textBordered],
        },
        primary: {
            button: [baseStyles.button, baseStyles.filled, baseStyles.primary],
            text: [baseStyles.text, baseStyles.textBordered],
        },
    };

    let specificStyles = stylesByVariant[variantOrDefault];

    if (specificStyles === undefined) {
        console.warn("Rendering button with invalid variant: ", variant);
        specificStyles = stylesByVariant['outlined'];
    }

    const touchableRef = useRef(null);


    return (
        <TouchableOpacity
            style={StyleSheet.compose(specificStyles.button, style)}
            accessibilityRole='button'
            disabled={disabled}
            ref={touchableRef}
            {...otherProps}
        >

            <Text style={StyleSheet.compose(specificStyles.text, textStyle)} {...textProps}>
                {children}
            </Text>

        </TouchableOpacity>
    );
}

const baseStyles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 5,
        borderRadius: 25,
        borderWidth: 0,
        width: '80%',
        alignSelf: 'center'
    },
    buttonFormed: {
        padding: 15,
        margin: 5,
        borderRadius: 5,
        borderWidth: 0,
        width: "50%",
        alignSelf: "center"
    },
    darkBlue: {
        borderWidth: 0,
        backgroundColor: '#0D86FE',
        color: "white"
    },
    whiteShaddown: {
        borderWidth: 0,
        // borderColor: 'red',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 20 },
        shadowOpacity: 1,
        shadowRadius: 23,
        elevation: 4,
        padding: 18,
    },
    iphoneWhiteShaddown: {
        borderWidth: 0,
        backgroundColor: 'white',
        padding: 18,
    },
    grayScanBotton: {
        borderWidth: 1,
        backgroundColor: 'white',
        opacity: 1,
    },
    outlined: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    filled: {
        borderColor: '#000000',
        backgroundColor: '#000000',
    },
    bordered: {
        borderColor: 'black',
    },
    primary: {
        borderColor: 'blue',
    },
    text: {
        fontSize: 13,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        // textTransform: 'uppercase',
    },
    textFilled: {
        color: 'white',
    },
    textBordered: {
        color: 'black',
    },
});
