import React from 'react';
import DateTimePicker from 'react-native-osd-datetimepicker';
import Input from '../Input';

export default class FormDateTimeInput extends Input {
    static acceptedTypes = [
        'date',
        'datetime',
        'time',
    ];

    static propTypes = {
        type: React.PropTypes.oneOf(this.acceptedTypes),
        ...DateTimePicker.propTypes,
        ...Input.propTypes,
    };

    handleDateChange = (value) => {
        this.handleChange(value);
        this.handleInputEnd();
    }

    render() {
        return super.render(
            <DateTimePicker
                {...this.props}
                label={this.props.inputLabel}
                date={this.state.value}
                mode={this.props.type}
                onChange={this.handleDateChange}
            />
        );
    }
}
