import React from 'react';

import FormCheckbox from './FormCheckbox';
import Input from '../Input';

export default class FormCheckboxInput extends Input {
    static type = 'checkbox';

    static propTypes = {
        checkboxLabel: React.PropTypes.string,
        type: React.PropTypes.oneOf(['checkbox']),
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
