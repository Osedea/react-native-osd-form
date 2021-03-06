import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import Button from 'react-native-osd-simple-button';

import colors from '../colors';
import { formButtonAcceptedTypes } from './types';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderColor: colors.lighterGrey,
    },
});

export default class FormButton extends Component {
    static acceptedTypes = formButtonAcceptedTypes;

    static propTypes = {
        component: React.PropTypes.element,
        inputContainerStyle: View.propTypes.style,
        type: React.PropTypes.oneOf(this.acceptedTypes),
        ...Button.propTypes,
        onPress: (props, propName, componentName) => {
            if (propName === 'onPress' && props.type !== 'submit' && !props.onPress) {
                return new Error(
                    `Invalid prop \`${propName}\` supplied to \`${componentName}\`.`
                );
            }

            return null;
        },
    };

    static defaultProps = {
        customize: {},
    };

    createPressHandler = () => {
        if (this.props.type === 'submit') {
            return this.props.onSubmit;
        } else {
            return this.props.onPress;
        }
    }

    render() {
        const ButtonComponent = this.props.component ? this.props.component : Button;

        return (
            <ButtonComponent
                {...this.props}
                underlayColor={this.props.customize.FormButtonUnderlayColor}
                containerStyle={[
                    styles.container,
                    this.props.customize.FormButtonContainerStyle,
                    this.props.containerStyle,
                ]}
                textContainerStyle={[
                    this.props.customize.FormButtonTextContainerStyle,
                    this.props.textContainerStyle,
                ]}
                textStyle={[
                    this.props.customize.FormButtonTextStyle,
                    this.props.textStyle,
                ]}
                onPress={this.createPressHandler()}
            />
        );
    }
}
