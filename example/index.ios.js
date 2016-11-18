/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import ExampleComponent from './ExampleComponent';

export default class example extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.platform}>{'iOS'}</Text>
                <ExampleComponent />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#999999',
    },
    platform: {
        textAlign: 'center',
    },
});

AppRegistry.registerComponent('example', () => example);
