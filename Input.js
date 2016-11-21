import React, { Component } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Button from 'react-native-osd-simple-button';

import Error from './Error';
import colors from './colors';
import { validateInput } from './validation';

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        backgroundColor: colors.transparent,
        color: colors.white,
        marginBottom: 2,
    },
    inputContainer: {
        marginTop: Platform.OS === 'ios'
            ? 10
            : 0,
    },
    field: {},
});

export default class Input extends Component {
    static propTypes = {
        asModal: React.PropTypes.bool,
        containerStyle: View.propTypes.style,
        displayErrorsGlobally: React.PropTypes.bool,
        errorContainerStyle: View.propTypes.style,
        errorStyle: Text.propTypes.style,
        initialValue: React.PropTypes.any,
        label: React.PropTypes.string,
        labelContainerStyle: View.propTypes.style,
        labelStyle: Text.propTypes.style,
        name: React.PropTypes.string.isRequired,
        noValidate: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        onFormChange: React.PropTypes.func.isRequired,
        onInputEnd: React.PropTypes.func.isRequired,
        validationErrorMessages: React.PropTypes.arrayOf(React.PropTypes.string),
        validationFunctions: React.PropTypes.arrayOf(React.PropTypes.func),
        value: React.PropTypes.any,
    };

    static defaultProps = {
        validationFunctions: [],
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.initialValue || props.value,
            error: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('value')) {
            this.setState({ value: nextProps.value });
        }
    }

    handleValidation = () => {
        if (!this.props.noValidate && this.state.value) {
            this.validateInput(this.state.value);
        }
    };

    handleInputEnd = () => {
        if (!this.props.onBlur) {
            // This is an edge case for FormTextInputs
            this.handleValidation();
        }

        if (this.props.onInputEnd) {
            this.props.onInputEnd(this.props);
        }
    };

    handleChange = (value) => {
        if (this.props.onChange) {
            this.props.onChange(value);
        }

        this.setState({
            value,
            error: null,
        });

        if (this.props.onFormChange) {
            this.props.onFormChange({
                name: this.props.name,
                value,
            });
        }

        if (this.props.asModal) {
            this.handlehideModal();
        }
    };

    handleRef = (component) => {
        component.validateInput = this.validateInput;

        this.props.onRef(component, this.props.name);
    }

    validateInput = (valueToCheck) => {
        const { error, value } = validateInput(this.props, valueToCheck);

        if (this.props.onFormChange) {
            this.props.onFormChange({
                name: this.props.name,
                value,
                error,
            });
        }

        this.setState({ error });

        return {
            error,
            value,
        };
    }

    // createInputFocusHandler = (input) => () => {
    //     if (this.formRefs[input.name]) {
    //         this.focusedInput = this.formRefs[input.name];
    //     }
    //
    //     if (input.onFocus) {
    //         input.onFocus();
    //     }
    // }

    handleShowModal = () => {
        this.setState({ modalVisible: true });
    };
    handlehideModal = () => {
        this.setState({ modalVisible: false });
    };

    render(input) {
        const content = (
            <View
                style={[
                    styles.inputContainer,
                    this.props.globalStyles
                        ? this.props.globalStyles.containerStyle
                        : null,
                    this.props.containerStyle,
                ]}
            >
                {this.props.label
                    ? <View
                        style={[
                            styles.labelContainer,
                            this.props.globalStyles
                                ? this.props.globalStyles.labelContainerStyle
                                : null,
                            this.props.labelContainerStyle,
                        ]}
                    >
                        <Text
                            style={[
                                styles.label,
                                this.props.globalStyles
                                    ? this.props.globalStyles.labelStyle
                                    : null,
                                this.props.labelStyle,
                            ]}
                        >
                            {this.props.label}
                        </Text>
                    </View>
                    : null
                }
                {input}
                {!this.props.displayErrorsGlobally && this.state.error
                    ? <Error
                        style={[
                            this.props.globalStyles
                                ? this.props.globalStyles.errorStyle
                                : null,
                            this.props.errorStyle,
                        ]}
                        containerStyle={[
                            this.props.globalStyles
                                ? this.props.globalStyles.errorContainerStyle
                                : null,
                            this.props.errorContainerStyle,
                        ]}
                        error={this.state.error}
                    />
                    : null
                }
            </View>
        );

        if (this.props.asModal) {
            return (
                <View style={styles.modalButtonContainer}>
                    <Button
                        containerStyle={styles.field}
                        onPress={this.handleShowModal}
                    >
                        <Text>{`Value: ${this.state.value}`}</Text>
                    </Button>
                    <Modal
                        visible={this.state.modalVisible}
                    >
                        {content}
                    </Modal>
                </View>
            );
        }

        return content;
    }
}
