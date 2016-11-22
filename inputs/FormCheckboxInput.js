import React from 'react';

import FormCheckbox from './FormCheckbox';
import Input from '../Input';
import { formCheckboxType } from './types';

export default class FormCheckboxInput extends Input {
    static type = formCheckboxType;

    static propTypes = {
        checkboxLabel: React.PropTypes.string,
        type: React.PropTypes.oneOf([FormCheckboxInput.type]),
        ...Input.propTypes,
    };

    handleCheckboxChange = (value) => {
        this.handleChange(value);
        this.handleInputEnd();
    }

    render() {
        return super.render(
            <FormCheckbox
                {...this.props}
                onChange={this.handleCheckboxChange}
                checked={this.state.value || this.props.checked}
                label={this.props.checkboxLabel}
                ref={this.handleRef}
            />
        );
    }
}
