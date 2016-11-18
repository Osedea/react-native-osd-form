import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { includes } from 'lodash';

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
            return FormTextInput.propTypes(props, propName, componentName, ...rest);
        } else if (FormButton.acceptedTypes.indexOf(propsToTest.type) >= 0) {
            // Button-like inputs using https://github.com/Osedea/react-native-osd-simple-button
            return FormButton.propTypes(props, propName, componentName, ...rest);
        } else if (FormDateTimeInput.acceptedTypes.indexOf(propsToTest.type) >= 0) {
            // Temporal inputs using https://github.com/Osedea/react-native-osd-datetimepicker
            return FormDateTimeInput.propTypes(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'checkboxes') {
            // Wrapping several react-native-checkbox as one input component
            // using https://github.com/sconxu/react-native-checkbox
            return FormCheckboxes.propTypes(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'checkbox') {
            // Simple checkbox using https://github.com/sconxu/react-native-checkbox
            return FormCheckbox.propTypes(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'radio') {
            // Using RN Picker https://facebook.github.io/react-native/docs/picker.html
            return FormRadio.propTypes(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'pills') {
            return FormPills.propTypes(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'range') {
            // Slider using https://github.com/JackDanielsAndCode/react-native-multi-slider
            return FormRangeInput.propTypes(props, propName, componentName, ...rest);
        } else if (FormMediaInput.acceptedTypes.indexOf(propsToTest.type) >= 0) {
            // Image picker using https://github.com/marcshilling/react-native-image-picker
            return FormMediaInput.propTypes(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'hidden') {
            // Hidden field
            return React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                value: React.PropTypes.string.isRequired,
            });
        } else if (propsToTest.type === 'separator') {
            // Separator
            return FormSeparator.propTypes(props, propName, componentName, ...rest);
        } else if (propsToTest.type === 'switch') {
            return FormSwitch.propTypes(props, propName, componentName, ...rest);
        } else {
            return new Error(`Type '${propsToTest.type}' of input is not recognized.`);
        }
    });
};

export default class FormGroup extends Component {
    static propTypes = {
        inputs: React.PropTypes.arrayOf(inputPropType).isRequired,
        insertAfter: React.PropTypes.node,
        insertBefore: React.PropTypes.node,
        noValidate: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        onRef: React.PropTypes.func,
        onInputEnd: React.PropTypes.func,
        style: View.propTypes.style,
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
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`Pills-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (inputObject.type === FormCheckboxes.type) {
                input = (
                    <FormCheckboxes
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`Checkboxes-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (inputObject.type === FormCheckbox.type) {
                input = (
                    <FormCheckbox
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`Checkbox-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (inputObject.type === FormRadio.type) {
                input = (
                    <FormRadio
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`Radio-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (inputObject.type === FormRangeInput.type) {
                input = (
                    <FormRangeInput
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`RangeInput-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (includes(FormTextInput.acceptedTypes, inputObject.type)) {
                input = (
                    <FormTextInput
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`TextInput-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (includes(FormButton.acceptedTypes, inputObject.type)) {
                input = (
                    <FormButton
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`Button-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                    />
                );
            } else if (includes(FormMediaInput.acceptedTypes, inputObject.type)) {
                input = (
                    <FormMediaInput
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`MediaInput-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (includes(FormDateTimeInput.acceptedTypes, inputObject.type)) {
                input = (
                    <FormDateTimeInput
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`DateTimeInput-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (inputObject.type === FormSeparator.type) {
                input = (
                    <FormSeparator
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`Separator-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
                    />
                );
            } else if (inputObject.type === FormSwitch.type) {
                input = (
                    <FormSwitch
                        {...inputObject}
                        noValidate={this.props.noValidate}
                        onFormChange={this.props.onChange}
                        key={`Switch-${index}`}
                        globalStyles={this.props.globalStyles}
                        onRef={this.props.onRef}
                        onInputEnd={this.props.onInputEnd}
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
                    this.props.globalStyles
                        ? this.props.globalStyles.formGroupStyle
                        : null,
                ]}
            >
                {this.props.insertBefore}
                {inputsRender}
                {this.props.insertAfter}
            </View>
        );
    }
}
