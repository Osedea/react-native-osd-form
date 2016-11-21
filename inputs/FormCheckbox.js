import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import Checkbox from 'react-native-checkbox';

import colors from '../colors';

const styles = StyleSheet.create({
    checkboxContainerStyle: {
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    checkboxLabelContainer: {
    },
    checkboxLabel: { color: colors.white },
    checkboxBoxStyle: {
        width: 17,
        height: 17,
        margin: 1,
    },
});

export default class FormCheckbox extends Component {
    static propTypes = Checkbox.propTypes;

    static defaultProps = {
        checkedImage: require('../images/checkbox-checked.png'),
        uncheckedImage: require('../images/checkbox-unchecked.png'),
    };

    render() {
        const CheckBoxComponent = this.props.component ? this.props.component : Checkbox;

        return (
            <CheckBoxComponent
                {...this.props}
                containerStyle={StyleSheet.flatten([
                    styles.checkboxContainerStyle,
                    this.props.globalStyles
                        ? this.props.globalStyles.checkboxContainerStyle
                        : null,
                    this.props.containerStyle,
                ])}
                checkboxStyle={styles.checkboxBoxStyle}
                labelContainerStyle={StyleSheet.flatten([
                    styles.checkboxLabelContainer,
                    this.props.labelContainerStyle,
                ])}
                labelStyle={StyleSheet.flatten([
                    styles.checkboxLabel,
                    this.props.labelStyle,
                ])}
                underlayColor={colors.touchableUnderlayColor}
            />
        );
    }
}
