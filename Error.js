import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import colors from './colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        borderRadius: 4,
    },
    error: {
        color: colors.red,
    },
});

export default class Error extends Component {
    static propTypes = {
        containerStyle: View.propTypes.style,
        error: React.PropTypes.string,
        style: Text.propTypes.style,
    };

    render() {
        return (
            <View
                style={[
                    styles.container,
                    this.props.containerStyle,
                ]}
            >
                <Text
                    style={[
                        styles.error,
                        this.props.style,
                    ]}
                >
                    {this.props.error}
                </Text>
            </View>
        );
    }
}
