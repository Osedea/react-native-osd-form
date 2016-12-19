import React from 'react';
import DateTimePicker from 'react-native-osd-datetimepicker';

import Input from '../Input';
import { formDateTimeInputAcceptedTypes } from './types';

export default class FormDateTimeInput extends Input {
    static acceptedTypes = formDateTimeInputAcceptedTypes;

    static propTypes = {
        type: React.PropTypes.oneOf(FormDateTimeInput.acceptedTypes),
        ...DateTimePicker.propTypes,
        ...Input.propTypes,
    };

    static defaultProps = {
        customize: {},
    };

    handleDateChange = (value) => {
        this.handleChange(value);
        this.handleInputEnd();
    }

    render() {
        return super.render(
            <DateTimePicker
                {...this.props}
                containerStyle={[
                    this.props.containerStyle,
                    this.state.error && this.props.customize.inputContainerErrorStyle
                        ? this.props.customize.inputContainerErrorStyle
                        : null,
                    this.props.containerErrorStyle,
                ]}
                iosDoneButtonText={this.props.customize.FormDateTimeInputIosDoneButtonText}
                iosDoneButtonStyle={[
                    this.props.customize.FormDateTimeInputIosDoneButtonStyle,
                    this.props.iosDoneButtonStyle,
                ]}
                iosClosePickerButtonTextContainerStyle={[
                    this.props.customize.FormDateTimeInputIosClosePickerButtonTextContainerStyle,
                    this.props.iosClosePickerButtonTextContainerStyle,
                ]}
                iosClosePickerButtonTextStyle={[
                    this.props.customize.FormDateTimeInputIosClosePickerButtonTextStyle,
                    this.props.iosClosePickerButtonTextStyle,
                ]}
                label={this.props.inputLabel || this.props.customize.FormDateTimeInputLabel}
                date={this.state.value}
                mode={this.props.type}
                onChange={this.handleDateChange}
                ref={this.handleRef}
            />
        );
    }
}
