import { useState } from 'react';

function useInput(initialValue, options = {}) {
    const {
        props: propsOverride = {},
        placeholder = '',
        onChangeText: onChangeTextCb,
        validate: validateCb,
    } = options;

    const [value, setValue] = useState(initialValue);
    const [errorMessage, setErrorMessage] = useState(null);

    const setValueMod = (newValue) => {
        setErrorMessage(null);
        const oldValue = value;
        if (onChangeTextCb)
            onChangeTextCb(setValue, newValue, oldValue);
        else
            setValue(newValue);
    };

    const validate = () => {
        if (validateCb)
            return validateCb(value, setErrorMessage);
        return true;
    };

    const props = {
        value,
        onChangeText: setValueMod,
        placeholder: placeholder,
        errorMessage,
        ...propsOverride,
    };

    return [props, validate, setValueMod];
}

export function useNumericInput(initialValue, options) {
    const [props, validate, setValue] = useInput(initialValue, {
        onChangeText(setValueRaw, newValue) {
            if (/\D/.test(newValue))
                return;
            setValueRaw(newValue);
        },
        ...options,
        props: {
            keyboardType: 'numeric',
            ...options.props,
        },
    });

    return [props, validate, setValue];
}

export const validateEmail = (email, setErrorMessage) => {
    // https://emailregex.com/
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) {
        setErrorMessage('Debes escribir un email válido');
        return false;
    }
    return true;
};

export const validateRequired = (value, setErrorMessage) => {
    if (value.trim() === '') {
        setErrorMessage('Requerido');
        return false;
    }
    return true;
};

export default useInput;
