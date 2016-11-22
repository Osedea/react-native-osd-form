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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#DDDDDD',
    },
    platform: {
        textAlign: 'center',
    },
});

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

AppRegistry.registerComponent('example', () => example);
