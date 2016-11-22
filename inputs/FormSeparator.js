import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import colors from '../colors';
import { formSeparatorType } from './types';

const styles = StyleSheet.create({
    separator: {
        backgroundColor: colors.separator,
        height: 1,
        marginTop: 15,
        marginBottom: 5,
    },
});

export default class FormSeparator extends Component {
    static type = formSeparatorType;

    static propTypes = { style: View.propTypes.style };

    static defaultProps = {
        customize: {},
    };

    render() {
        return (
            <View
                style={[
                    styles.separator,
                    this.props.customize.FormSeparatorStyle,
                    this.props.style,
                ]}
            />
        );
    }
}
