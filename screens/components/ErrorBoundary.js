import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

function Fallback(props) {
    const { error } = props;
    const styles = fallbackStyles;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.layout}>
                <Text style={styles.title}>Oops! Parece que sucedio un error</Text>
                <ScrollView style={styles.traceCont}>
                    {error.message &&
                        <Text style={styles.trace}>{error.message}</Text>
                    }
                    {error.trace && <>
                        <Text>{'\n\n\nTrace\n\n\n'}</Text>
                        <Text style={styles.trace}>{error.trace}</Text>
                    </>}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const fallbackStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    layout: {
        flex: 1,
        padding: 32,
        paddingTop: 48,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
    },
    traceCont: {
        flex: 1,
    },
});

class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null,
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error };
    }

    render() {
        const { hasError, error } = this.state;
        const { children } = this.props;
        if (hasError) {
            return <Fallback error={error} />;
        }

        return children;
    }
}

export default ErrorBoundary;
