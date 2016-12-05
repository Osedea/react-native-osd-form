import React, { Component } from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Button from 'react-native-osd-simple-button';
import { includes } from 'lodash';

import {
    formTextInputAcceptedTypes,
    formRangeInputType,
    formRadioType,
    formSwitchType,
} from './inputs/types';
import Error from './Error';
import colors from './colors';
import { validateInput } from './validation';

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        backgroundColor: colors.transparent,
        marginBottom: 2,
    },
    inputContainer: {
        marginTop: Platform.OS === 'ios'
            ? 10
            : 0,
    },
    switchInputContainer: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    switchInputLabelContainer: {
        flex: 1,
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.touchableUnderlayColor,
    },
    modalButtonContainerStyle: {},
    modalContentContainer: {
        backgroundColor: colors.white,
        borderRadius: 4,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: Dimensions.get('window').width - 10,
        padding: 10,
        shadowOffset: {
            height: 2,
        },
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        ...(Platform.OS === 'android'
            ? {
                borderWidth: 1,
                borderColor: colors.veryLightGrey,
            }
            : {}
        ),
    },
});

export default class Input extends Component {
    static propTypes = {
        asModal: React.PropTypes.bool,
        containerStyle: View.propTypes.style,
        displayErrorsGlobally: React.PropTypes.bool,
        errorContainerStyle: View.propTypes.style,
        errorStyle: Text.propTypes.style,
        initialValue: React.PropTypes.any,
        inputModalButtonContainerStyle: View.propTypes.style,
        inputModalButtonStyle: View.propTypes.style,
        inputModalButtonTextStyle: Text.propTypes.style,
        insertAfter: React.PropTypes.node,
        insertBefore: React.PropTypes.node,
        modalButtonLabel: React.PropTypes.string,
        modalContentContainerStyle: View.propTypes.style,
        modalStyle: View.propTypes.style,
        modalTransparent: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        noValidate: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        onFormChange: React.PropTypes.func.isRequired,
        onInputEnd: React.PropTypes.func.isRequired,
        type: React.PropTypes.string,
        validationErrorMessages: React.PropTypes.arrayOf(React.PropTypes.string),
        validationFunctions: React.PropTypes.arrayOf(React.PropTypes.func),
        value: React.PropTypes.any,
    };

    static defaultProps = {
        validationFunctions: [],
        customize: {},
        modalButtonLabel: 'Value =',
        defaultLabel: 'Choose an option',
    };

    constructor(props) {
        super(props);

        this.state = {
            value: props.initialValue || props.value,
            error: null,
            modalVisible: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('value')) {
            this.setState({
                value: nextProps.value,
                modalVisible: false,
            });
        }
    }

    handleValidation = () => {
        if (
            !this.props.noValidate
            && this.state.value
            && this.props.validationErrorMessages
            && this.props.validationFunctions
        ) {
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

        if (this.props.asModal) {
            this.handleHideModal();
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

        if (
            !includes(formTextInputAcceptedTypes, this.props.type)
            && !(this.props.type === formRangeInputType)
            && this.props.asModal
        ) {
            this.handleHideModal();
        }
    };

    handleRef = (component) => {
        if (component) {
            component.validateInput = this.validateInput;

            this.props.onRef(component, this.props.name);
        }
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
    handleHideModal = () => {
        this.setState({ modalVisible: false });
    };

    render(input) {
        const content = (
            <View
                style={[
                    styles.inputContainer,
                    this.props.customize.inputContainerStyle,
                    this.props.type === formSwitchType
                        ? styles.switchInputContainer
                        : null,
                    this.props.containerStyle,
                ]}
            >
                <Label
                    {...this.props}
                    handleSwitchCase
                />
                {this.props.insertBefore}
                {input}
                {this.props.insertAfter}
                {!this.props.displayErrorsGlobally && this.state.error
                    ? <Error
                        style={[
                            this.props.customize.inputErrorStyle,
                            this.props.errorStyle,
                        ]}
                        containerStyle={[
                            this.props.customize.inputErrorContainerStyle,
                            this.props.errorContainerStyle,
                        ]}
                        error={this.state.error}
                    />
                    : null
                }
            </View>
        );

        if (
            this.props.asModal
            && !(
                this.props.type === formRadioType
                && Platform.OS === 'android'
            )
        ) {
            const selectedOption = this.props.options.find((option) => option.value === this.state.value);

            return (
                <View
                    style={[
                        styles.modalButtonContainer,
                        this.props.customize.inputModalButtonContainerStyle,
                        this.props.inputModalButtonContainerStyle,
                    ]}
                >
                    <Label {...this.props} />
                    <Button
                        containerStyle={[
                            styles.modalButtonContainerStyle,
                            this.props.customize.inputModalButtonStyle,
                            this.props.inputModalButtonStyle,
                        ]}
                        onPress={this.handleShowModal}
                    >
                        <Text
                            style={[
                                this.props.customize.inputModalButtonTextStyle,
                                this.props.inputModalButtonTextStyle,
                            ]}
                        >
                            {`${this.props.modalButtonLabel ? `${this.props.modalButtonLabel} ` : ''}${selectedOption ? selectedOption.label : this.props.defaultLabel}`}
                        </Text>
                    </Button>
                    <Modal
                        visible={this.state.modalVisible}
                        transparent={this.props.modalTransparent || this.props.customize.modalTransparent || true}
                    >
                        <TouchableWithoutFeedback
                            onPress={this.handleHideModal}
                        >
                            <View
                                style={[
                                    styles.modal,
                                    this.props.customize.modalStyle,
                                    this.props.modalStyle,
                                ]}
                            >
                                {/* Hack to make the children touchable */}
                                <TouchableWithoutFeedback>
                                    <View
                                        style={[
                                            styles.modalContentContainer,
                                            this.props.customize.modalContentContainerStyle,
                                            this.props.modalContentContainerStyle,
                                        ]}
                                    >
                                        {content}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            );
        }

        return content;
    }
}

const Label = (props) => (
    props.label
        ? <View
            style={[
                styles.labelContainer,
                props.customize.inputLabelContainerStyle,
                props.type === formSwitchType && props.handleSwitchCase
                    ? styles.switchInputLabelContainer
                    : null,
                props.labelContainerStyle,
            ]}
        >
            <Text
                style={[
                    styles.label,
                    props.customize.inputLabelStyle,
                    props.labelStyle,
                ]}
            >
                {props.label}
            </Text>
        </View>
        : null
);

Label.propTypes = {
    customize: React.PropTypes.object,
    handleSwitchCase: React.PropTypes.bool,
    label: React.PropTypes.string,
    labelContainerStyle: View.propTypes.style,
    labelStyle: Text.propTypes.style,
    type: React.PropTypes.string,
};
