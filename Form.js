import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { includes, findIndex, forEach, reduce } from 'lodash';

import colors from './colors';
import Error from './Error';
import FormGroup from './FormGroup';
import FormButton from './inputs/FormButton';
import FormCheckbox from './inputs/FormCheckbox';
import FormCheckboxes from './inputs/FormCheckboxes';
import FormDateTimeInput from './inputs/FormDateTimeInput';
import FormMediaInput from './inputs/FormMediaInput';
import FormPills from './inputs/FormPills';
import FormRadio from './inputs/FormRadio';
import FormRangeInput from './inputs/FormRangeInput';
import FormSeparator from './inputs/FormSeparator';
import FormSwitch from './inputs/FormSwitch';
import FormTextInput from './inputs/FormTextInput';

const HIDDEN_TYPE = 'hidden';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    globalError: {
        color: colors.black,
    },
    globalErrorContainer: {
        backgroundColor: colors.transparentRed,
    },
});

// Types that we can do something on when hitting NEXT on the previous field
const interactableTypes = [
    ...FormTextInput.acceptedTypes,       // Focus
    ...FormButton.acceptedTypes,     // Execute the onPress method
    'image',                // Open the picker
    'file',                 // Open the picker
];

export default class Form extends Component {
    static propTypes = {
        // executeRequest: React.PropTypes.bool,
        /* if executeRequest is true:
        action: React.PropTypes.string, // url
        method: React.PropTypes.oneOf(['GET', 'POST', 'PUT', 'DELETE']),
        triggerSubmitFunction will return a promise ?
        */
        // Set `displayErrorsGlobally` to true to have the errors displaying
        // at the bottom of the Form component and not on each of the invalid inputs
        displayErrorsGlobally: React.PropTypes.bool,
        formGroups: React.PropTypes.arrayOf(FormGroup),
        globalErrorContainerStyle: View.propTypes.style,
        globalErrorStyle: Text.propTypes.style,
        globalStyles: React.PropTypes.shape({
            inputContainerStyle: View.propTypes.style,
            placeholderTextColor: TextInput.propTypes.placeholderTextColor,
            labelStyle: Text.propTypes.style,
            formGroupStyle: FormGroup.propTypes.style,
            ErrorStyle: Error.propTypes.style,
            ErrorContainerStyle: Error.propTypes.containerStyle,
            FormCheckboxesStyle: FormCheckboxes.propTypes.style,
            FormCheckboxesContainerStyle: FormCheckboxes.propTypes.containerStyle,
            FormCheckboxStyle: FormCheckbox.propTypes.style,
            FormCheckboxContainerStyle: FormCheckbox.propTypes.containerStyle,
            FormDateTimeInputStyle: FormDateTimeInput.propTypes.style,
            FormDateTimeInputContainerStyle: FormDateTimeInput.propTypes.containerStyle,
            FormMediaInputStyle: FormMediaInput.propTypes.style,
            FormMediaInputContainerStyle: FormMediaInput.propTypes.containerStyle,
            FormRadioStyle: FormRadio.propTypes.style,
            FormRadioContainerStyle: FormRadio.propTypes.containerStyle,
            FormPillsStyle: FormPills.propTypes.style,
            FormPillsContainerStyle: FormPills.propTypes.containerStyle,
            FormRangeInputStyle: FormRangeInput.propTypes.style,
            FormRangeInputContainerStyle: FormRangeInput.propTypes.containerStyle,
            FormSeparatorStyle: FormSeparator.propTypes.style,
            FormSeparatorContainerStyle: FormSeparator.propTypes.containerStyle,
            FormSwitchStyle: FormSwitch.propTypes.style,
            FormSwitchContainerStyle: FormSwitch.propTypes.containerStyle,
            FormTextInputStyle: FormTextInput.propTypes.style,
            FormTextInputContainerStyle: FormTextInput.propTypes.containerStyle,
        }),
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
                    results.push(input);
                });

                return results;
            }, [])
            : props.inputs;

        // To know if we need to put the autoFocus on the first field
        // or if the user defined it on one of the fields
        this.isAutoFocusDefined = findIndex(this.inputs, (input) => input.autoFocus) !== -1;

        this.state = {
            isValid: false,
            formErrors: {},
            values: this.getInitialValues(this.inputs),
            secureTextEntry: {},
        };
    }

    componentWillReceiveProps = (nextProps) => {
        const newStateValue = {};

        this.inputs = nextProps.formGroups.reduce((results, formGroup) => {
            formGroup.inputs.forEach((input) => {
                if (input.type === FormCheckbox.type && input.checked) {
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
        }, []);

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
                if (input.type === HIDDEN_TYPE) {
                    result[input.name] = input.value;
                } else if (input.type === FormPills.type) {
                    result[input.name] = input.initialValue;
                } else if (input.type === FormRadio.type) {
                    result[input.name] = input.value;
                } else if (input.type === FormCheckboxes.type) {
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
                } else if (includes(FormTextInput.acceptedTypes, input.type)) {
                    result[input.name] = input.value;
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

        forEach(this.inputs, (input) => {
            this.validateInput(input, this.state.values[input.name], errors);
        });

        return this.checkErrors();
    }

    onInputEnd = (input) => {
        const index = findIndex(
            this.inputs,
            input
        );
        const nextInput = this.inputs[index + 1];
        let func = null;

        if (!nextInput) {
            return func;
        }

        if (includes(interactableTypes, nextInput.type)) {
            if (includes(FormTextInput.acceptedTypes, nextInput.type)) {
                func = () => {
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
                };
            } else if (nextInput.nextSkip) {
                func = this.createSubmitEditingHandler(nextInput);
            } else if (nextInput.type === 'submit') {
                // ! \\ Call two times when the arrow is clicked on android
                func = this.handleSubmit;
            } else if (nextInput.type === 'button') {
                func = nextInput.onPress;
            } else if (nextInput.type === 'image' || nextInput.type === 'video') {
                // TODO Open image picker
                func = () => console.log('Open image/video picker');
            } else {
                func = () => {
                    if (this.formRefs[input.name]) {
                        this.formRefs[input.name].blur();
                    }
                };
            }
        }

        return func;
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
        console.log(this.state.values);
        if (this.focusedInput) {
            this.focusedInput.blur();
        }

        if (this.validateAllFields()) {
            this.props.onSubmit(this.state.values);
        }
    };

    render() {
        console.log(this.formRefs);
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
                            globalStyles={this.props.globalStyles}
                            noValidate={this.props.noValidate}
                            onChange={this.handleChange}
                            key={`formGroup-${formGroupsIndex}`}
                            onRef={this.handleRef}
                            onInputEnd={this.onInputEnd}
                        />
                    ))
                    : <FormGroup
                        inputs={this.props.inputs}
                        globalStyles={this.props.globalStyles}
                        noValidate={this.props.noValidate}
                        onChange={this.handleChange}
                        onRef={this.handleRef}
                        onInputEnd={this.onInputEnd}
                    />
                }
                {this.props.displayErrorsGlobally
                    ? this.state.formErrors.map((error, index) => (
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
                            key={`error-${index}`}
                        />
                    ))
                    : null
                }
            </View>
        );
    }
}
