import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import Button from 'react-native-osd-simple-button';
import colors from '../colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderColor: colors.lighterGrey,
    },
});

export default class FormButton extends Component {
    static acceptedTypes = [
        'button',
        'submit',
    ];

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

    handlePress = () => {
        if (this.props.type === 'submit') {
            return this.handleSubmit;
        } else {
            return this.props.onPress;
        }
    }

    render() {
        const ButtonComponent = this.props.component ? this.props.component : Button;

        return (
            <ButtonComponent
                {...this.props}
                containerStyle={[
                    styles.container,
                    this.props.containerStyle,
                ]}
                onPress={this.handlePress()}
            />
        );
    }
}
