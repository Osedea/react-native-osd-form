import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { includes } from 'lodash';

import FormButton from './inputs/FormButton';
import FormCheckbox from './inputs/FormCheckboxInput';
import FormCheckboxes from './inputs/FormCheckboxes';
import FormDateTimeInput from './inputs/FormDateTimeInput';
import FormMediaInput from './inputs/FormMediaInput';
import FormPills from './inputs/FormPills';
import FormRadio from './inputs/FormRadio';
import FormRangeInput from './inputs/FormRangeInput';
import FormSeparator from './inputs/FormSeparator';
import FormSwitch from './inputs/FormSwitch';
import FormTextInput from './inputs/FormTextInput';

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
    },
});

const inputPropType = (props, propName, componentName, ...rest) => {
    props.forEach((propsToTest) => {
        if (FormTextInput.acceptedTypes.indexOf(propsToTest.type) >= 0) {
            // Text-like inputs using https://facebook.github.io/react-native/docs/textinput.html
            return FormTextInput.propTypes;
        } else if (FormButton.acceptedTypes.indexOf(propsToTest.type) >= 0) {
            // Button-like inputs using https://github.com/Osedea/react-native-osd-simple-button
            return FormButton.propTypes;
        } else if (FormDateTimeInput.acceptedTypes.indexOf(propsToTest.type) >= 0) {
            // Temporal inputs using https://github.com/Osedea/react-native-osd-datetimepicker
            return FormDateTimeInput.propTypes;
        } else if (propsToTest.type === 'checkboxes') {
            // Wrapping several react-native-checkbox as one input component
            // using https://github.com/sconxu/react-native-checkbox
            return FormCheckboxes.propTypes;
        } else if (propsToTest.type === 'checkbox') {
            // Simple checkbox using https://github.com/sconxu/react-native-checkbox
            return FormCheckbox.propTypes;
        } else if (propsToTest.type === 'radio') {
            // Using RN Picker https://facebook.github.io/react-native/docs/picker.html
            return FormRadio.propTypes;
        } else if (propsToTest.type === 'pills') {
            return FormPills.propTypes;
        } else if (propsToTest.type === 'range') {
            // Slider using https://github.com/JackDanielsAndCode/react-native-multi-slider
            return FormRangeInput.propTypes;
        } else if (FormMediaInput.acceptedTypes.indexOf(propsToTest.type) >= 0) {
            // Image picker using https://github.com/marcshilling/react-native-image-picker
            return FormMediaInput.propTypes;
        } else if (propsToTest.type === 'hidden') {
            // Hidden field
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                value: React.PropTypes.string.isRequired,
            });
        } else if (propsToTest.type === 'separator') {
            // Separator
            return FormSeparator.propTypes;
        } else if (propsToTest.type === 'switch') {
            return FormSwitch.propTypes;
        } else {
            return new Error(`Type '${propsToTest.type}' of input is not recognized.`);
        }
    });
};

export default class FormGroup extends Component {
    static propTypes = {
        inputs: React.PropTypes.arrayOf(inputPropType),
        inputsContainerStyle: View.propTypes.style,
        insertAfter: React.PropTypes.node,
        insertBefore: React.PropTypes.node,
        label: React.PropTypes.string,
        labelStyle: Text.propTypes.style,
        noValidate: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onInputEnd: React.PropTypes.func,
        onRef: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        style: View.propTypes.style,
    };

    static defaultProps = {
        customize: {},
    };

    render() {
        const inputsRender = this.props.inputs.map((inputObject, index) => {
            let input = null;

            if (inputObject.type === 'hidden') {
                return null;
            } else if (inputObject.type === FormPills.type) {
                input = (
                    <FormPills
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`Pills-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            } else if (inputObject.type === FormCheckboxes.type) {
                input = (
                    <FormCheckboxes
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`Checkboxes-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            } else if (inputObject.type === FormCheckbox.type) {
                input = (
                    <FormCheckbox
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`Checkbox-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            } else if (inputObject.type === FormRadio.type) {
                input = (
                    <FormRadio
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`Radio-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            } else if (inputObject.type === FormRangeInput.type) {
                input = (
                    <FormRangeInput
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`RangeInput-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            } else if (includes(FormTextInput.acceptedTypes, inputObject.type)) {
                input = (
                    <FormTextInput
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`TextInput-${index}`}
                        noValidate={this.props.noValidate}
                        onFocus={this.props.onFocus}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            } else if (includes(FormButton.acceptedTypes, inputObject.type)) {
                input = (
                    <FormButton
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`Button-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onRef={this.props.onRef}
                        onSubmit={this.props.onSubmit}
                    />
                );
            } else if (includes(FormMediaInput.acceptedTypes, inputObject.type)) {
                input = (
                    <FormMediaInput
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`MediaInput-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            } else if (includes(FormDateTimeInput.acceptedTypes, inputObject.type)) {
                input = (
                    <FormDateTimeInput
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`DateTimeInput-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            } else if (inputObject.type === FormSeparator.type) {
                input = (
                    <FormSeparator
                        {...inputObject}
                        customize={this.props.customize}
                        key={`Separator-${index}`}
                    />
                );
            } else if (inputObject.type === FormSwitch.type) {
                input = (
                    <FormSwitch
                        {...inputObject}
                        displayErrorsGlobally={this.props.displayErrorsGlobally}
                        customize={this.props.customize}
                        key={`Switch-${index}`}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        onInputEnd={this.props.onInputEnd}
                        onRef={this.props.onRef}
                    />
                );
            }

            if (!input) {
                console.log(
                    `Input type unrecognized ${
                        inputObject.type
                    }. Ignoring field "${
                        inputObject.name
                    }"`
                );

                return null;
            }

            return input;
        });

        return (
            <View
                style={[
                    styles.container,
                    this.props.style,
                    this.props.customize.FormGroupStyle,
                ]}
            >
                {this.props.insertBefore}
                {this.props.label
                    ? <Text
                        style={[
                            styles.label,
                            this.props.customize.FormGroupLabelStyle,
                            this.props.labelStyle,
                        ]}
                    >
                        {this.props.label}
                    </Text>
                    : null
                }
                <View
                    style={[
                        styles.inputsContainer,
                        this.props.customize.FormGroupInputsContainer,
                        this.props.inputsContainerStyle,
                    ]}
                >
                    {inputsRender}
                </View>
                {this.props.insertAfter}
            </View>
        );
    }
}
