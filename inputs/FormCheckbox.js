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
        padding: 5,
    },
    checkboxLabel: { color: colors.black },
    checkboxLabelContainer: {},
    checkboxBoxStyle: {
        width: 17,
        height: 17,
        margin: 1,
    },
});

export default class FormCheckbox extends Component {
    static propTypes = {
        ...Checkbox.propTypes,
        checkboxStyle: React.PropTypes.oneOfType([
            Checkbox.propTypes.checkboxStyle,
            React.PropTypes.arrayOf(Checkbox.propTypes.checkboxStyle),
        ]),
        containerStyle: React.PropTypes.oneOfType([
            Checkbox.propTypes.containerStyle,
            React.PropTypes.arrayOf(Checkbox.propTypes.containerStyle),
        ]),
        labelContainerStyle: React.PropTypes.oneOfType([
            Checkbox.propTypes.labelContainerStyle,
            React.PropTypes.arrayOf(Checkbox.propTypes.labelContainerStyle),
        ]),
        labelStyle: React.PropTypes.oneOfType([
            Checkbox.propTypes.labelStyle,
            React.PropTypes.arrayOf(Checkbox.propTypes.labelStyle),
        ]),
    };

    static defaultProps = {
        checkedImage: require('../images/checkbox-checked.png'),
        uncheckedImage: require('../images/checkbox-unchecked.png'),
        customize: {},
    };

    render() {
        const CheckBoxComponent = this.props.component ? this.props.component : Checkbox;

        return (
            <CheckBoxComponent
                {...this.props}
                containerStyle={StyleSheet.flatten([
                    styles.checkboxContainerStyle,
                    this.props.customize.FormCheckboxContainerStyle,
                    this.props.containerStyle,
                ])}
                checkboxStyle={StyleSheet.flatten([
                    styles.checkboxBoxStyle,
                    this.props.customize.FormCheckboxCheckboxStyle,
                    this.props.checkboxStyle,
                ])}
                labelContainerStyle={StyleSheet.flatten([
                    styles.checkboxLabelContainer,
                    this.props.customize.FormCheckboxLabelContainerStyle,
                    this.props.labelContainerStyle,
                ])}
                labelStyle={StyleSheet.flatten([
                    styles.checkboxLabel,
                    this.props.customize.labelStyle,
                    this.props.customize.FormCheckboxLabelStyle,
                    this.props.labelStyle,
                ])}
                underlayColor={this.props.underlayColor || this.props.customize.FormCheckboxUnderlayColor || colors.touchableUnderlayColor}
            />
        );
    }
}
