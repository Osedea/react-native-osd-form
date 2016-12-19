import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { includes, findIndex, reduce } from 'lodash';

import colors from './colors';
import Error from './Error';
import FormGroup from './FormGroup';
import FormButton from './inputs/FormButton';
import FormCheckbox from './inputs/FormCheckbox';
import FormCheckboxInput from './inputs/FormCheckboxInput';
import FormCheckboxes from './inputs/FormCheckboxes';
import FormDateTimeInput from './inputs/FormDateTimeInput';
import FormMediaInput from './inputs/FormMediaInput';
import FormPills from './inputs/FormPills';
import FormRadio from './inputs/FormRadio';
import FormRangeInput from './inputs/FormRangeInput';
import FormSeparator from './inputs/FormSeparator';
import FormSwitch from './inputs/FormSwitch';
import FormTextInput from './inputs/FormTextInput';
import { validateInput } from './validation';

const HIDDEN_TYPE = 'hidden';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    globalError: {
        color: colors.white,
    },
    globalErrorContainer: {
        backgroundColor: colors.transparentRed,
        marginBottom: 5,
    },
});

// Types that we can do something on when hitting NEXT on the previous field
const interactableTypes = [
    ...FormTextInput.acceptedTypes,         // Focus
    ...FormButton.acceptedTypes,            // Execute the onPress method
    ...FormMediaInput.acceptedTypes,        // Open the picker
];

export default class Form extends Component {
    static propTypes = {
        customize: React.PropTypes.shape({
            inputContainerStyle: View.propTypes.style,
            inputLabelContainerStyle: View.propTypes.style,
            inputLabelStyle: Text.propTypes.style,
            inputContainerErrorStyle: View.propTypes.style,
            inputErrorStyle: Text.propTypes.style,
            inputErrorContainerStyle: View.propTypes.style,
            inputModalButtonContainerStyle: View.propTypes.style,
            inputModalButtonIconStyle: Image.propTypes.style,
            inputModalButtonStyle: View.propTypes.style,
            inputModalButtonTextStyle: Text.propTypes.style,
            FormGroupInputsContainer: FormGroup.propTypes.inputsContainerStyle,
            FormGroupStyle: FormGroup.propTypes.style,
            FormGroupLabelStyle: FormGroup.propTypes.labelStyle,
            ErrorStyle: Error.propTypes.style,
            ErrorContainerStyle: Error.propTypes.containerStyle,
            FormButtonContainerStyle: FormButton.propTypes.containerStyle,
            FormButtonTextContainerStyle: FormButton.propTypes.textContainerStyle,
            FormButtonTextStyle: FormButton.propTypes.textStyle,
            FormButtonUnderlayColor: FormButton.propTypes.underlayColor,
            FormCheckboxContainerStyle: FormCheckbox.propTypes.containerStyle,
            FormCheckboxCheckboxStyle: FormCheckbox.propTypes.checkboxStyle,
            FormCheckboxLabelContainerStyle: FormCheckbox.propTypes.labelContainerStyle,
            FormCheckboxLabelStyle: FormCheckbox.propTypes.labelStyle,
            FormCheckboxStyle: FormCheckbox.propTypes.style,
            FormCheckboxUnderlayColor: FormCheckbox.propTypes.underlayColor,
            FormCheckboxesContainerStyle: FormCheckboxes.propTypes.containerStyle,
            FormCheckboxesLabelContainerStyle: FormCheckboxes.propTypes.labelContainerStyle,
            FormCheckboxesLabelStyle: FormCheckboxes.propTypes.labelStyle,
            FormCheckboxesStyle: FormCheckboxes.propTypes.style,
            FormCheckboxesCheckboxStyle: FormCheckboxes.propTypes.checkboxStyle,
            FormDateTimeInputIosDoneButtonText: FormDateTimeInput.propTypes.iosDoneButtonText,
            FormDateTimeInputIosDoneButtonStyle: FormDateTimeInput.propTypes.iosDoneButtonStyle,
            FormDateTimeInputIosClosePickerButtonTextContainerStyle: FormDateTimeInput.propTypes.iosClosePickerButtonTextContainerStyle,
            FormDateTimeInputIosClosePickerButtonTextStyle: FormDateTimeInput.propTypes.iosClosePickerButtonTextStyle,
            FormDateTimeInputLabel: FormDateTimeInput.propTypes.label,
            // FormMediaInputStyle: FormMediaInput.propTypes.style,
            // FormMediaInputContainerStyle: FormMediaInput.propTypes.containerStyle,
            FormPillsContainerStyle: FormPills.propTypes.containerStyle,
            FormPillsUnderlayColor: FormPills.propTypes.underlayColor,
            FormPillsPillContainerStyle: FormPills.propTypes.options.pillContainerStyle,
            FormPillsPillSelectedContainerStyle: FormPills.propTypes.options.selectedContainerStyle,
            FormPillsPillTextStyle: FormPills.propTypes.options.pillTextStyle,
            FormPillsPillSelectedStyle: FormPills.propTypes.options.selectedStyle,
            FormRadioPickerItemStyle: FormRadio.propTypes.itemStyle,
            FormRadioPickerStyle: FormRadio.propTypes.style,
            FormRangeInputContainerStyle: FormRangeInput.propTypes.containerStyle,
            FormRangeInputTrackStyle: FormRangeInput.propTypes.trackStyle,
            FormRangeInputSelectedStyle: FormRangeInput.propTypes.selectedStyle,
            FormRangeInputUnselectedStyle: FormRangeInput.propTypes.unselectedStyle,
            FormRangeInputMarkerStyle: FormRangeInput.propTypes.markerStyle,
            FormRangeInputPressedMarkerStyle: FormRangeInput.propTypes.pressedMarkerStyle,
            FormSeparatorStyle: FormSeparator.propTypes.style,
            FormSwitchContainerStyle: View.propTypes.style,
            FormSwitchLabelStyle: Text.propTypes.style,
            FormSwitchOnTintColor: FormSwitch.propTypes.onTintColor,
            FormSwitchTintColor: FormSwitch.propTypes.tintColor,
            FormSwitchThumbTintColor: FormSwitch.propTypes.thumbTintColor,
            FormTextInputStyle: FormTextInput.propTypes.style,
            FormTextInputContainerStyle: FormTextInput.propTypes.containerStyle,
            FormTextInputPlaceholderTextColor: FormTextInput.propTypes.placeholderTextColor,
            modalContentContainerStyle: View.propTypes.style,
            modalStyle: View.propTypes.style,
            modalTransparent: React.PropTypes.bool,
        }),
        disableLastInputSubmits: React.PropTypes.bool,
        // Set `displayErrorsGlobally` to true to have the errors displaying
        // at the bottom of the Form component and not on each of the invalid inputs
        displayErrorsGlobally: React.PropTypes.bool,
        executeRequest: React.PropTypes.bool,
        /* if executeRequest is true:
        action: React.PropTypes.string, // url
        method: React.PropTypes.oneOf(['GET', 'POST', 'PUT', 'DELETE']),
        triggerSubmitFunction will return a promise ?
        */
        formGroups: React.PropTypes.arrayOf(React.PropTypes.shape(FormGroup.propTypes)),
        globalErrorContainerStyle: View.propTypes.style,
        globalErrorStyle: Text.propTypes.style,
        // You don't HAVE to use formGroups, you can just pass your inputs directly
        // It WILL however create a formGroup around them by default
        inputs: FormGroup.propTypes.inputs,
        noValidate: React.PropTypes.bool,
        // `onChange` will be called at any change in the Form.
        // It will not provide any value, just call the function
        onChange: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        style: View.propTypes.style,
        triggerSubmitFunctionRef: React.PropTypes.func,
    };

    static defaultProps = {};

    formRefs = {};

    constructor(props) {
        super(props);

        if (this.props.triggerSubmitFunctionRef && typeof this.props.triggerSubmitFunctionRef === 'function') {
            this.props.triggerSubmitFunctionRef(this.handleSubmit);
        }

        this.inputs = props.formGroups
            ? props.formGroups.reduce((results, formGroup) => {
                formGroup.inputs.forEach((input) => {
                    if (!(
                        includes(FormButton.acceptedTypes, input.type)
                        || input.type === FormSeparator.type
                    )) {
                        results.push(input);
                    }
                });

                return results;
            }, [])
            : props.inputs.filter(
                (input) => !(
                    includes(FormButton.acceptedTypes, input.type)
                    || input.type === FormSeparator.type
                )
            );

        // To know if we need to put the autoFocus on the first field
        // or if the user defined it on one of the fields
        this.isAutoFocusDefined = findIndex(this.inputs, (input) => input.autoFocus) !== -1;

        this.state = {
            isValid: false,
            errors: {},
            values: this.getInitialValues(this.inputs),
            secureTextEntry: {},
        };
    }

    componentWillReceiveProps = (nextProps) => {
        const newStateValue = {};

        this.inputs = nextProps.formGroups
            ? nextProps.formGroups.reduce((results, formGroup) => {
                formGroup.inputs.forEach((input) => {
                    if (input.type === FormCheckboxInput.type && input.checked) {
                        newStateValue[input.name] = true;
                    } else if (input.type === FormCheckboxes.type) {
                        input.options.forEach((option) => {
                            if (option.checked) {
                                if (!newStateValue[input.name]) {
                                    newStateValue[input.name] = [];
                                }
                                newStateValue[input.name].push(option.value);
                            }
                        });
                    } else if (includes(FormTextInput.acceptedTypes, input.type) || includes(FormMediaInput.acceptedTypes, input.type)) {
                        const inputFound = this.inputs.find((foundInput) => input.name === foundInput.name);

                        if (inputFound && input.value !== inputFound.value) {
                            newStateValue[input.name] = input.value;
                        }
                    } else if (input.type === HIDDEN_TYPE) {
                        newStateValue[input.name] = input.value;
                    }

                    results.push(input);
                });

                return results;
            }, [])
            : nextProps.inputs.filter(
                (input) => !(
                    includes(FormButton.acceptedTypes, input.type)
                    || input.type === FormSeparator.type
                )
            );

        setTimeout(() => {
            this.setState({
                values: {
                    ...this.state.values,
                    ...newStateValue,
                },
            });
        }, 300);
    }

    getInitialValues = () => {
        const initialValues = this.inputs.reduce(
            (result, input) => {
                if (input.type === FormCheckboxes.type) {
                    result[input.name] = reduce(
                        input.options,
                        (subResult, option) => {
                            if (option.defaultChecked) {
                                subResult.push(option.value);
                            }

                            return subResult;
                        },
                        [] // Initial 'subResult' object
                    );
                } else if (input.type === FormCheckboxInput.type) {
                    result[input.name] = input.initialValue || input.value || false;
                } else if (input.type === FormRangeInput.type) {
                    result[input.name] = input.initialValues || input.values;
                } else {
                    result[input.name] = input.initialValue || input.value;
                }

                return result;
            },
            {} // Initial 'result' object
        );

        return initialValues;
    }

    handleRef = (component, name) => {
        this.formRefs[name] = component;
    };

    checkErrors = () => {
        const isValid = Object.keys(this.state.errors).length === 0;

        this.setState({
            errors: this.state.errors,
            isValid,
        });

        return isValid;
    }

    validateAllFields = () => {
        const errors = {};
        const values = {};

        this.inputs.forEach((input) => {
            let result;

            if (this.formRefs[input.name]) {
                result = this.formRefs[input.name].validateInput(this.state.values[input.name]);
            } else {
                result = validateInput(input, this.state.values[input.name]);
            }

            if (result.error) {
                errors[input.name] = result.error;
            }
            values[input.name] = result.value;
        });

        const isValid = Object.keys(errors).length === 0;

        this.setState({
            errors,
            values,
            isValid,
        });

        return isValid;
    }

    handleFocus = (input) => {
        this.focusedInput = this.formRefs[input.name];
    }

    handleInputEnd = (input) => {
        const index = findIndex(
            this.inputs,
            (inputConsidered) => (input.name === inputConsidered.name)
        );
        const nextInput = this.inputs[index + 1];

        if (!nextInput) {
            if (!this.props.disableLastInputSubmits) {
                this.handleSubmit();
            }

            return;
        }

        if (includes(interactableTypes, nextInput.type)) {
            if (includes(FormTextInput.acceptedTypes, nextInput.type)) {
                if (
                    this.formRefs[nextInput.name]
                    && (
                        (
                            nextInput.hasOwnProperty('editable')
                            && nextInput.editable
                        )
                        || (
                            nextInput.hasOwnProperty('disabled')
                            && !nextInput.disabled
                        )
                        || (
                            !nextInput.hasOwnProperty('editable')
                            && !nextInput.hasOwnProperty('disabled')
                        )
                    )
                    && !nextInput.nextSkip
                ) {
                    this.formRefs[nextInput.name].focus();
                }
            } else if (nextInput.nextSkip) {
                this.handleInputEnd(nextInput);
            } else if (nextInput.type === 'image' || nextInput.type === 'video') {
                // TODO Open image picker
                console.log('Open image/video picker');
            } else {
                if (this.formRefs[input.name]) {
                    this.formRefs[input.name].blur();
                }
            }
        }

        return true;
    }

    handleChange = (changeInput) => {
        this.setState({
            values: {
                ...this.state.values,
                [changeInput.name]: changeInput.value,
            },
            errors: {
                ...this.state.errors,
                [changeInput.name]: changeInput.error,
            },
        });

        if (this.props.onChange) {
            this.props.onChange(changeInput);
        }
    }

    handleSubmit = () => {
        if (this.focusedInput) {
            this.focusedInput.blur();
        }

        if (this.validateAllFields()) {
            if (this.props.onSubmit) {
                if (this.props.executeRequest) {
                    // Do the request and then call this.props.onSubmit
                } else {
                    this.props.onSubmit(this.state.values);
                }
            } else {
                console.log('Not doing anything on submit?');
            }
        }
    };

    render() {
        return (
            <View
                style={[
                    styles.container,
                    this.props.style,
                ]}
            >
                {this.props.formGroups
                    ? this.props.formGroups.map((formGroup, formGroupsIndex) => (
                        <FormGroup
                            {...formGroup}
                            displayErrorsGlobally={this.props.displayErrorsGlobally}
                            customize={this.props.customize}
                            noValidate={this.props.noValidate}
                            onChange={this.handleChange}
                            key={`formGroup-${formGroupsIndex}`}
                            onRef={this.handleRef}
                            onInputEnd={this.handleInputEnd}
                            onFocus={this.handleFocus}
                            onSubmit={this.handleSubmit}
                        />
                    ))
                    : <FormGroup
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        inputs={this.props.inputs}
                        customize={this.props.customize}
                        noValidate={this.props.noValidate}
                        onChange={this.handleChange}
                        onRef={this.handleRef}
                        onInputEnd={this.handleInputEnd}
                        onFocus={this.handleFocus}
                        onSubmit={this.handleSubmit}
                    />
                }
                {this.props.displayErrorsGlobally
                    ? Object.values(this.state.errors).map((error) => (
                        <Error
                            style={[
                                styles.globalError,
                                this.props.globalErrorStyle,
                            ]}
                            containerStyle={[
                                styles.globalErrorContainer,
                                this.props.globalErrorContainerStyle,
                            ]}
                            error={error}
                            key={`error-${error}`}
                        />
                    ))
                    : null
                }
            </View>
        );
    }
}
